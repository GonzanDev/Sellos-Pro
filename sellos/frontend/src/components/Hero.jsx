/**
 * ==============================================================================
 * 🌟 COMPONENTE: Héroe (Hero.jsx)
 * ==============================================================================
 *
 * Descripción: Renderiza el componente "Hero" principal de la página de inicio.
 * Se trata de un carrusel (slider) de pantalla completa que muestra
 * diapositivas promocionales.
 *
 * Funcionalidades Clave:
 * 1. Muestra 'slides' (diapositivas) hardcodeados con imagen de fondo, título y CTA.
 * 2. Carrusel Automático: Cambia de slide automáticamente cada 5 segundos.
 * 3. Control Manual (Dots): Permite al usuario saltar a un slide específico.
 * 4. Control Táctil (Swipe): Permite deslizar (swipe) entre slides en
 * dispositivos móviles.
 * 5. El temporizador automático se reinicia después de cualquier interacción
 * manual (clic en punto o swipe).
 */
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Para los botones de Call-to-Action (CTA).

/**
 * ------------------------------------------------------------------------------
 * DATOS: Contenido de las Diapositivas
 * ------------------------------------------------------------------------------
 * Fuente de contenido hardcodeada para el carrusel.
 */
const slides = [
  {
    title: "WEB EN CONSTRUCCIÓN",
    subtitle: "Calidad y diseño a tu medida.",
    buttonText: "Ver Catálogo",
    link: "/catalog",
    bgImage: "/images/Hero/Hero1.jpg",
    textColor: "text-white",
  },
  {
    title: "Retira en el local",
    subtitle: "Veni a retirar tu pedido y consultanos lo que necesites.",
    buttonText: "Consultar",
    link: "/contacto",
    bgImage: "/images/Hero/Hero2r.jpg",
    textColor: "text-white",
  },
  {
    title: "Kits Escolares con Descuento",
    subtitle: "¡Prepara la vuelta al cole con los mejores sellos!",
    buttonText: "Ver Ofertas",
    link: "/catalog?category=Escolar",
    bgImage: "/images/Hero/Hero2c.jpg",
    textColor: "text-white",
  },
];

export default function Hero() {
  /**
   * --------------------------------------------------------------------------
   * ESTADO
   * --------------------------------------------------------------------------
   */
  // Almacena el índice (0, 1, 2...) del slide que está visible actualmente.
  const [currentSlide, setCurrentSlide] = useState(0);

  /**
   * --------------------------------------------------------------------------
   * REFERENCIAS (useRef)
   * --------------------------------------------------------------------------
   * Usamos `useRef` para mantener valores que persisten entre renders
   * pero que NO causan un nuevo render al cambiar (a diferencia de `useState`).
   */
  // Almacena el ID del temporizador (setTimeout) del carrusel automático.
  // Es crucial para poder *limpiarlo* (cancelarlo) cuando sea necesario.
  const timerRef = useRef(null);

  // Almacenan las coordenadas X de inicio y fin de un gesto táctil (swipe).
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  // Referencia al elemento DOM de la sección principal.
  const containerRef = useRef(null);

  /**
   * --------------------------------------------------------------------------
   * LÓGICA DEL CARRUSEL AUTOMÁTICO
   * --------------------------------------------------------------------------
   */

  /**
   * Avanza al siguiente slide.
   * Si está en el último, vuelve al primero (índice 0).
   */
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  /**
   * Inicia (o reinicia) el temporizador del carrusel automático.
   * - Primero, limpia cualquier temporizador anterior (para evitar duplicados).
   * - Luego, crea un nuevo temporizador que llamará a `goToNextSlide` en 5 seg.
   */
  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(goToNextSlide, 5000); // 5000ms = 5 segundos
  };

  /**
   * --------------------------------------------------------------------------
   * EFECTO (Auto-play y Limpieza)
   * --------------------------------------------------------------------------
   */
  useEffect(() => {
    // Inicia el temporizador cuando el componente se monta
    // y cada vez que el `currentSlide` cambia (por un swipe o clic).
    startTimer();

    // Función de LIMPIEZA:
    // Se ejecuta cuando el componente se desmonta (sale de la página).
    // Esto es VITAL para prevenir 'memory leaks' y que el temporizador
    // intente actualizar un componente que ya no existe.
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide]); // Dependencia: se re-ejecuta si `currentSlide` cambia.

  /**
   * --------------------------------------------------------------------------
   * LÓGICA TÁCTIL (Swipe)
   * --------------------------------------------------------------------------
   */

  /**
   * Captura la coordenada X *inicial* cuando el usuario toca la pantalla.
   * @param {React.TouchEvent} e
   */
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  /**
   * Actualiza la coordenada X *final* mientras el dedo se mueve.
   * @param {React.TouchEvent} e
   */
  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  /**
   * Se dispara cuando el usuario levanta el dedo.
   * Calcula si el gesto fue un "swipe" y en qué dirección.
   */
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    // Calcula la distancia horizontal del swipe.
    const deltaX = touchStartX.current - touchEndX.current;

    // Umbral: El swipe debe ser de al menos 50px para ser considerado.
    // Esto evita que un simple "toque" (tap) sea interpretado como swipe.
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe hacia la izquierda (deltaX positivo) -> Siguiente slide
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      } else {
        // Swipe hacia la derecha (deltaX negativo) -> Slide anterior
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      }
      // IMPORTANTE: Reinicia el temporizador automático después del swipe manual.
      startTimer();
    }

    // Resetea las coordenadas para el próximo toque.
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  /**
   * --------------------------------------------------------------------------
   * RENDERIZACIÓN
   * --------------------------------------------------------------------------
   */
  return (
    <section
      ref={containerRef} // Asigna la ref al contenedor
      className="relative w-full h-[60vh] sm:h-[70vh] md:h-96 lg:h-110 overflow-hidden"
      // Asigna los event listeners táctiles al contenedor principal.
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* --- 1. Renderizado de Slides --- */}
      {/* Itera sobre `slides` para renderizar *todos* los slides,
          uno encima de otro. */}
      {slides.map((slide, index) => (
        <div
          key={index}
          // Lógica de visibilidad (Transición de Opacidad):
          // El slide actual (index === currentSlide) tiene opacidad 1 y z-10.
          // Los demás tienen opacidad 0 y z-0 (están ocultos detrás).
          className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center p-6 transition-opacity duration-1000 ${
            slide.textColor
          } ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          // Estilos en línea para las imágenes de fondo dinámicas.
          style={{
            transition: "opacity 1s ease-in-out",
            backgroundImage: `url(${slide.bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Contenido del Slide (Texto y Botón) */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {slide.title}
          </h1>
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl max-w-xl">
            {slide.subtitle}
          </p>
          {/* Botón Call-to-Action (CTA) */}
          <Link
            to={slide.link}
            className="mt-6 sm:mt-8 inline-block px-6 py-3 sm:px-8 sm:py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition text-sm sm:text-base"
          >
            {slide.buttonText}
          </Link>
        </div>
      ))}

      {/* --- 2. Puntos de Navegación (Dots) --- */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {/* Itera de nuevo, esta vez solo para crear los botones (puntos). */}
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              // Al hacer clic, salta al slide 'index'.
              setCurrentSlide(index);
              // Y reinicia el temporizador automático.
              startTimer();
            }}
            aria-label={`Ir a slide ${index + 1}`}
            // Lógica de estilo para el punto activo.
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
              index === currentSlide
                ? "bg-white" // Punto activo
                : "bg-white/50 hover:bg-white/75" // Puntos inactivos
            }`}
          />
        ))}
      </div>
    </section>
  );
}
