import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "¿Cuáles son los plazos de entrega?",
    answer:
      "Los pedidos suelen tardar entre 3 y 5 días hábiles en ser despachados. El tiempo de envío final dependerá de tu ubicación.",
  },
  {
    question: "¿Puedo personalizar mi sello?",
    answer:
      "¡Claro que sí! Ofrecemos un personalizador en la página de cada producto donde puedes añadir texto, logos y elegir colores para crear tu sello a medida.",
  },
  {
    question: "¿Qué materiales utilizan?",
    answer:
      "Utilizamos polímeros de alta durabilidad y carcasas de las mejores marcas para garantizar que tu sello tenga una larga vida útil y una impresión nítida.",
  },
  {
    question: "¿Tienen tienda física?",
    answer:
      "Sí, puedes encontrar nuestra tienda en [Tu Dirección Aquí]. También puedes realizar tu pedido online y retirarlo en el local.",
  },
];

// Subcomponente para cada item del FAQ, ahora con animación
const FaqItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="w-full flex justify-between items-center text-left text-lg font-medium text-gray-800 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{item.question}</span>
        {/* El ícono ahora rota suavemente para indicar el estado */}
        <ChevronDown
          size={24}
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Contenedor animado para la respuesta */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-gray-600 pb-2">
          <p>{item.answer}</p>
        </div>
      </div>
    </div>
  );
};

export default function FAQ() {
  return (
    <div className="w-full">
      {faqData.map((item, index) => (
        <FaqItem key={index} item={item} />
      ))}
    </div>
  );
}
