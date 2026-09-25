/**
 * ==============================================================================
 * 📱 COMPONENTE: Formulario de Contacto (ContactForm.jsx)
 * ==============================================================================
 *
 * Descripción: Renderiza un formulario de contacto simple (Nombre, Email, Mensaje).
 *
 * Funcionalidad Clave:
 * En lugar de enviar el formulario a un backend o por email, este componente
 * formatea los datos en un mensaje pre-escrito y abre la API "click-to-chat"
 * de WhatsApp en una nueva pestaña, listo para ser enviado al número de la
 * empresa.
 */
import React, { useState } from "react";

// Número de WhatsApp de destino (Formato internacional sin '+' o '00').
const WHATSAPP_NUMBER = "5492235551071";

export default function ContactForm() {
  /**
   * --------------------------------------------------------------------------
   * ESTADO: `form`
   * --------------------------------------------------------------------------
   * Utiliza el hook `useState` para mantener el estado de todos los campos
   * del formulario en un solo objeto.
   */
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  /**
   * --------------------------------------------------------------------------
   * MANEJADOR: `handleChange`
   * --------------------------------------------------------------------------
   * Un manejador genérico que se actualiza el estado del formulario.
   * Utiliza el atributo 'name' del input/textarea para saber qué
   * propiedad del estado `form` debe actualizar.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - El evento de cambio.
   */
  const handleChange = (e) => {
    // [e.target.name] -> 'nombre', 'email', o 'mensaje'
    // e.target.value  -> El texto escrito por el usuario
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * --------------------------------------------------------------------------
   * MANEJADOR: `handleSubmit`
   * --------------------------------------------------------------------------
   * Se ejecuta cuando el usuario envía el formulario (clic en el botón "submit").
   *
   * @param {React.FormEvent<HTMLFormElement>} e - El evento de envío del formulario.
   */
  const handleSubmit = (e) => {
    // 1. Previene el comportamiento por defecto del formulario (que recargaría la página).
    e.preventDefault();

    // 2. Validación simple: verifica que ningún campo esté vacío.
    if (!form.nombre || !form.email || !form.mensaje) {
      alert("Por favor completá todos los campos.");
      return; // Detiene la ejecución si falta algún campo.
    }

    // 3. Formatea el texto para la URL de WhatsApp.
    //    '%0A' es el código de URL para un "salto de línea".
    const text = `Hola! Soy ${form.nombre} (${form.email}).%0A%0A${form.mensaje}`;

    // 4. Construye la URL final de la API "wa.me".
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

    // 5. Abre la URL de WhatsApp en una nueva pestaña del navegador.
    window.open(url, "_blank");
  };

  /**
   * --------------------------------------------------------------------------
   * RENDERIZACIÓN
   * --------------------------------------------------------------------------
   * Renderiza el `<form>` y sus elementos.
   * - `onSubmit={handleSubmit}`: Conecta el envío del formulario a nuestra función.
   * - `value={form.nombre}` y `onChange={handleChange}`: Esto es lo que
   * lo convierte en un "componente controlado". El estado de React
   * es la única fuente de verdad para el valor del input.
   */
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* --- Campo Nombre --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full bg-gray-100 border-transparent rounded-md px-4 py-3 focus:ring-2 focus:ring-red-500 focus:bg-white transition"
          placeholder="Tu nombre completo"
        />
      </div>

      {/* --- Campo Email --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo Electrónico
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full bg-gray-100 border-transparent rounded-md px-4 py-3 focus:ring-2 focus:ring-red-500 focus:bg-white transition"
          placeholder="tu@email.com"
        />
      </div>

      {/* --- Campo Mensaje --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mensaje
        </label>
        <textarea
          name="mensaje"
          value={form.mensaje}
          onChange={handleChange}
          rows="5"
          className="w-full resize-none bg-gray-100 border-transparent rounded-md px-4 py-3 focus:ring-2 focus:ring-red-500 focus:bg-white transition"
          placeholder="Escribe tu consulta aquí..."
        />
      </div>

      {/* --- Botón de Envío --- */}
      <button
        type="submit"
        className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition font-semibold text-lg"
      >
        Enviar Mensaje
      </button>
    </form>
  );
}
