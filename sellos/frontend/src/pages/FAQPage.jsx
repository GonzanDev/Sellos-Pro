/**
 * ==============================================================================
 * ℹ️ PÁGINA: Sobre Nosotros y FAQ (FaqPage.jsx)
 * ==============================================================================
 *
 * Descripción:
 * Esta página es un componente presentacional que combina dos secciones
 * de contenido estático:
 * 1. Una sección "Sobre Nosotros" / "Nuestra Historia" con una imagen y texto.
 * 2. Una sección de "Preguntas Frecuentes" (FAQ).
 *
 * Reutilización de Componentes:
 * Esta página no reimplementa la lógica del acordeón de FAQ. En su lugar,
 * importa y renderiza el componente <FAQ /> (que ya documentamos),
 * encapsulándolo dentro de una tarjeta estilizada.
 *
 * @dependencias
 * - FAQ: El componente que contiene la lógica del acordeón de preguntas y respuestas.
 */

import React from "react";
import FAQ from "../components/FAQ"; // Reutilizamos el componente FAQ

export default function FaqPage() {
  return (
    // Contenedor principal de la página con fondo gris claro y padding.
    <div className="bg-gray-50 py-12 sm:py-16">
      {/* Contenedor centrado y con ancho máximo */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título principal de la página */}
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-900">
          Sobre Nosotros y FAQ
        </h1>

        {/* ---------------------------------- */}
        {/* 1. Sección "Nuestra Historia"      */}
        {/* ---------------------------------- */}
        {/* Es una tarjeta de contenido estático. */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          {/* Imagen de cabecera de la sección */}
          <img
            src="/images/FAQ/Tienda.webp"
            alt="Equipo de SellosPro"
            className="w-full h-64 object-cover"
          />
          {/* Contenido de texto de la sección */}
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Nuestra Historia
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Bienvenidos a Sellospro, ésta es tu tienda de confianza para
              obtener sellos de Primera calidad. Nos dedicamos a la producción,
              confección y venta de sellos de goma grabados en láser, con bases
              de madera tratadas y cortadas a medida, con mangos de madera
              cortados y personalizados para cada pedido en particular.
              <br /> Con respecto a nuestros automáticos solo trabajamos la
              línea importada de excelente calidad y durabilidad. Tenemos todas
              las medidas, modelos y colores que necesites para simplificarte la
              vida! También tenemos almohadillas de fieltro en todas las medidas
              y tintas de diferentes características para lograr sellar todo
              tipo de superficies.
              <br />
              Abarcamos la línea de numeradores y fechadores manuales y
              automáticos, con una gran variedad de modelos. Hemos ido creciendo
              como un Negocio familiar a través de los años, perfeccionando el
              arte de hacer sellos personalizados. Somos una marca registrada y
              nuestra trayectoria nos avala.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Nuestro compromiso es ofrecer productos duraderos y un servicio al
              cliente excepcional. Cada sello que fabricamos pasa por un
              riguroso control de calidad para garantizar que recibes un
              producto perfecto.
            </p>
          </div>
        </div>

        {/* ---------------------------------- */}
        {/* 2. Sección "FAQ"                 */}
        {/* ---------------------------------- */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
            Preguntas Frecuentes (FAQ)
          </h2>
          {/*
           * Aquí se reutiliza el componente FAQ.
           * Toda la lógica del acordeón (abrir/cerrar, animación)
           * está contenida dentro de <FAQ />.
           */}
          <FAQ />
        </div>
      </div>
    </div>
  );
}
