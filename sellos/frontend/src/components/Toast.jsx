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
 */
import React from "react";

export default function Toast({ message, onClose }) {
  return (
    <div
      // --- Estilos de Posicionamiento y Animación ---
      // 'fixed': Fijo en la pantalla.
      // 'bottom-6 left-1/2': Centrado horizontalmente, abajo.
      // 'z-50': Se asegura de que esté por encima de la mayoría del contenido.
      // 'animate-slide-in-bottom-center': Animación CSS personalizada (definida
      // en index.css) que aparece deslizando desde abajo, ya centrada
      // (el propio keyframe incluye el translateX(-50%) para no pisarlo).
      className="fixed bottom-6 left-1/2 w-[calc(100%-2rem)] max-w-sm bg-black text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-in-bottom-center"
      // --- Accesibilidad (a11y) ---
      // 'role="alert"': Notifica a los lectores de pantalla (screen readers) que
      // este es un mensaje importante y debe ser leído en voz alta.
      role="alert"
    >
      <div className="flex items-center justify-between gap-3">
        {/* El mensaje a mostrar, recibido por props */}
        <span>{message}</span>

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
