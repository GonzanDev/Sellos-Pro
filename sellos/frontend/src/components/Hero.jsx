import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "¡Personaliza tu Sello!",
    subtitle: "Calidad y diseño a tu medida.",
    buttonText: "Ver Catálogo",
    link: "/catalog",
    bgColor: "bg-[#e30613]",
    textColor: "text-white",
  },
  {
    title: "Envíos a Todo el País",
    subtitle: "Recibe tus sellos sin moverte de tu casa.",
    buttonText: "Consultar",
    link: "/contact",
    bgColor: "bg-gray-800",
    textColor: "text-white",
  },
  {
    title: "Kits Escolares con Descuento",
    subtitle: "¡Prepara la vuelta al cole con los mejores sellos!",
    buttonText: "Ver Ofertas",
    link: "/catalog",
    bgColor: "bg-blue-600",
    textColor: "text-white",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Cambia de slide cada 5 segundos

    return () => clearTimeout(timer);
  }, [currentSlide]);

  return (
    <section className="relative w-full h-110 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center p-6 transition-opacity duration-1000 ${
            slide.bgColor
          } ${slide.textColor} ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <h1 className="text-5xl font-bold">{slide.title}</h1>
          <p className="mt-4 text-xl">{slide.subtitle}</p>
          <Link
            to={slide.link}
            className="mt-8 inline-block px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition"
          >
            {slide.buttonText}
          </Link>
        </div>
      ))}
      {/* Puntos de navegación del carrusel */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
