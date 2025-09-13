import React from "react";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-black to-[#e30613] text-white py-24 text-center">
      <h1 className="text-4xl md:text-6xl font-bold">Sellos Profesionales</h1>
      <p className="mt-4 text-lg md:text-xl">
        Personalizá tus sellos con la mejor calidad y envío rápido.
      </p>
      <a
        href="#catalog"
        className="mt-6 inline-block px-6 py-3 bg-white text-black rounded hover:bg-gray-100 transition"
      >
        Ver Catálogo
      </a>
    </section>
  );
}
