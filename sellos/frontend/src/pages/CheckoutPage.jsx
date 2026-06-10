/**
 * ==============================================================================
 * 💳 PÁGINA: Checkout (CheckoutPage.jsx)
 * ==============================================================================
 *
 * Descripción: Esta página es el formulario de finalización de compra.
 * Es un componente "inteligente" (stateful) que gestiona:
 * 1. La recopilación de datos del comprador (nombre, email, teléfono).
 * 2. La selección del método de entrega (retiro o envío).
 * 3. La validación en vivo de todos los campos del formulario.
 * 4. El resumen del pedido (mostrando el carrito).
 * 5. La comunicación con el backend (`/api/create-preference`) para
 * generar el link de pago de MercadoPago.
 */

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx"; // Para obtener el carrito y el total.

// URL del backend (desde variables de entorno VITE).
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
// Costo de envío fijo (actualmente deshabilitado en la UI).
const SHIPPING_COST = 500;

export default function CheckoutPage() {
  // --- 1. HOOKS Y CONTEXTO ---
  const { cart, total } = useCart(); // Datos del carrito global.
  const navigate = useNavigate(); // Para redirigir.

  // --- 2. ESTADOS DEL FORMULARIO ---
  // Estado para los datos del comprador.
  const [buyer, setBuyer] = useState({ name: "", email: "", phone: "" });
  // Estado para el método de entrega (radio button).
  const [deliveryMethod, setDeliveryMethod] = useState("pickup"); // 'pickup' o 'shipping'
  // Estado para la dirección de envío.
  const [address, setAddress] = useState({
    street: "",
    city: "Mar del Plata",
    postalCode: "",
  });

  // --- 3. ESTADOS DE UI Y VALIDACIÓN ---
  // Objeto que almacena los mensajes de error (ej. { email: "Email inválido" }).
  const [errors, setErrors] = useState({});
  // Booleano que indica si el formulario es válido (se usa para habilitar/deshabilitar el botón de pago).
  const [formValid, setFormValid] = useState(false);
  // Booleano para el estado de carga (deshabilita el botón mientras se contacta a la API).
  const [loading, setLoading] = useState(false);

  /**
   * Helper para formatear valores en el resumen (maneja booleanos "Sí"/"No").
   */
  const formatValue = (value) => {
    if (typeof value === "boolean") {
      return value ? "Sí" : "No";
    }
    return String(value);
  };

  // --- 4. VALORES DERIVADOS ---
  // Calcula el total final, sumando el envío si está seleccionado.
  const finalTotal =
    deliveryMethod === "shipping" ? total + SHIPPING_COST : total;

  /**
   * --------------------------------------------------------------------------
   * 🧠 EFECTO: Motor de Validación en Vivo
   * --------------------------------------------------------------------------
   * Este `useEffect` se ejecuta CADA VEZ que el usuario modifica
   * el formulario (`buyer`, `deliveryMethod`, `address`) o si el carrito cambia.
   *
   * Su trabajo es:
   * 1. Validar todos los campos.
   * 2. Actualizar el estado `errors`.
   * 3. Actualizar el estado `formValid` (booleano).
   */
  useEffect(() => {
    const newErrors = {};

    // Validaciones del comprador
    if (!buyer.name.trim())
      newErrors.name = "Nombre y Apellido son obligatorios";
    if (!buyer.email.trim() || !/\S+@\S+\.\S+/.test(buyer.email))
      newErrors.email = "Email inválido";
    if (!buyer.phone.trim()) newErrors.phone = "Teléfono obligatorio";

    // Validaciones condicionales (solo si se elige envío)
    if (deliveryMethod === "shipping") {
      if (!address.street.trim())
        newErrors.street = "La dirección es obligatoria";
      if (!address.postalCode.trim())
        newErrors.postalCode = "El código postal es obligatorio";
    }

    // Actualiza los estados de validación.
    setErrors(newErrors);
    // El formulario es válido SI Y SÓLO SI:
    // 1. No hay errores (el objeto `newErrors` está vacío).
    // 2. Hay al menos un ítem en el carrito.
    setFormValid(Object.keys(newErrors).length === 0 && cart.length > 0);
  }, [buyer, deliveryMethod, address, cart.length]); // Dependencias del efecto

  /**
   * --------------------------------------------------------------------------
   * MANEJADOR: `handleChange`
   * --------------------------------------------------------------------------
   * Manejador genérico para todos los inputs del formulario.
   * Actualiza el estado `buyer` o el estado `address` según el `name` del input.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si el input pertenece a la dirección, actualiza `address`.
    if (["street", "city", "postalCode"].includes(name)) {
      setAddress((prev) => ({ ...prev, [name]: value }));
    } else {
      // Si no, actualiza `buyer`.
      setBuyer((prev) => ({ ...prev, [name]: value }));
    }
  };

  /**
   * --------------------------------------------------------------------------
   * ACCIÓN PRINCIPAL: `handleCreatePreference`
   * --------------------------------------------------------------------------
   * Esta función se llama al hacer clic en "Confirmar Pedido".
   * Contacta al backend para crear la preferencia de pago en MercadoPago.
   */
  const handleCreatePreference = async () => {
    // Guard Clause: No hacer nada si el formulario no es válido.
    if (!formValid) return;

    setLoading(true); // Inicia la carga
    try {
      // 1. Llamada a la API del backend.
      const response = await fetch(`${API_URL}/create-preference`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // --- 2. Cuerpo (Payload) ---
        // ¡CRÍTICO! Enviamos toda la información de la orden (carrito completo,
        // comprador, método de entrega, total) al backend.
        // El backend guardará esto en la `metadata` de MercadoPago.
        // El Webhook usará esta `metadata` para guardar la orden y
        // enviar el correo de confirmación detallado.
        body: JSON.stringify({
          cart: cart, // El carrito completo (con personalizaciones).
          buyer,
          deliveryMethod,
          address: deliveryMethod === "shipping" ? address : null,
          total: finalTotal, // El total (con envío, si aplica).
        }),
      });

      // 3. Manejo de la respuesta.
      if (response.ok) {
        // ÉXITO: El backend devolvió el link de MP.
        const data = await response.json();
        // 4. Redirige al usuario a la pasarela de pago de MercadoPago.
        window.location.href = data.init_point;
      } else {
        // ERROR (del backend): Muestra un error al usuario.
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
      // ERROR (de red/CORS):
      console.error("Error de red/CORS:", error);
      alert("Error de conexión. Revisa la consola para más detalles.");
    } finally {
      // 5. Finalización (siempre se ejecuta).
      setLoading(false); // Detiene la carga y rehabilita el botón.
    }
  };

  // --- Guard Clause: Carrito Vacío ---
  // Si el carrito está vacío, no muestra el formulario de checkout.
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

  // --- RENDERIZACIÓN DEL CHECKOUT ---
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Layout de 2 columnas en desktop */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:items-start">
        {/* --------------------------- */}
        {/* Columna 1: Formulario       */}
        {/* --------------------------- */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">
            Información de contacto
          </h2>
          {/* Formulario (inputs controlados) */}
          <div className="space-y-5">
            {/* Campo Email */}
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
              {/* Muestra de error condicional */}
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            {/* Campo Nombre */}
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
            {/* Campo Teléfono */}
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

            {/* Selector de Método de Entrega */}
            <div className="pt-2">
              <p className="text-sm text-gray-600 font-medium">
                Método de entrega
              </p>
              <div className="mt-2 space-y-2">
                {/* Opción 1: Retiro (Activa) */}
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
  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
    <p className="font-semibold text-gray-900">Retiro en el local</p>
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 w-fit">
      ⚠️ RETOMAMOS EL 8/6 ⚠️
    </span>
  </div>
  <p className="text-xs text-gray-500 mt-0.5">
    Bermejo 477, Mar del Plata
  </p>
</div>
                </label>
                {/* Opción 2: Envío (Deshabilitada) */}
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

            {/* Formulario de Dirección (Condicional) */}
            {/* Este bloque SÓLO aparece si `deliveryMethod` es "shipping" */}
            {deliveryMethod === "shipping" && (
              <div className="space-y-5 border-t pt-5">
                <h3 className="text-lg font-semibold">Dirección de envío</h3>
                {/* Campo Dirección */}
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
                {/* Campo Código Postal */}
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

        {/* --------------------------- */}
        {/* Columna 2: Resumen Pedido   */}
        {/* --------------------------- */}
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col">
          <h2 className="text-2xl font-semibold mb-6">Resumen del pedido</h2>
          {/* Lista de productos en el carrito */}
          <div className="flex-1 space-y-4 ">
            {cart.map((item) => (
              // ¡Buena UX! Cada ítem es un <Link> que permite al usuario
              // volver a la página del producto para editarlo,
              // pasando el estado actual del ítem.
              <Link
                key={item.cartItemId}
                to={`/product/${item.id}`}
                state={{
                  cartItemId: item.cartItemId,
                  customization: item.customization,
                  quantity: item.qty,
                }}
                className="flex items-start gap-4 pb-4 last:pb-0 last:border-0 p-2 -m-2 rounded-lg"
              >
                {/* Imagen con contador de cantidad */}
                <div className="relative flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-fit rounded-md border"
                  />
                  <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {item.qty}
                  </span>
                </div>
                {/* Detalles del ítem */}
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  {/* Resumen de Personalización */}
                  {item.customization ? (
                    <div className="mt-1 text-xs text-gray-600 space-y-1">
                      {Object.entries(item.customization).map(
                        ([key, value]) => {
                          // Oculta campos vacíos
                          if (
                            value === "" ||
                            value === null ||
                            value === undefined
                          )
                            return null;

                          // Lógica especial para 'color'
                          if (key.toLowerCase() === "color") {
                            let colorName = value;
                            if (item.colors) {
                              const foundColor = item.colors.find(
                                (c) =>
                                  c.hex.toLowerCase() ===
                                  String(value).trim().toLowerCase()
                              );
                              if (foundColor) colorName = foundColor.name;
                            }
                            // Muestra el swatch de color + nombre
                            return (
                              <p key={key}>
                                <strong>Color:</strong>{" "}
                                <span
                                  className="inline-block w-3 h-3 border rounded-sm align-middle mr-2"
                                  style={{
                                    backgroundColor: String(value).trim(),
                                  }}
                                  aria-hidden="true"
                                />
                                {colorName}
                              </p>
                            );
                          }
                          // Lógica para otros valores HEX
                          const isHex = /^#([0-9A-F]{3}){1,2}$/i.test(
                            String(value).trim()
                          );
                          if (isHex) {
                            return (
                              <p key={key}>
                                <strong>{key}:</strong>{" "}
                                <span
                                  className="inline-block w-3 h-3 border rounded-sm align-middle mr-2"
                                  style={{
                                    backgroundColor: String(value).trim(),
                                  }}
                                  aria-hidden="true"
                                />
                              </p>
                            );
                          }
                          // Caso general (Líneas, Fuente, etc.)
                          return (
                            <p key={key}>
                              <strong>{key.replace("line", "Línea ")}:</strong>{" "}
                              {formatValue(value)}
                            </p>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">Sin personalización</p>
                  )}
                </div>
                {/* Precio total del ítem (precio * cantidad) */}
                <p className="font-semibold text-sm mt-1">
                  AR$ {(item.price * item.qty).toFixed(2)}
                </p>
              </Link>
            ))}
          </div>

          {/* Resumen de Totales */}
          <div className="border-t mt-6 pt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>AR$ {total.toFixed(2)}</span>
            </div>
            {/* Costo de envío (Condicional) */}
            {deliveryMethod === "shipping" && (
              <div className="flex justify-between">
                <span>Envío</span>
                <span>AR$ {SHIPPING_COST.toFixed(2)}</span>
              </div>
            )}
            {/* Total Final */}
            <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
              <span>Total</span>
              <span>AR$ {finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Botón de Pago (Submit) */}
          <button
            onClick={handleCreatePreference}
            // Deshabilitado si el formulario NO es válido o si está cargando.
            disabled={!formValid || loading}
            className="mt-6 w-full bg-[#e30613] text-white py-3 rounded-md font-semibold hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Procesando..." : "Confirmar Pedido"}
          </button>
        </div>
      </div>
    </div>
  );
}
