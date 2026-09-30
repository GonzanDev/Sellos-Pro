/**
 * ==============================================================================
 * 🔔 COMPONENTE: Notificación (Toast.jsx)
 * ==============================================================================
 *
 * Descripción: Renderiza una notificación simple (un "toast") que aparece en la
 * esquina inferior izquierda de la pantalla.
 *
 * Es un componente "tonto" (presentacional):
 * - No maneja su propia visibilidad (el padre decide si renderizarlo o no).
 * - No se auto-cierra con un temporizador (el padre debe manejar esa lógica).
 * - Simplemente muestra un mensaje y provee un botón para cerrarse.
 *
 * @param {object} props
 * @param {string} props.message - El mensaje de texto que se mostrará dentro del toast.
 * @param {function} props.onClose - La función (callback) que se ejecutará cuando el
 * usuario haga clic en el botón de cerrar (✕).
 * @param {boolean} [props.closing] - Si es true, reproduce la animación de salida
 * en vez de la de entrada (el padre sigue siendo quien decide cuándo desmontar
 * el componente, después de que la animación termine).
 * @param {"success"|"error"} [props.type] - Determina el ícono y el acento de
 * color (verde para éxito, rojo para error).
 */
import React from "react";

const ICONS = {
  success: (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5 text-green-400 shrink-0"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5 text-red-400 shrink-0"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export default function Toast({ message, onClose, closing = false, type = "success" }) {
  return (
    <div
      // --- Estilos de Posicionamiento y Animación ---
      // 'fixed': Fijo en la pantalla.
      // 'bottom-6 left-1/2': Centrado horizontalmente, abajo.
      // 'z-50': Se asegura de que esté por encima de la mayoría del contenido.
      // 'animate-slide-in/out-bottom-center': Animaciones CSS personalizadas
      // (definidas en index.css) que aparecen/desaparecen deslizando desde/hacia
      // abajo, ya centradas (el propio keyframe incluye el translateX(-50%)).
      className={`fixed bottom-6 left-1/2 w-[calc(100%-2rem)] max-w-sm bg-black text-white px-4 py-3 rounded-lg shadow-lg z-50 ${
        closing
          ? "animate-slide-out-bottom-center"
          : "animate-slide-in-bottom-center"
      }`}
      // --- Accesibilidad (a11y) ---
      // 'role="alert"': Notifica a los lectores de pantalla (screen readers) que
      // este es un mensaje importante y debe ser leído en voz alta.
      role="alert"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {ICONS[type]}
          {/* El mensaje a mostrar, recibido por props */}
          <span>{message}</span>
        </div>

        {/* Botón de Cerrar */}
        <button
          onClick={onClose} // Llama a la función 'onClose' del padre al hacer clic.
          className="text-gray-400 hover:text-white"
          aria-label="Cerrar notificación" // Añadido aria-label para accesibilidad
        >
          ✕
        </button>
      </div>
    </div>
  );
}
