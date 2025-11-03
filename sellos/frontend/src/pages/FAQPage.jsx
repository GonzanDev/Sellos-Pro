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
            src="/images/FAQ/Tienda.jpg"
            alt="Equipo de SellosPro"
            className="w-full h-64 object-cover"
          />
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Nuestra Historia
            </h2>
            <p className="text-gray-600 leading-relaxed">
            Bienvenidos a Sellospro, ésta es tu tienda de confianza para obtener sellos de Primera calidad. 
            Nos dedicamos a la producción, confección y venta de sellos de goma grabados en láser, con bases de madera tratadas y cortadas a medida, con mangos de madera cortados y personalizados para cada pedido en particular.
            <br /> Con respecto a nuestros automáticos solo trabajamos la línea importada de excelente calidad y durabilidad.  Tenemos todas las medidas, modelos y colores que necesites para simplificarte la vida! 
            También tenemos almohadillas de fieltro en todas las medidas y tintas de diferentes características para lograr sellar todo tipo de superficies. 
            <br />Abarcamos la línea de numeradores y fechadores manuales y automáticos, con una gran variedad de modelos.
            Hemos ido creciendo como un Negocio familiar a través de los años, perfeccionando el arte de hacer sellos personalizados.
            Somos una marca registrada y nuestra trayectoria nos avala. 
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
