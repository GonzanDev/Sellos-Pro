/**
 * ==============================================================================
 * ❓ COMPONENTE: Preguntas Frecuentes (FAQ.jsx)
 * ==============================================================================
 *
 * Descripción: Muestra una lista de preguntas frecuentes en un formato de
 * "acordeón" colapsable.
 *
 * Estructura:
 * 1. `faqData`: Un array constante con el contenido de las preguntas y respuestas.
 * 2. `FaqItem`: Un subcomponente "inteligente" (stateful) que maneja su
 * propio estado (abierto/cerrado) y animaciones.
 * 3. `FAQ` (Default): El componente principal "tonto" (stateless) que simplemente
 * mapea los datos y renderiza un `FaqItem` por cada uno.
 */
import React, { useState } from "react";
import { ChevronDown } from "lucide-react"; // Icono de flecha.

/**
 * ------------------------------------------------------------------------------
 * DATOS: Contenido del FAQ
 * ------------------------------------------------------------------------------
 * Fuente de contenido hardcodeada para el componente.
 * Si esto creciera, podría moverse a un archivo JSON o a una API.
 */
const faqData = [
  {
    question: "¿Cuáles son los plazos de entrega?",
    answer:
      "Depende del tipo de sello que elijas. Generalmente, los automáticos estan listos para retirar en 2 días hábiles, mientras que los sellos KIT LOGO personalizados tardan 10 días hábiles desde el momento de la compra. Igualmente, el cliente sera avisado vía WhatsApp al momento que su pedido este listo para ser retirado.",
  },
  {
    question: "¿Puedo personalizar mi sello?",
    answer:
      "Ofrecemos un personalizador en la página de cada producto donde puedes añadir texto, logos y elegir colores para crear tu sello a medida. Si necesitas darnos instrucciones específicas también tienes un cuadro para detallar lo que necesites.",
  },
  {
    question: "¿Hacen envios?",
    answer:
      "De momento no realizamos envíos, pero el cliente si desea puede contratar un servicio externo para que pase a retirar el pedido en nuestra tienda.",
  },
  {
    question: "¿Donde retiro mi pedido?",
    answer:
      "Podes encontrarnos en nuestra nuestra tienda para retirar tu pedido en Bermejo 477 de Lunes a Viernes de 10hs. a 15hs.",
  },
];

/**
 * ------------------------------------------------------------------------------
 * SUBCOMPONENTE: Ítem individual del FAQ (FaqItem)
 * ------------------------------------------------------------------------------
 * Este componente es "stateful", maneja su propio estado de 'isOpen'.
 *
 * @param {object} props
 * @param {object} props.item - El objeto de pregunta/respuesta.
 * @param {string} props.item.question - La pregunta a mostrar.
 * @param {string} props.item.answer - La respuesta a mostrar/ocultar.
 */
const FaqItem = ({ item }) => {
  // Hook de estado para controlar si este ítem está abierto (true) o cerrado (false).
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      {/* --- Botón (Trigger) --- */}
      {/* Es el botón clickeable que contiene la pregunta y el icono. */}
      <button
        className="w-full flex justify-between items-center text-left text-lg font-medium text-gray-800 focus:outline-none"
        // Al hacer clic, invierte el valor de 'isOpen'.
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{item.question}</span>

        {/* --- Icono Animado --- */}
        {/* El ícono rota 180 grados suavemente basado en el estado 'isOpen'. */}
        <ChevronDown
          size={24}
          className={`transform transition-transform duration-300 ${
            // Aplica la clase de rotación condicionalmente.
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* --- Contenedor de Respuesta (Animado) --- */}
      {/*
       * Este 'div' se expande o colapsa usando un "truco" de 'max-height'.
       * - Cerrado: 'max-h-0' (altura 0) y 'opacity-0' (invisible).
       * - Abierto: 'max-h-96' (altura suficiente para el contenido) y
       * 'opacity-100' (visible).
       * 'transition-all' y 'duration-500' crean la animación de deslizamiento.
       */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-gray-600 pb-2">
          {/* El contenido de la respuesta. */}
          <p>{item.answer}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * ------------------------------------------------------------------------------
 * COMPONENTE PRINCIPAL: Lista de FAQ (FAQ)
 * ------------------------------------------------------------------------------
 * Este componente es "stateless". Su única tarea es iterar sobre
 * `faqData` y renderizar un `FaqItem` por cada elemento.
 */
export default function FAQ() {
  return (
    <div className="w-full">
      {/* Mapea el array de datos */}
      {faqData.map((item, index) => (
        // Renderiza el subcomponente por cada ítem.
        // Se usa 'index' como key, lo cual es aceptable AQUÍ
        // porque la lista 'faqData' es estática y nunca cambia de orden.
        <FaqItem key={index} item={item} />
      ))}
    </div>
  );
}
