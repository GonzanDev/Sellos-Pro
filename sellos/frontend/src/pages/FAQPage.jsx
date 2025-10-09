import React from "react";
import FAQ from "../components/FAQ"; // Reutilizamos y estilizamos el componente

export default function FaqPage() {
  return (
    <div className="bg-gray-50 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-900">
          Sobre Nosotros y FAQ
        </h1>

        {/* Sección "Nuestra Historia" */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <img
            // Reemplaza esta imagen por la tuya
            src="https://placehold.co/1200x400/eeeeee/777777?text=Nuestra+Tienda"
            alt="Equipo de SellosPro"
            className="w-full h-64 object-cover"
          />
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Nuestra Historia
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Bienvenidos a Sellospro, tu tienda de confianza para sellos de
              alta calidad. Fundada en 2001, nuestra pasión por la precisión y
              el detalle nos ha convertido en líderes del mercado. Empezamos
              como un pequeño negocio familiar y hemos crecido hasta
              convertirnos en un referente para profesionales y entusiastas.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Nuestro compromiso es ofrecer productos duraderos y un servicio al
              cliente excepcional. Cada sello que fabricamos pasa por un
              riguroso control de calidad para garantizar que recibes un
              producto perfecto.
            </p>
          </div>
        </div>

        {/* Sección FAQ */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
            Preguntas Frecuentes (FAQ)
          </h2>
          <FAQ />
        </div>
      </div>
    </div>
  );
}
