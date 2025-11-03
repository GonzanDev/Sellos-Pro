/**
 * ==============================================================================
 * 🛒 COMPONENTE: Carrito de Compras (Cart.jsx)
 * ==============================================================================
 *
 * Descripción: Este archivo renderiza el modal/sidebar del carrito de compras.
 *
 * Componentes:
 * 1. CustomizationDetails: Un sub-componente para mostrar los detalles de
 * personalización de un producto (líneas, color, logo, etc.).
 * 2. EmptyCart: Un componente que se muestra cuando el carrito está vacío.
 * 3. Cart (default): El componente principal del modal del carrito.
 *
 * Dependencias:
 * - react-router-dom: Para la navegación (al checkout o a la página del producto).
 * - CartContext.jsx: Para obtener el estado global del carrito (items, total, etc.)
 * y las acciones para modificarlo (remover, actualizar cantidad, etc.).
 * - lucide-react: Para los iconos (X, ShoppingBag).
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import { X, ShoppingBag } from "lucide-react"; // Iconos de la librería Lucide.

// ==============================================================================
// 🎨 SUB-COMPONENTE: Detalles de Personalización
// ==============================================================================
/**
 * Renderiza de forma flexible los detalles de personalización de un ítem del carrito.
 * Sabe cómo mostrar colores, previsualizaciones de logos y texto simple.
 *
 * @param {object} props
 * @param {object | null} props.customization - El objeto de personalización del ítem.
 */
const CustomizationDetails = ({ customization }) => {
  // Si no hay personalización, no renderiza nada.
  if (!customization || Object.keys(customization).length === 0) {
    return null;
  }

  // 1. Extraemos los 'comentarios' para tratarlos por separado (se mostrarán al final).
  const { comentarios, ...otherDetails } = customization;

  // 2. Filtramos el resto de los detalles para mostrar solo los relevantes.
  //    Se excluyen valores vacíos, 'fileName' (irrelevante para el usuario) y 'selectedKit'.
  const details = Object.entries(otherDetails).filter(
    ([key, value]) => value && key !== "fileName" && key !== "selectedKit"
  );

  // Si no hay detalles filtrados ni comentarios, no renderiza nada.
  if (details.length === 0 && !comentarios) {
    return null;
  }

  /**
   * Formatea un valor para mostrarlo. Convierte booleanos a "Sí" / "No".
   * @param {*} value - El valor a formatear.
   * @returns {string}
   */
  const formatValue = (value) => {
    if (typeof value === "boolean") {
      return value ? "Sí" : "No";
    }
    return String(value);
  };

  return (
    <div className="mt-2 text-xs text-gray-500 space-y-1 border-t border-gray-200 pt-2">
      {/* 3. Renderizamos los detalles (líneas, color, logo) */}
      {details.map(([key, value]) => {
        // Usamos un switch para renderizar casos especiales (logo, color).
        switch (key) {
          // Caso: Previsualización del logo
          case "logoPreview":
            return (
              <img
                key={key}
                src={value}
                alt="Logo personalizado"
                className="max-h-12 rounded border mt-1"
              />
            );
          // Caso: Muestra de color
          case "color":
            return (
              <p key={key} className="flex items-center gap-2">
                <span className="font-medium capitalize text-gray-600">
                  {key}:
                </span>
                {/* Muestra un círculo con el color seleccionado */}
                <span
                  className="inline-block w-4 h-4 rounded-full border"
                  style={{ backgroundColor: value }}
                />
              </p>
            );
          // Caso: Por defecto (Líneas de texto, etc.)
          default:
            return (
              <p key={key}>
                <span className="font-medium capitalize text-gray-600">
                  {/* Reemplaza 'line1' por 'Línea 1' */}
                  {key.replace("line", "Línea ")}:
                </span>{" "}
                {formatValue(value)}
              </p>
            );
        }
      })}
      {/* 4. Si existen comentarios, los renderizamos al final con un estilo separado. */}
      {comentarios && (
        <p className="text-gray-600 pt-1">
          <span className="font-medium capitalize text-gray-600">
            Comentarios:
          </span>{" "}
          {String(comentarios)}
        </p>
      )}
    </div>
  );
};

// ==============================================================================
// 💨 SUB-COMPONENTE: Carrito Vacío
// ==============================================================================
/**
 * Componente simple que se muestra cuando no hay productos en el carrito.
 */
const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
    <ShoppingBag size={48} className="mb-4 text-gray-300" />
    <h3 className="text-lg font-semibold text-gray-700">
      Tu carrito está vacío
    </h3>
    <p className="text-sm mt-1">Agrega productos para verlos aquí.</p>
  </div>
);

// ==============================================================================
// 🛒 COMPONENTE PRINCIPAL: Carrito (Modal)
// ==============================================================================
export default function Cart() {
  // Obtenemos el estado y las funciones del Contexto del Carrito.
  const {
    isCartOpen, // Boolean: ¿Está el modal abierto?
    cart, // Array: Lista de productos en el carrito.
    closeCart, // Función: Cierra el modal.
    removeFromCart, // Función: Elimina un ítem por su cartItemId.
    updateQty, // Función: Actualiza la cantidad de un ítem.
    clearCart, // Función: Vacía el carrito (No se usa en este componente, pero está disponible).
    total = 0, // Number: El subtotal calculado del carrito.
  } = useCart();

  // Hook de React Router para manejar la navegación.
  const navigate = useNavigate();

  /**
   * Maneja el clic en un producto (imagen o título) dentro del carrito.
   * Cierra el carrito y navega a la página del producto, pasando la
   * configuración actual (customization, qty) para permitir la EDICIÓN.
   * @param {object} item - El ítem del carrito en el que se hizo clic.
   */
  const handleProductClick = (item) => {
    closeCart(); // Cierra el modal.
    // Navega a la página del producto.
    navigate(`/product/${item.id}`, {
      // Pasa el estado del ítem del carrito a la página de destino.
      // Esto permite que la página del producto se cargue con los datos
      // de la personalización existente (para editarla).
      state: {
        cartItemId: item.cartItemId,
        customization: item.customization,
        quantity: item.qty,
      },
    });
  };

  /**
   * Maneja el clic en el botón "Finalizar Compra".
   * Cierra el carrito y navega a la página de checkout.
   */
  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <>
      {/* 1. Fondo Oscuro (Overlay) */}
      {/* Aparece detrás del modal y lo cierra al hacer clic en él. */}
      <div
        className={`fixed inset-0 bg-black/60 transition-opacity duration-300 z-50 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* 2. El Modal/Sidebar del Carrito */}
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col z-50 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isCartOpen}
      >
        {/* --------------------------------- */}
        {/* Encabezado del Carrito           */}
        {/* --------------------------------- */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Mi Carrito</h2>
          <button
            onClick={closeCart}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* --------------------------------- */}
        {/* Contenido del Carrito (Lista)    */}
        {/* --------------------------------- */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Condición: Muestra <EmptyCart> o la lista de productos */}
          {cart.length === 0 ? (
            <EmptyCart />
          ) : (
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li
                  key={item.cartItemId} // ID único del ítem en el carrito.
                  className="flex items-start gap-4 py-4"
                >
                  {/* --- Imagen Clickeable (para editar) --- */}
                  <button
                    onClick={() => handleProductClick(item)}
                    className="w-20 h-20 object-contain rounded-lg border border-gray-200 bg-white flex-shrink-0"
                    aria-label={`Ver ${item.name}`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-fit rounded-md"
                    />
                  </button>

                  {/* --- Detalles del Ítem --- */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      {/* --- Título Clickeable (para editar) --- */}
                      <button
                        onClick={() => handleProductClick(item)}
                        className="text-left"
                      >
                        <h3 className="font-semibold text-gray-800 hover:text-red-600 transition-colors">
                          {item.name}
                        </h3>
                        {/* Precio Unitario */}
                        <p className="text-sm text-gray-500 mt-1">
                          AR$ {item.price.toFixed(2)}
                        </p>
                      </button>
                      {/* Precio Total (Unitario * Cantidad) */}
                      <p className="text-md font-semibold text-gray-900 flex-shrink-0">
                        AR$ {(item.price * (item.qty || 1)).toFixed(2)}
                      </p>
                    </div>

                    {/* --- Renderiza los detalles de personalización --- */}
                    <CustomizationDetails customization={item.customization} />

                    {/* --- Controles (Cantidad y Eliminar) --- */}
                    <div className="mt-3 flex items-center justify-between">
                      {/* Control de Cantidad */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQty(item.cartItemId, (item.qty || 1) - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-medium">
                          {item.qty || 1}
                        </span>
                        <button
                          onClick={() =>
                            updateQty(item.cartItemId, (item.qty || 1) + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition"
                        >
                          +
                        </button>
                      </div>
                      {/* Botón Eliminar */}
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* --------------------------------- */}
        {/* Pie de Página del Carrito (Footer) */}
        {/* --------------------------------- */}
        {/* Solo se muestra si hay ítems en el carrito */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            {/* Subtotal */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-800">
                Subtotal
              </span>
              <span className="text-2xl font-bold text-gray-900">
                AR$ {total.toFixed(2)}
              </span>
            </div>
            {/* Botones de Acción */}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-[#e30613] text-white font-semibold rounded-lg hover:bg-red-700 transition shadow-sm"
              >
                Finalizar Compra
              </button>
              <button
                onClick={closeCart}
                className="w-full py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Seguir Comprando
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
