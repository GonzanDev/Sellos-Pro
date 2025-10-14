import React from "react";
import { useParams, Link } from "react-router-dom";
import { Package } from "lucide-react";

export default function OrderStatusPage() {
  const { orderId } = useParams();

  // En el futuro, aquí harías una llamada a tu backend para obtener el estado real del pedido.
  // const { order, loading, error } = useOrderStatus(orderId);

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full bg-white p-8 sm:p-12 rounded-xl shadow-lg text-center">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Estado del Pedido
        </h1>
        <p className="mt-2 text-md text-gray-600">
          Siguiendo el pedido con ID:
        </p>
        <p className="mt-4 text-lg font-mono font-semibold text-red-600 bg-gray-100 rounded-md p-3">
          MP-{orderId}
        </p>

        {/* Placeholder para el estado del pedido */}
        <div className="mt-8 text-left border-t pt-6">
          <h2 className="font-semibold text-lg">Historial de estados</h2>
          <div className="mt-4 space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <p className="font-semibold">Pedido confirmado</p>
                <p className="text-sm text-gray-500">
                  14 de Octubre, 2025 - 12:35 PM
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              <div>
                <p className="font-semibold text-gray-500">En preparación</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              <div>
                <p className="font-semibold text-gray-500">
                  Listo para retirar
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
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
