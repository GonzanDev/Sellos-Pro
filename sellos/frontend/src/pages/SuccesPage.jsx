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
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* --- CAMBIO CLAVE: Contenedor más compacto --- */}
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-xl shadow-lg text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          ¡Gracias por tu pedido!
        </h1>
        <p className="mt-2 text-md text-gray-600">
          Hemos recibido tu pedido y lo estamos procesando. Recibirás una
          notificación por correo electrónico con los detalles.
        </p>

        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-600">Número de pedido</p>
          <p className="text-lg font-mono font-semibold text-gray-800 tracking-wider">
            {orderId || "N/A"}
          </p>
        </div>

        {orderId && (
          <div className="mt-6">
            <Link
              to={`/order/${orderId}`}
              className="text-sm font-medium text-red-600 hover:text-red-800"
            >
              Ver estado de tu pedido →
            </Link>
          </div>
        )}

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
