import React, { useState, useEffect, useRef } from "react";

// ----------------------------------------------------
// FUNCIÓN AUXILIAR PARA CARGAR EL SCRIPT DE FORMA ROBUSTA CON PROMISE
// ----------------------------------------------------
const loadMercadoPagoScript = (publicKey) => {
  return new Promise((resolve, reject) => {
    if (window.MercadoPago) {
      console.log("Mercado Pago SDK ya cargado.");
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.id = "mercadopago-sdk";

    script.setAttribute("data-public-key", publicKey);
    script.setAttribute("data-sdk-integration-mode", "custom");

    script.onload = () => {
      console.log("Mercado Pago SDK cargado dinámicamente.");
      resolve();
    };

    script.onerror = (error) => {
      console.error("Error al cargar el SDK de Mercado Pago:", error);
      reject(new Error("Fallo la carga del script de Mercado Pago"));
    };

    document.body.appendChild(script);
  });
};

export default function Checkout({ cart }) {
  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const [buyer, setBuyer] = useState({ name: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [pickup, setPickup] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(true); // ------------------------------------ // 1. CREAR PREFERENCIA EN EL BACKEND // ------------------------------------

  useEffect(() => {
    if (cart.length === 0) {
      setLoading(false);
      return;
    }
    if (preferenceId || !formValid) {
      console.log(
        `🟡 No se inicia/repite el fetch: prefId=${!!preferenceId}, formValido=${formValid}`
      );
      if (!preferenceId) setLoading(false);
      return;
    }

    console.log("🟢 Iniciando FETCH POST a /create-preference...");

    const createPreference = async () => {
      setLoading(true);
      setPreferenceId(null);
      try {
        const response = await fetch(
          "http://localhost:8080/create-preference",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              items: cart.map((item) => ({
                title: item.name,
                unit_price: item.price,
                quantity: item.qty || 1,
              })),
              buyer: buyer || { name: "", phone: "" },
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Preferencia creada. ID:", data.preferenceId);
          setPreferenceId(data.preferenceId);
        } else {
          console.error(
            "❌ Fallo la creación de preferencia en el backend. Status:",
            response.status
          );
          const errorText = await response.text();
          console.error("Respuesta de error del backend:", errorText);
          setPreferenceId(null);
        }
      } catch (error) {
        console.error(
          "❌ Error de red/CORS (fetch falló completamente):",
          error
        );
        setPreferenceId(null);
      } finally {
        setLoading(false);
      }
    };

    createPreference();
  }, [cart, formValid]); // ------------------------------------ // 2. RENDERIZAR EL BOTÓN DE MERCADO PAGO (CON ESTILOS BÁSICOS) // ------------------------------------

  useEffect(() => {
    if (!preferenceId) {
      return;
    }

    const renderMercadoPagoButton = async () => {
      try {
        await loadMercadoPagoScript(import.meta.env.VITE_MP_PUBLIC_KEY);
        console.log(
          "🔑 Preference ID listo para renderizar el botón:",
          preferenceId
        );

        const container = document.getElementById("mercadopago_container");
        if (container) {
          container.innerHTML = "";
        } else {
          console.error(
            "❌ ERROR DOM: El contenedor 'mercadopago_container' no existe."
          );
          return;
        }
        const mpClient = new window.MercadoPago(
          import.meta.env.VITE_MP_PUBLIC_KEY,
          { locale: "es-AR" }
        );

        mpClient.bricks().create("wallet", "mercadopago_container", {
          initialization: {
            preferenceId,
          },
          customization: {
            texts: {
              action: "pay",
              value: "Pagar",
            },
            checkout: {
              redirectMode: "modal",
            },
          },
        });
      } catch (e) {
        console.error(
          "❌ Error crítico al intentar renderizar el botón de MP:",
          e
        );
      }
    };

    renderMercadoPagoButton();

    return () => {
      const container = document.getElementById("mercadopago_container");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [preferenceId]); // ------------------------------------ // 3. VALIDACIÓN // ------------------------------------

  useEffect(() => {
    const newErrors = {};
    if (!buyer.name) newErrors.name = "Nombre obligatorio";
    if (!buyer.phone) newErrors.phone = "Celular obligatorio";
    if (!pickup)
      newErrors.pickup = "Debes marcar 'Retiro en el local' para continuar";

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0 && cart.length > 0;
    setFormValid(isValid);
    console.log(`Estado de Validación: ${isValid ? "Válido" : "No Válido"}`);
  }, [buyer, pickup, cart.length]);

  const handleChange = (e) => {
    setBuyer({ ...buyer, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* BLOQUE DE ESTILO AÑADIDO / MODIFICADO */}
      <style jsx global>{`
        /* Estilo para el botón de Mercado Pago generado por el SDK */
        #mercadopago_container button {
          /* Rojo más oscuro y elegante, similar al cherry o borgoña */
          background-color: #9e9e9e !important;
          border-color: #c5221f !important;
          border-radius: 9999px !important; /* full rounded (pill shape) para un look moderno */
          font-weight: 700 !important; /* font-bold */
          height: 56px !important; /* Un poco más alto para elegancia */
          font-size: 1rem !important;
          /* Sombra sutil para profundidad */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -2px rgba(0, 0, 0, 0.06);
          transition: all 0.2s ease-in-out;
        }
        #mercadopago_container button:hover {
          /* Tono más oscuro al pasar el ratón */
          background-color: #a01b18 !important;
          border-color: #a01b18 !important;
          /* Sombra más pronunciada al hacer hover */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -4px rgba(0, 0, 0, 0.1);
        }
        /* Asegura que el contenedor tome todo el ancho */
        #mercadopago_container {
          width: 100%;
        }
        /* El iframe dentro del contenedor de MP también necesita ancho 100% */
        #mercadopago_container iframe {
          width: 100%;
          display: block;
        }
      `}</style>
      {/* FIN BLOQUE DE ESTILO MODIFICADO */}
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>         
      <div className="flex flex-col lg:flex-row gap-6">
                                {/* Carrito */}             
        <div className="lg:w-7/10 bg-white shadow rounded-lg p-4 flex flex-col max-h-[80vh] overflow-y-auto">
                         
          <h2 className="text-lg font-semibold mb-4">Tu carrito</h2>           
                           
          {cart.length === 0 ? (
            <p className="text-gray-500">Tu carrito está vacío</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 py-3 border-b last:border-0"
              >
                                                           
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                                                                     
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-16 object-contain"
                    />
                  ) : (
                    "Img"
                  )}
                                                               
                </div>
                                                         
                <div className="flex-1">
                                                                   
                  <div className="flex justify-between items-start">
                                                                             
                    <div>
                                                                               
                              <div className="font-medium">{item.name}</div>   
                                                                               
                      <div className="text-sm text-gray-500">
                                                                       
                        Cantidad: {item.qty || 1}                               
                                                       
                      </div>
                                                                               
                             
                      <div className="text-sm text-gray-500">
                                                                        Precio
                        unitario: AR$                         {item.price}     
                                                             
                      </div>
                                                                               
                         
                    </div>
                                                                               
                    <div className="text-sm font-semibold text-red-600">
                                                                 
                      {item.price * (item.qty || 1)}                           
                                                       
                    </div>
                                                                           
                  </div>
                                                                   
                </div>
                                                           
              </div>
            ))
          )}
                                       
          <div className="text-right font-bold mt-4">Total: AR$ {total}</div>   
                               
        </div>
                                {/* Formulario comprador */}               
        <div className="lg:w-3/10 bg-white shadow rounded-lg p-6 flex-shrink-0">
                                       
          <h2 className="text-lg font-semibold mb-4">Datos del comprador</h2>   
                                   
          <form className="space-y-4">
                                               
            <div>
                                                       
              <label className="block font-medium mb-1">Nombre</label>         
                                             
              <input
                type="text"
                name="name"
                value={buyer.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
                                                       
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name}</p>
              )}
                                                   
            </div>
                                               
            <div>
                                                       
              <label className="block font-medium mb-1">Celular</label>         
                                             
              <input
                type="tel"
                name="phone"
                value={buyer.phone}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
                                                       {" "}
              {errors.phone && (
                <p className="text-red-600 text-sm">{errors.phone}</p>
              )}
                                                   
            </div>
                                               
            <div className="flex items-start gap-2">
                                                       
              <input
                type="checkbox"
                id="pickup"
                checked={pickup}
                onChange={() => setPickup(!pickup)}
                className="mt-1"
              />
                                                       
              <label htmlFor="pickup" className="text-sm text-gray-700">
                                                Retiro en el local              
                             
              </label>
                                                   
            </div>
                                               
            {errors.pickup && (
              <p className="text-red-600 text-sm">{errors.pickup}</p>
            )}
                                               
            <p className="text-xs text-gray-500">
                                          El comprador puede solicitar por su
              cuenta que una                             moto pase a retirar el
              producto en el local.                                      
            </p>
                                           
          </form>
                                             
          {/* Contenedor para el Botón de MP (Ahora visible y estilizable) */} 
                           
          <div className="mt-6">
                                               
            {loading ? (
              <button
                disabled
                className="w-full py-3 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
              >
                                                Cargando pago...                
                           
              </button>
            ) : !formValid ? (
              <button
                disabled
                className="w-full py-3 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
              >
                                                Completa tus datos para pagar  
                                         
              </button>
            ) : preferenceId ? (
              // Si la preferencia existe y el formulario es válido, mostramos el contenedor.
              <div id="mercadopago_container" className="w-full"></div>
            ) : (
              <p className="text-red-600">Error al generar preferencia</p>
            )}
                                           
          </div>
                                   
        </div>
                           
      </div>
                   
    </div>
  );
}
