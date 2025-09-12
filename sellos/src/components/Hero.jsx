import React from "react";

function Hero() {
  return (
    <section className="bg-gray-100 text-center py-20" id="hero">
      <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
        Sellos personalizados de calidad
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-6">
        Confiabilidad, diseño y rapidez en cada pedido
      </p>
      <a
        href="#catalog"
        className="bg-red-600 text-white px-6 py-3 rounded-full font-medium hover:bg-black transition"
      >
        Ver Catálogo
      </a>
    </section>
  );
}

export default Hero;
