/**
 * ==============================================================================
 * 🧾 PÁGINA: Estado del Pedido (OrderStatusPage.jsx)
 * ==============================================================================
 *
 * Descripción:
 * Esta página muestra al cliente el estado de su pedido. Es la página a la
 * que se enlaza desde el correo de confirmación (ej. /order/SP-123456).
 *
 * Arquitectura:
 * 1. Define un hook personalizado `useOrderStatus` para encapsular la
 * lógica de `fetch` (obtención de datos).
 * 2. El componente principal `OrderStatusPage` consume este hook y se
 * encarga únicamente de la renderización de la UI, mostrando uno de
 * los tres estados posibles: Carga, Error, o Éxito (datos del pedido).
 */

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // useParams para leer la URL
import { CheckCircle, Package, AlertTriangle, Loader } from "lucide-react"; // Iconos

/**
 * ------------------------------------------------------------------------------
 * 🎣 HOOK PERSONALIZADO: useOrderStatus
 * ------------------------------------------------------------------------------
 *
 * Propósito: Encapsula toda la lógica para obtener *un solo* pedido
 * desde el backend usando su ID.
 *
 * @param {string} orderId - El ID del pedido (ej. "SP-123456") obtenido de la URL.
 * @returns {object} Un objeto con el estado de la petición:
 * - {object | null} order: Los datos del pedido si se encuentra.
 * - {boolean} loading: `true` mientras se está buscando el pedido.
 * - {string | null} error: Un mensaje de error si la búsqueda falla.
 */
function useOrderStatus(orderId) {
  // --- Estados internos del hook ---
  const [order, setOrder] = useState(null); // Almacena los datos del pedido
  const [loading, setLoading] = useState(true); // Indica si está cargando
  const [error, setError] = useState(null); // Almacena el mensaje de error

  // Efecto que se dispara cuando el 'orderId' cambia.
  useEffect(() => {
    // Guard Clause: No hacer nada si no hay un ID de pedido.
    if (!orderId) {
      setLoading(false);
      setError("No se proporcionó un ID de pedido.");
      return;
    }

    // Función asíncrona para buscar el pedido en el backend.
    const fetchOrder = async () => {
      try {
        // Obtenemos la URL de la API desde las variables de entorno.
        const API_URL =
          import.meta.env.VITE_API_URL || "http://localhost:8080/api";
        // Llamada a la nueva ruta del backend: /api/order/<ID_DEL_PEDIDO>
        const response = await fetch(`${API_URL}/order/${orderId}`);

        // Si la respuesta no es 'ok' (ej. 404 No Encontrado)...
        if (!response.ok) {
          // ...lanzamos un error que capturará el 'catch'.
          throw new Error("No pudimos encontrar tu pedido.");
        }

        // Si 'ok', parseamos el JSON y lo guardamos en el estado.
        const data = await response.json();
        setOrder(data);
        setError(null); // Limpiamos cualquier error previo.
      } catch (err) {
        // Si 'fetch' o 'response.ok' fallan, guardamos el error.
        setError(err.message);
      } finally {
        // Se ejecuta siempre, al final (éxito o error).
        setLoading(false); // Detenemos el indicador de carga.
      }
    };

    fetchOrder();
  }, [orderId]); // El array de dependencias: se re-ejecuta si 'orderId' cambia.

  // Devuelve el estado actual al componente que lo usa.
  return { order, loading, error };
}

/**
 * ------------------------------------------------------------------------------
 * 📄 COMPONENTE PRINCIPAL: OrderStatusPage
 * ------------------------------------------------------------------------------
 *
 * Este componente *consume* el hook `useOrderStatus` y renderiza la UI
 * correspondiente (Carga, Error, o Éxito).
 */
export default function OrderStatusPage() {
  // 1. Obtiene el 'orderId' de la URL (ej: /order/SP-123456)
  const { orderId } = useParams();
  // 2. Usa nuestro hook personalizado para obtener los datos.
  const { order, loading, error } = useOrderStatus(orderId);

  // (Nota: Esta lógica de timeline existe pero no se usa en el JSX actual,
  // el cual solo muestra "Confirmado". Es una base para futuras mejoras.)
  const statusTimeline = ["Confirmado", "En preparación", "Listo para retirar"];
  const currentStatusIndex = order ? statusTimeline.indexOf(order.status) : -1;

  // ----------------------------------
  // 1. ESTADO DE CARGA
  // ----------------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="animate-spin text-red-600" size={48} />
        <p className="ml-4 text-gray-600">Buscando tu pedido...</p>
      </div>
    );
  }

  // ----------------------------------
  // 2. ESTADO DE ERROR
  // ----------------------------------
  if (error) {
    return (
      <div className="bg-gray-50 min-h-[60vh] flex items-center justify-center py-6 px-4">
        <div className="max-w-sm w-full bg-white p-6 rounded-lg shadow text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-xl font-bold text-gray-900">Error</h1>
          {/* Muestra el mensaje de error (ej. "No pudimos encontrar tu pedido.") */}
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <div className="mt-6">
            <Link
              to="/"
              className="text-sm font-medium text-red-600 hover:text-red-800"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------
  // 3. ESTADO DE ÉXITO (Pedido encontrado)
  // ----------------------------------
  return (
    <div className="bg-gray-50 min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Estado del Pedido
        </h1>
        {/* Muestra el ID del pedido */}
        <p className="mt-4 text-lg font-mono font-semibold text-red-600 bg-gray-100 rounded-md p-3">
          {order.externalReference}
        </p>

        {/* Sección de Estado Actual */}
        <div className="mt-8 text-left border-t pt-6">
          <h2 className="font-semibold text-lg mb-4">Estado Actual</h2>
          <div className="flex gap-4 items-center">
            {/* (Nota: Actualmente muestra "Confirmado" de forma estática.
              En el futuro, esto podría ser dinámico usando 'order.status'
              y el 'statusTimeline'.)
            */}
            <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-800">Pedido Confirmado</p>
              {/* Muestra la fecha de creación del pedido */}
              {order.createdAt && (
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleString("es-AR", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </p>
              )}
              <p className="text-sm text-gray-600 mt-2">
                Recibirás un correo electrónico cuando tu pedido esté listo para
                retirar.
              </p>
            </div>
          </div>
        </div>

        {/* Link para volver al inicio */}
        <div className="mt-8">
          <Link
            to="/"
            className="text-sm font-medium text-red-600 hover:text-red-800"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
