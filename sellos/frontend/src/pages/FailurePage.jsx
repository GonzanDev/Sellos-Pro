import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function FailurePage() {
  const [searchParams] = useSearchParams();

  // Podemos leer el ID del pedido desde la URL si MercadoPago lo envía
  const orderId = searchParams.get("external_reference");

  return (
    <div className="bg-gray-50 min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-xl shadow-lg text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Hubo un problema con tu pago
        </h1>
        <p className="mt-2 text-md text-gray-600">
          No pudimos procesar tu pago. Por favor, revisa tus datos o intenta con
          otro medio de pago.
        </p>

        {/* Mostramos el ID del intento fallido si está disponible */}
        {orderId && (
          <div className="mt-8 bg-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-600">Referencia del intento</p>
            <p className="text-lg font-mono font-semibold text-gray-800 tracking-wider">
              {orderId}
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/checkout" // Vuelve a la página de checkout
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition order-1 sm:order-2"
          >
            Volver a Intentar
          </Link>
          <Link
            to="/catalog"
            className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition order-2 sm:order-1"
          >
            Volver al Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
