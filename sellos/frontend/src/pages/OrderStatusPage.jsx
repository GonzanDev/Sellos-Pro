import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Package, Loader, AlertTriangle } from "lucide-react";

// Creamos un "hook" personalizado para mantener la lógica de fetching ordenada y fuera del componente principal.
// Esto hace que el código sea más limpio y reutilizable.
function useOrderStatus(orderId) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // No hacemos nada si no hay un ID de pedido en la URL.
    if (!orderId) {
      setLoading(false);
      setError("No se proporcionó un ID de pedido.");
      return;
    }

    const fetchOrder = async () => {
      try {
        // Obtenemos la URL de la API desde las variables de entorno, como en los otros componentes.
        const API_URL =
          import.meta.env.VITE_API_URL || "http://localhost:8080/api";
        // Hacemos la llamada a la nueva ruta del backend: /api/order/<ID_DEL_PEDIDO>
        const response = await fetch(`${API_URL}/order/${orderId}`);

        if (!response.ok) {
          // Si el servidor responde con un 404 (pedido no encontrado), lanzamos un error.
          throw new Error("No pudimos encontrar tu pedido.");
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]); // Este efecto se volverá a ejecutar si el ID del pedido en la URL cambia.

  return { order, loading, error };
}

export default function OrderStatusPage() {
  // Obtenemos el 'orderId' de la URL (ej: /order/SP-123456)
  const { orderId } = useParams();
  // Usamos nuestro hook personalizado para obtener los datos.
  const { order, loading, error } = useOrderStatus(orderId);

  // Definimos la línea de tiempo de los estados para mostrar el progreso.
  const statusTimeline = ["Confirmado", "En preparación", "Listo para retirar"];
  // Buscamos el índice del estado actual para saber cuántos pasos hemos completado.
  const currentStatusIndex = order ? statusTimeline.indexOf(order.status) : -1;

  // Mostramos un indicador de carga mientras buscamos el pedido.
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="animate-spin text-red-600" size={48} />
        <p className="ml-4 text-gray-600">Buscando tu pedido...</p>
      </div>
    );
  }

  // Mostramos un mensaje de error si el pedido no se encontró o hubo otro problema.
  if (error) {
    return (
      <div className="bg-gray-50 min-h-[60vh] flex items-center justify-center py-6 px-4">
        <div className="max-w-sm w-full bg-white p-6 rounded-lg shadow text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-xl font-bold text-gray-900">Error</h1>
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

  // Si todo salió bien, mostramos los detalles del pedido.
  return (
    <div className="bg-gray-50 min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Estado del Pedido
        </h1>
        <p className="mt-4 text-lg font-mono font-semibold text-red-600 bg-gray-100 rounded-md p-3">
          {order.externalReference}
        </p>

        <div className="mt-8 text-left border-t pt-6">
          <h2 className="font-semibold text-lg mb-4">Historial de estados</h2>
          <div className="space-y-6">
            {statusTimeline.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              return (
                <div key={status} className="flex gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-colors ${
                      isCompleted ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    {isCompleted ? "✓" : ""}
                  </div>
                  <div>
                    <p
                      className={`font-semibold transition-colors ${
                        isCompleted ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      {status}
                    </p>
                    {isCompleted && status === "Confirmado" && (
                      <p className="text-xs text-gray-500">
                        {/* Formateamos la fecha para que sea más legible */}
                        {new Date(order.createdAt).toLocaleString("es-AR", {
                          dateStyle: "long",
                          timeStyle: "short",
                        })}{" "}
                        hs.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
