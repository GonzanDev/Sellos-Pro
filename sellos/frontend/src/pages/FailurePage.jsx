/**
 * ==============================================================================
 * ❌ PÁGINA: Pago Fallido (FailurePage.jsx)
 * ==============================================================================
 *
 * Descripción:
 * Esta es la página a la que MercadoPago redirige al usuario si el pago es
 * rechazado, cancelado o falla por cualquier motivo.
 * Corresponde a la URL 'back_urls.failure' que se define al crear la
 * preferencia de pago en el backend.
 *
 * Responsabilidades:
 * 1. Informar al usuario que el pago no fue procesado.
 * 2. Leer la URL para capturar parámetros de consulta (query params).
 * 3. Mostrar el 'external_reference' (ID del pedido) si MercadoPago lo
 * incluye en la URL, para que el usuario tenga una referencia.
 * 4. Ofrecer acciones claras, como "Volver a Intentar" (regresar al checkout)
 * o "Volver al Catálogo".
 */

import React from "react";
import { Link, useSearchParams } from "react-router-dom"; // Para navegación y leer params de URL
import { AlertTriangle } from "lucide-react"; // Icono de advertencia

export default function FailurePage() {
  // Hook de React Router DOM para leer los parámetros de consulta de la URL.
  // Ej: /failure?external_reference=SP-123456789
  const [searchParams] = useSearchParams();

  // Intentamos obtener el 'external_reference' (nuestro ID de pedido)
  // que MercadoPago anexa a la URL de redirección.
  const orderId = searchParams.get("external_reference");

  return (
    // Contenedor principal de la página, centrado verticalmente
    <div className="bg-gray-50 min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Tarjeta de contenido */}
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-xl shadow-lg text-center">
        {/* Icono de Error */}
        <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />

        {/* Mensajes de Feedback */}
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Hubo un problema con tu pago
        </h1>
        <p className="mt-2 text-md text-gray-600">
          No pudimos procesar tu pago. Por favor, revisa tus datos o intenta con
          otro medio de pago.
        </p>

        {/* --- Bloque Condicional: ID de Referencia --- */}
        {/* Si logramos leer el 'orderId' de la URL, lo mostramos.
            Esto es útil para que el usuario pueda contactar a soporte
            con una referencia clara del intento fallido. */}
        {orderId && (
          <div className="mt-8 bg-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-600">Referencia del intento</p>
            <p className="text-lg font-mono font-semibold text-gray-800 tracking-wider">
              {orderId}
            </p>
          </div>
        )}

        {/* --- Botones de Acción --- */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          {/*
           * Botón "Volver a Intentar": Devuelve al usuario a la página
           * de checkout (que aún debería tener sus datos y carrito).
           */}
          <Link
            to="/checkout"
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition order-1 sm:order-2"
          >
            Volver a Intentar
          </Link>
          {/*
           * Botón "Volver al Catálogo": Permite al usuario
           * abandonar el checkout y seguir navegando.
           */}
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
