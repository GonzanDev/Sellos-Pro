/**
 * ==============================================================================
 * 🌟 COMPONENTE: Héroe (Hero.jsx)
 * ==============================================================================
 *
 * Descripción: Renderiza el componente "Hero" principal de la página de inicio.
 * Es un carrusel (slider) de diapositivas promocionales.
 *
 * Funcionalidades Clave:
 * 1. Muestra 'slides' (diapositivas) hardcodeados con imagen de fondo, título y CTA.
 * 2. Carrusel Automático: Avanza automáticamente cada 5 segundos...
 *    - ...salvo que el usuario lo pause, o que su sistema pida "menos movimiento"
 *      (`prefers-reduced-motion`), en cuyo caso NO hay auto-avance.
 * 3. Control Manual (Dots): Permite saltar a un slide específico.
 * 4. Control Táctil (Swipe): Permite deslizar entre slides en móviles.
 * 5. Botón Pausar/Reanudar el auto-avance.
 * 6. Accesibilidad: un único <h1> estable para la página, títulos de slide como
 *    <h2>, slides inactivos ocultos al lector de pantalla y fuera del tab order.
 */
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Para los botones de Call-to-Action (CTA).
import { Pause, Play, ChevronLeft, ChevronRight } from "lucide-react"; // Íconos de controles.

/**
 * ------------------------------------------------------------------------------
 * DATOS: Contenido de las Diapositivas
 * ------------------------------------------------------------------------------
 */
const slides = [
  {
    title: "DESCUENTOS POR LANZAMIENTO",
    subtitle:
      "¡Promociones en automáticos por el lanzamiento de nuestra página web!",
    buttonText: "Ver Catálogo",
    link: "/catalog",
    bgImage: "/images/Hero/Hero1.webp",
    textColor: "text-white",
  },
  {
    title: "Retirá en el local",
    subtitle: "Vení a retirar tu pedido y consultanos lo que necesites.",
    buttonText: "Consultar",
    link: "/contacto",
    bgImage: "/images/Hero/Hero2r.webp",
    textColor: "text-white",
  },
  {
    title: "Kits Escolares con Descuento",
    subtitle: "¡Prepará la vuelta al cole con los mejores sellos!",
    buttonText: "Ver Ofertas",
    link: "/catalog?category=Escolar",
    bgImage: "/images/Hero/Hero2c.webp",
    textColor: "text-white",
  },
];

const AUTOPLAY_MS = 5000;

export default function Hero() {
  // --- ESTADO ---
  // Índice del slide visible actualmente.
  const [currentSlide, setCurrentSlide] = useState(0);
  // ¿El usuario pausó el auto-avance?
  const [isPaused, setIsPaused] = useState(false);
  // ¿El sistema pide reducir el movimiento? (accesibilidad)
  const [reducedMotion, setReducedMotion] = useState(false);

  // --- REFERENCIAS ---
  const timerRef = useRef(null); // ID del temporizador de auto-avance.
  const touchStartX = useRef(0); // Coordenada X inicial del swipe.
  const touchEndX = useRef(0); // Coordenada X final del swipe.
  const containerRef = useRef(null);

  // El auto-avance solo corre si NO está pausado y NO se pidió reducir movimiento.
  const autoplayActive = !isPaused && !reducedMotion;

  // --- DETECCIÓN DE `prefers-reduced-motion` ---
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // --- LÓGICA DEL CARRUSEL AUTOMÁTICO ---
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  /**
   * Inicia (o reinicia) el temporizador del carrusel automático.
   * No hace nada si el auto-avance no está activo.
   */
  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!autoplayActive) return;
    timerRef.current = setTimeout(goToNextSlide, AUTOPLAY_MS);
  };

  // --- EFECTO: Auto-play y Limpieza ---
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // Se re-evalúa al cambiar de slide o el estado de auto-avance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide, autoplayActive]);

  // --- LÓGICA TÁCTIL (Swipe) ---
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const deltaX = touchStartX.current - touchEndX.current;

    // Umbral de 50px para distinguir un swipe de un simple toque.
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        goToNextSlide();
      } else {
        goToPrevSlide();
      }
      startTimer(); // Reinicia el temporizador tras la interacción manual.
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // --- RENDERIZACIÓN ---
  return (
    <section
      ref={containerRef}
      aria-roledescription="carrusel"
      aria-label="Promociones destacadas"
      className="relative w-full h-[60vh] sm:h-[70vh] md:h-96 lg:h-110 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Título estable de la página para SEO y lectores de pantalla.
          Los títulos rotativos de cada slide son <h2>, no <h1>. */}
      <h1 className="sr-only">
        Sellospro — Sellos personalizados fabricados en Mar del Plata desde 1980
      </h1>

      {/* --- 1. Slides --- */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={index}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${index + 1} de ${slides.length}`}
            aria-hidden={!isActive}
            className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center p-6 transition-opacity ${
              reducedMotion ? "duration-0" : "duration-1000 ease-in-out"
            } ${slide.textColor} ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            style={{
              backgroundImage: `url(${slide.bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Capa de superposición para asegurar contraste del texto. */}
            <div className="absolute inset-0 bg-[rgba(18,10,10,0.55)] z-20"></div>

            {/* Contenido del slide (por encima del overlay). */}
            <div className="relative z-30 flex flex-col items-center justify-center text-center">
              <h2 className="font-bold leading-none tracking-[-0.02em] text-[clamp(2.5rem,1.2rem+5.5vw,4.25rem)]">
                {slide.title}
              </h2>
              <p className="mt-4 max-w-lg text-white/80 text-[clamp(0.95rem,0.9rem+0.35vw,1.1rem)]">
                {slide.subtitle}
              </p>
              <Link
                to={slide.link}
                // Slides inactivos quedan fuera del orden de tabulación.
                tabIndex={isActive ? 0 : -1}
                className="mt-6 sm:mt-8 inline-block px-6 py-3 sm:px-8 sm:py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition text-sm sm:text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e30613]"
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        );
      })}

      {/* --- 2. Flechas anterior/siguiente (desktop; en táctil basta el swipe) --- */}
      <button
        type="button"
        onClick={() => {
          goToPrevSlide();
          startTimer();
        }}
        aria-label="Diapositiva anterior"
        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-10 h-10 rounded-full text-white bg-black/40 hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white transition-colors"
      >
        <ChevronLeft size={22} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => {
          goToNextSlide();
          startTimer();
        }}
        aria-label="Diapositiva siguiente"
        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-10 h-10 rounded-full text-white bg-black/40 hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white transition-colors"
      >
        <ChevronRight size={22} aria-hidden="true" />
      </button>

      {/* --- 3. Controles inferiores: puntos + pausar/reanudar --- */}
      <div className="absolute bottom-2 left-0 right-0 z-30 flex items-center justify-center gap-2 px-4">
        {/* Puntos de navegación (área táctil de 40px, punto visible pequeño). */}
        {slides.map((_, index) => {
          const isActive = index === currentSlide;
          return (
            <button
              key={index}
              type="button"
              onClick={() => {
                setCurrentSlide(index);
                startTimer();
              }}
              aria-label={`Ir al slide ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
              className="flex items-center justify-center w-10 h-10 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <span
                className={`block rounded-full transition-all ${
                  isActive
                    ? "w-3 h-3 bg-white"
                    : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            </button>
          );
        })}

        {/* Botón Pausar/Reanudar (solo relevante si hay auto-avance posible). */}
        {!reducedMotion && (
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            aria-label={
              isPaused ? "Reanudar el carrusel" : "Pausar el carrusel"
            }
            className="absolute right-3 bottom-1 flex items-center justify-center w-10 h-10 rounded-full text-white bg-black/40 hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white transition-colors"
          >
            {isPaused ? (
              <Play size={18} aria-hidden="true" />
            ) : (
              <Pause size={18} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </section>
  );
}
