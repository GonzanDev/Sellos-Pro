import React, { useState, useEffect } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

export default function Checkout({ cart }) {
  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const [buyer, setBuyer] = useState({ name: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [pickup, setPickup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);




  initMercadoPago("TEST-e6ffe2d4-c1ff-42bc-820c-cdf1d1b61a27"); //public key from .env)

  ///call api to create preference

  useEffect(() => {
  const createPreference = async () => {
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
      }), 
    })
  if (response.ok) {
      const data = await response.json();
      setPreferenceId(data.preferenceId);
      console.log(data); // devuelve el id de la preferencia
    }
  } catch (error) {
      console.error("Error creating preference:", error);
    } 
  };  
  createPreference();
}, [cart]); 


  const handleChange = (e) => {
    setBuyer({ ...buyer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!buyer.name) newErrors.name = "Nombre obligatorio";
    if (!buyer.phone) newErrors.phone = "Celular obligatorio";
    if (!pickup) newErrors.pickup = "Debes marcar retiro en el local";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

  };

  
 return (
  <div className="min-h-screen bg-gray-50 p-6">
    <h1 className="text-2xl font-bold mb-6">Checkout</h1>

    <div className="flex flex-col lg:flex-row gap-6">
      {/* Lista de productos */}
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
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-400">
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
                  </div>
                  <div className="text-sm font-semibold text-red-600">
                    AR$ {item.price * (item.qty || 1)}
                  </div>
                </div>

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
                          {typeof value === "boolean"
                            ? value
                              ? "Sí"
                              : "No"
                            : value}
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div className="text-right font-bold mt-4">Total: AR$ {total}</div>
      </div>

      {/* Formulario de comprador */}
      <div className="lg:w-3/10 bg-white shadow rounded-lg p-6 flex-shrink-0">
        <h2 className="text-lg font-semibold mb-4">Datos del comprador</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Checkbox obligatorio para retiro en local */}
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
            retirar el producto en el local, mencionando el sello pedido.
          </p>

          {/* Mostrar botón de Mercado Pago solo si los datos están completos */}
          {buyer.name && buyer.phone && !errors.name && !errors.phone ? (
            preferenceId && (
              <div style={{ width: "300px" }}>
                <Wallet initialization={{ preferenceId: preferenceId }} />
              </div>
            )
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              Completa tu nombre y celular para habilitar el pago con Mercado Pago.
            </p>
          )}
        </form>
      </div>
    </div>
  </div>
);
}