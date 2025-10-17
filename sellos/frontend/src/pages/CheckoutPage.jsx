import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const SHIPPING_COST = 500; // Costo de envío fijo para Mar del Plata

export default function CheckoutPage() {
  const { cart, total } = useCart();
  const navigate = useNavigate();

  const [buyer, setBuyer] = useState({ name: "", email: "", phone: "" });
  const [deliveryMethod, setDeliveryMethod] = useState("pickup"); // 'pickup' o 'shipping'
  const [address, setAddress] = useState({
    street: "",
    city: "Mar del Plata",
    postalCode: "",
  });
  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const finalTotal =
    deliveryMethod === "shipping" ? total + SHIPPING_COST : total;

  useEffect(() => {
    const newErrors = {};
    if (!buyer.name.trim())
      newErrors.name = "Nombre y Apellido son obligatorios";
    if (!buyer.email.trim() || !/\S+@\S+\.\S+/.test(buyer.email))
      newErrors.email = "Email inválido";
    if (!buyer.phone.trim()) newErrors.phone = "Teléfono obligatorio";

    if (deliveryMethod === "shipping") {
      if (!address.street.trim())
        newErrors.street = "La dirección es obligatoria";
      if (!address.postalCode.trim())
        newErrors.postalCode = "El código postal es obligatorio";
    }

    setErrors(newErrors);
    setFormValid(Object.keys(newErrors).length === 0 && cart.length > 0);
  }, [buyer, deliveryMethod, address, cart.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["street", "city", "postalCode"].includes(name)) {
      setAddress((prev) => ({ ...prev, [name]: value }));
    } else {
      setBuyer((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreatePreference = async () => {
    if (!formValid) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/create-preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // --- CAMBIO APLICADO ---
        // Ahora enviamos el 'cart' completo (con todos sus detalles de personalización)
        // y el 'total' para que el backend pueda guardarlos en 'metadata'.
        // El webhook usará esta información para construir el correo de confirmación.
        body: JSON.stringify({
          cart: cart, // Enviamos el carrito completo
          buyer,
          deliveryMethod,
          address: deliveryMethod === "shipping" ? address : null,
          total: finalTotal,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.init_point;
      } else {
        const errorData = await response.json();
        console.error(
          "Fallo la creación de preferencia en el backend:",
          errorData
        );
        alert(
          `Hubo un error al generar el link de pago: ${
            errorData.details || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Error de red/CORS:", error);
      alert("Error de conexión. Revisa la consola para más detalles.");
    } finally {
      setLoading(false);
    }
  };
  const handleSendTestEmail = async () => {
    try {
      const response = await fetch(`${API_URL}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer,
          cart,
          total: finalTotal,
          deliveryMethod,
          address,
        }),
      });
      const data = await response.json();
      if (data.success) alert("Correo de prueba enviado correctamente");
      else alert("Error al enviar el correo de prueba");
    } catch (error) {
      console.error("Error al enviar correo de prueba:", error);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <button
          onClick={() => navigate("/catalog")}
          className="px-6 py-2 bg-[#e30613] text-white rounded hover:bg-black transition"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:items-start">
        {/* Columna de Información */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">
            Información de contacto
          </h2>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email"
                value={buyer.email}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-red-500"
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Nombre y Apellido
              </label>
              <input
                type="text"
                name="name"
                value={buyer.name}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-red-500"
                placeholder="Tu nombre completo"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Teléfono de contacto
              </label>
              <input
                type="tel"
                name="phone"
                value={buyer.phone}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-red-500"
                placeholder="Para coordinar la entrega"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div className="pt-2">
              <p className="text-sm text-gray-600 font-medium">
                Método de entrega
              </p>
              <div className="mt-2 space-y-2">
                <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="pickup"
                    checked={deliveryMethod === "pickup"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <div className="ml-3 text-sm">
                    <p className="font-medium">Retiro en el local</p>
                    <p className="text-xs text-gray-500">
                      Avenida Luro 3247, Mar del Plata
                    </p>
                  </div>
                </label>
                <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-not-allowed bg-gray-100 opacity-60">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="shipping"
                    disabled
                    className="h-4 w-4 text-gray-400 border-gray-300"
                  />
                  <div className="ml-3 text-sm">
                    <p className="font-medium text-gray-500">
                      Envío a domicilio
                    </p>
                    <p className="text-xs text-gray-400">
                      Temporalmente no disponible
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {deliveryMethod === "shipping" && (
              <div className="space-y-5 border-t pt-5">
                <h3 className="text-lg font-semibold">Dirección de envío</h3>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-red-500"
                    placeholder="Calle y número"
                  />
                  {errors.street && (
                    <p className="text-red-500 text-xs mt-1">{errors.street}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleChange}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-red-500"
                    placeholder="Ej: 7600"
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.postalCode}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna de Resumen */}
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col">
          <h2 className="text-2xl font-semibold mb-6">Resumen del pedido</h2>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="flex items-start gap-4 border-b pb-4"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-md border"
                  />
                  <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {item.qty}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>

                  {item.customization ? (
                    <div className="mt-1 text-xs text-gray-600 space-y-1">
                      {Object.entries(item.customization).map(
                        ([key, value]) => {
                          if (
                            value === "" ||
                            value === null ||
                            value === undefined
                          )
                            return null;
                          return (
                            <p key={key}>
                              <strong>{key}:</strong> {value}
                            </p>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">Sin personalización</p>
                  )}
                </div>
                <p className="font-semibold text-sm mt-1">
                  AR$ {(item.price * item.qty).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t mt-6 pt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>AR$ {total.toFixed(2)}</span>
            </div>
            {deliveryMethod === "shipping" && (
              <div className="flex justify-between">
                <span>Envío</span>
                <span>AR$ {SHIPPING_COST.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
              <span>Total</span>
              <span>AR$ {finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCreatePreference}
            disabled={!formValid || loading}
            className="mt-6 w-full bg-[#e30613] text-white py-3 rounded-md font-semibold hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Procesando..." : "Confirmar Pedido"}
          </button>

          <button
            onClick={handleSendTestEmail}
            className="mt-3 w-full text-xs text-gray-500 hover:text-black"
          >
            Enviar correo de prueba
          </button>
        </div>
      </div>
    </div>
  );
}
