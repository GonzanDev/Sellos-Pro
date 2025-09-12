import React, { useState } from "react";

const faqs = [
  {
    question: "¿Cuánto tarda la entrega?",
    answer: "Entre 3 y 5 días hábiles.",
  },
  {
    question: "¿Puedo personalizar mi sello?",
    answer: "Sí, con logo, texto y tipografía.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Tarjetas, transferencias y MercadoPago.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-16 px-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8 text-red-600">
        Preguntas Frecuentes
      </h2>
      <div className="max-w-2xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md">
            <button
              className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-800"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {faq.question}
              <span>{openIndex === index ? "−" : "+"}</span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openIndex === index ? "max-h-40 p-4" : "max-h-0"
              }`}
            >
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
