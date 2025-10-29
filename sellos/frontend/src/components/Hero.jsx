import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    title: "WEB EN CONSTRUCCIÓN",
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
    link: "/contacto", // Corregido el link
    bgColor: "bg-gray-800",
    textColor: "text-white",
  },
  {
    title: "Kits Escolares con Descuento",
    subtitle: "¡Prepara la vuelta al cole con los mejores sellos!",
    buttonText: "Ver Ofertas",
    link: "/catalog?category=Escolar", // Sugerencia: Link a categoría específica
    bgColor: "bg-blue-600",
    textColor: "text-white",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef(null); // Ref para el temporizador automático

  // Refs para el manejo táctil
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef(null); // Ref para el contenedor principal

  // --- Funciones para el carrusel automático ---
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const startTimer = () => {
    // Limpiamos cualquier temporizador existente antes de crear uno nuevo
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(goToNextSlide, 5000); // Cambia cada 5 seg
  };

  // Efecto para el carrusel automático
  useEffect(() => {
    startTimer();
    // Limpiamos el temporizador al desmontar el componente
    return () => clearTimeout(timerRef.current);
  }, [currentSlide]); // Reinicia el temporizador cada vez que cambia el slide

  // --- Funciones para el manejo táctil ---
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const deltaX = touchStartX.current - touchEndX.current;

    // Umbral mínimo de deslizamiento para considerarlo un swipe
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe hacia la izquierda (siguiente slide)
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      } else {
        // Swipe hacia la derecha (slide anterior)
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      }
      // Reiniciamos el temporizador automático después de un swipe manual
      startTimer();
    }

    // Reseteamos las coordenadas táctiles
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section
      ref={containerRef} // Asignamos la ref al contenedor
      className="relative w-full h-[60vh] sm:h-[70vh] md:h-96 lg:h-110 overflow-hidden" // Altura adaptable
      // Añadimos los event listeners táctiles
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center p-6 transition-opacity duration-1000 ${
            slide.bgColor
          } ${slide.textColor} ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0" // Controlamos visibilidad y z-index
          }`}
          style={{ transition: "opacity 1s ease-in-out" }} // Asegura transición suave
        >
          {/* Ajustamos tamaños de texto para móvil */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {slide.title}
          </h1>
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl max-w-xl">
            {slide.subtitle}
          </p>
          <Link
            to={slide.link}
            className="mt-6 sm:mt-8 inline-block px-6 py-3 sm:px-8 sm:py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition text-sm sm:text-base"
          >
            {slide.buttonText}
          </Link>
        </div>
      ))}
      {/* Puntos de navegación del carrusel */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              startTimer(); // Reinicia timer al hacer clic en un punto
            }}
            aria-label={`Ir a slide ${index + 1}`}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
              // Ligeramente más grandes en desktop
              index === currentSlide
                ? "bg-white"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
