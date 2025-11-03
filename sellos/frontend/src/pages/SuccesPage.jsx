/**
 * ==============================================================================
 * ✅ PÁGINA: Pago Exitoso (SuccessPage.jsx)
 * ==============================================================================
 *
 * Descripción:
 * Esta es la página de "Gracias" a la que MercadoPago redirige al usuario
 * después de un pago *aprobado*.
 * Corresponde a la URL 'back_urls.success' definida en el backend.
 *
 * Responsabilidades Clave:
 * 1. Informar al usuario que su pago fue exitoso.
 * 2. Leer los parámetros de la URL (enviados por MP) para obtener el 'status'
 * y el 'external_reference' (ID del pedido).
 * 3. **Efecto Secundario Crítico:** Si el 'status' es "approved", llama a la
 * función `clearCart()` del CartContext para vaciar el carrito del usuario.
 * 4. Utiliza `useRef` como una "guardia" para asegurar que `clearCart` se
 * ejecute *una sola vez*.
 * 5. Mostrar el ID del pedido para referencia del usuario.
 * 6. Proveer un botón para "Seguir Comprando".
 */

import React, { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom"; // Para navegación y leer params
import { CheckCircle } from "lucide-react"; // Icono de éxito
import { useCart } from "../contexts/CartContext"; // Para limpiar el carrito

export default function SuccessPage() {
  // Obtenemos la función para limpiar el carrito desde el contexto.
  const { clearCart } = useCart();
  // Hook para leer los parámetros de la URL (ej. ?status=approved...)
  const [searchParams] = useSearchParams();

  // 'useRef' para prevenir la doble ejecución del useEffect en React Strict Mode.
  // Esto asegura que `clearCart()` se llame UNA SOLA VEZ.
  const effectRan = useRef(false);

  // Leemos los datos que envía MercadoPago en la URL.
  const orderId = searchParams.get("external_reference"); // Nuestro ID de pedido
  const status = searchParams.get("status"); // El estado del pago (ej. "approved")

  /**
   * --------------------------------------------------------------------------
   * 🧠 EFECTO: Limpiar el Carrito
   * --------------------------------------------------------------------------
   * Este es el efecto secundario principal de esta página.
   * Se ejecuta cuando el componente se monta.
   */
  useEffect(() => {
    // 1. Verificamos que el pago esté realmente "approved" (según la URL)
    // 2. Verificamos que este efecto no se haya ejecutado antes (guardia de useRef)
    if (status === "approved" && !effectRan.current) {
      // 3. Si ambas son verdaderas, limpiamos el carrito.
      clearCart();
      // 4. Marcamos el efecto como "ejecutado" para que no se repita.
      effectRan.current = true;
    }
    // `clearCart` y `status` son dependencias.
  }, [status, clearCart]);

  // --- RENDERIZACIÓN ---
  return (
    <div className="bg-gray-50 min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Tarjeta de confirmación */}
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-xl shadow-lg text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          ¡Gracias por tu pedido!
        </h1>
        <p className="mt-2 text-md text-gray-600">
          Hemos recibido tu pedido y lo estamos procesando. Recibirás una
          notificación por correo electrónico con los detalles.
        </p>

        {/* Muestra el ID del pedido para referencia del cliente */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-600">Número de pedido</p>
          <p className="text-lg font-mono font-semibold text-gray-800 tracking-wider">
            {orderId || "N/A"}{" "}
            {/* Muestra N/A si por alguna razón no vino el orderId */}
          </p>
        </div>

        {/* --- ENLACE AL ESTADO DEL PEDIDO (intencionalmente eliminado) --- */}
        {/* El usuario ha comentado que este enlace se elimina,
            probablemente porque el correo ya cumple esa función. */}
        {/* {orderId && (
           <div className="mt-6">
             <Link to={`/order/${orderId}`}>
               Ver estado de tu pedido →
             </Link>
           </div>
        )} */}

        {/* Botón de Acción Principal */}
        <div className="mt-10">
          <Link
            to="/catalog"
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
          >
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
