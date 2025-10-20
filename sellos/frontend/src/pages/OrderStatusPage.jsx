import React from "react";
import { useParams, Link } from "react-router-dom";
import { Package } from "lucide-react";

export default function OrderStatusPage() {
  const { orderId } = useParams();

  // En el futuro, aquí harías una llamada a tu backend para obtener el estado real del pedido.
  // const { order, loading, error } = useOrderStatus(orderId);

  return (
    <div className="bg-gray-50 min-h-[60vh] flex items-center justify-center py-6 px-4 sm:px-6">
      <div className="max-w-sm w-full bg-white p-6 rounded-lg shadow text-center">
        <Package className="mx-auto h-10 w-10 text-gray-400" />
        <h1 className="mt-3 text-xl font-bold text-gray-900">
          Estado del Pedido
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Siguiendo el pedido con ID:
        </p>
        <p className="mt-3 text-base font-mono font-semibold text-red-600 bg-gray-100 rounded-md p-2">
          {orderId}
        </p>

        {/* Placeholder para el estado del pedido */}
        <div className="mt-6 text-left border-t pt-4">
          <h2 className="font-semibold text-md">Historial de estados</h2>
          <div className="mt-3 space-y-3">
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm">
                ✓
              </div>
              <div>
                <p className="font-semibold">Pedido confirmado</p>
                <p className="text-xs text-gray-500">
                  14 de Octubre, 2025 - 12:35 PM
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-300" />
              <div>
                <p className="font-semibold text-gray-500">En preparación</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-300" />
              <div>
                <p className="font-semibold text-gray-500">
                  Listo para retirar
                </p>
              </div>
            </div>
          </div>
        </div>

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
