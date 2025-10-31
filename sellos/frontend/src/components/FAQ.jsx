import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

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
