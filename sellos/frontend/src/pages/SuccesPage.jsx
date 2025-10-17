import React, { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useCart } from "../contexts/CartContext";

export default function SuccessPage() {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const effectRan = useRef(false);

  const orderId = searchParams.get("external_reference");
  const status = searchParams.get("status");

  useEffect(() => {
    if (status === "approved" && !effectRan.current) {
      clearCart();
      effectRan.current = true;
    }
  }, [status, clearCart]);

  return (
    <div className="bg-gray-50 min-h-[60vh] flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          ¡Gracias por tu pedido!
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Hemos recibido tu pedido y lo estamos procesando. Recibirás una
          notificación por correo electrónico con los detalles.
        </p>

        <div className="mt-6 bg-gray-100 rounded-md p-3">
          <p className="text-xs text-gray-600">Número de pedido</p>
          <p className="text-sm font-mono font-semibold text-gray-800 tracking-wide">
            {orderId || "N/A"}
          </p>
        </div>

        {orderId && (
          <div className="mt-4">
            <Link
              to={`/order/${orderId}`}
              className="text-sm font-medium text-red-600 hover:text-red-800"
            >
              Ver estado de tu pedido →
            </Link>
          </div>
        )}

        <div className="mt-6">
          <Link
            to="/catalog"
            className="px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition"
          >
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
