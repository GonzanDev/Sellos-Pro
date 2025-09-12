import React, { useState } from "react";

const questions = [
  { q: "¿Cuánto tarda el envío?", a: "Generalmente entre 3 y 5 días hábiles." },
  {
    q: "¿Hacen sellos personalizados?",
    a: "Sí, podés subir tu logo y texto en el personalizador.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Trabajamos con tarjetas y Mercado Pago.",
  },
];

function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-16 bg-white" id="faq">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-black mb-8 text-center">
          Preguntas Frecuentes
        </h2>
        <div className="space-y-4">
          {questions.map((item, idx) => (
            <div key={idx} className="border rounded-lg">
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                className="w-full flex justify-between items-center p-4 font-medium"
              >
                {item.q}
                <span>{open === idx ? "-" : "+"}</span>
              </button>
              {open === idx && (
                <div className="p-4 border-t text-gray-700">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
