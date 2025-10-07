import React, { useState, useEffect } from "react";

export default function Checkout({ cart }) {
  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const [buyer, setBuyer] = useState({ name: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [pickup, setPickup] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [initPoint, setInitPoint] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(true);

  // ------------------------------------
  // 1️⃣ CREAR PREFERENCIA EN BACKEND
  // ------------------------------------
  useEffect(() => {
    if (cart.length === 0) {
      setLoading(false);
      return;
    }

    if (preferenceId || !formValid) {
      if (!preferenceId) setLoading(false);
      return;
    }

    const createPreference = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8080/create-preference", {
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
        });

        if (response.ok) {
          const data = await response.json();
          setPreferenceId(data.preferenceId);
          setInitPoint(data.init_point);
        } else {
          console.error("❌ Fallo la creación de preferencia en el backend.");
        }
      } catch (error) {
        console.error("❌ Error de red/CORS:", error);
      } finally {
        setLoading(false);
      }
    };

    createPreference();
  }, [cart, formValid]);

  // ------------------------------------
  // 2️⃣ VALIDACIÓN DE FORMULARIO
  // ------------------------------------
  useEffect(() => {
    const newErrors = {};
    if (!buyer.name) newErrors.name = "Nombre obligatorio";
    if (!buyer.phone) newErrors.phone = "Celular obligatorio";
    if (!pickup)
      newErrors.pickup = "Debes marcar 'Retiro en el local' para continuar";

    setErrors(newErrors);
    setFormValid(Object.keys(newErrors).length === 0 && cart.length > 0);
  }, [buyer, pickup, cart.length]);

  // ------------------------------------
  // 3️⃣ HANDLERS
  // ------------------------------------
  const handleChange = (e) => {
    setBuyer({ ...buyer, [e.target.name]: e.target.value });
  };

  // ✅ ENVÍO DE EMAIL CON PERSONALIZACIÓN
  const handleSendTestEmail = async () => {
    try {
      const response = await fetch("http://localhost:8080/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer,
          cart: cart.map((item) => ({
            name: item.name,
            price: item.price,
            qty: item.qty || 1,
            personalizacion: item.customization || {}, // 👈 Enviamos los datos del sello
          })),
          total,
        }),
      });

      const data = await response.json();
      if (data.success) alert("✅ Correo enviado correctamente");
      else alert("❌ Error al enviar el correo");
    } catch (error) {
      console.error("Error al enviar correo:", error);
      alert("⚠️ Error al conectar con el servidor");
    }
  };

  // ------------------------------------
  // 4️⃣ UI
  // ------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 🛒 Carrito */}
        <div className="lg:w-7/10 bg-white shadow rounded-lg p-4 flex flex-col max-h-[80vh] overflow-y-auto">
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
                        Precio unitario: AR$ {item.price}
                      </div>

                      {/* 👇 Mostrar datos de personalización */}
                      {item.customization && (
  <div className="mt-2 text-sm text-gray-600 space-y-1">
    {Object.entries(item.customization).map(([key, value]) => {
      if (!value) return null;

      if (key.toLowerCase() === "color") {
        return (
          <p key={key} className="flex items-center gap-2">
            <span className="font-medium capitalize">{key}:</span>
            <span
              className="inline-block w-5 h-5 rounded border border-gray-400"
              style={{ backgroundColor: value }}
            />
            <span className="text-xs text-gray-500">{value}</span>
          </p>
        );
      }

      if (key === "logoPreview") {
        return (
          <img
            key={key}
            src={value}
            alt="Logo personalizado"
            className="max-h-16 rounded border"
          />
        );
      }

      return (
        <p key={key}>
          <span className="font-medium capitalize">{key}:</span>{" "}
          {typeof value === "boolean" ? (value ? "Sí" : "No") : value}
        </p>
      );
    })}
  </div>
)}

                    </div>

                    <div className="text-sm font-semibold text-red-600">
                      AR$ {item.price * (item.qty || 1)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          <div className="text-right font-bold mt-4">Total: AR$ {total}</div>
        </div>

        {/* 🧾 Formulario comprador */}
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
              El comprador puede solicitar por su cuenta que una moto pase a
              retirar el producto en el local.
            </p>
          </form>

          {/* 🔘 Botones */}
          <div className="mt-6">
            {loading ? (
              <button
                disabled
                className="w-full py-4 rounded-full bg-gray-300 text-gray-500 font-bold cursor-not-allowed"
              >
                Cargando pago...
              </button>
            ) : !formValid ? (
              <button
                disabled
                className="w-full py-4 rounded-full bg-gray-300 text-gray-500 font-bold cursor-not-allowed"
              >
                Completa tus datos para pagar
              </button>
            ) : initPoint ? (
              <a
                href={initPoint}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 text-lg font-bold text-white bg-red-700 hover:bg-red-600 rounded-full shadow-lg hover:shadow-xl transition duration-200 ease-in-out flex items-center justify-center"
              >
                Pagar
              </a>
            ) : (
              <p className="text-red-600">Error al generar la URL de pago</p>
            )}

            {/* 🧩 Botón de prueba de correo */}
            <button
              onClick={handleSendTestEmail}
              className="w-full mt-3 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Enviar correo de prueba
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
