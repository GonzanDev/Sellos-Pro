/**
 * ==============================================================================
 * 📞 PÁGINA: Contacto (ContactPage.jsx)
 * ==============================================================================
 *
 * Descripción: Esta es la página principal de "Contacto" del sitio.
 *
 * Estructura:
 * Es un componente "presentacional" que organiza la página en un layout
 * responsive de 2 columnas:
 * 1. Columna Izquierda: Contiene el componente interactivo <ContactForm />.
 * 2. Columna Derecha: Muestra la información de contacto estática
 * (dirección, teléfono, email, horario) con íconos.
 *
 * Dependencias:
 * - ContactForm: El componente que contiene la lógica del formulario de contacto (que redirige a WhatsApp).
 * - lucide-react: Para los íconos (MapPin, Phone, Mail, Clock).
 */
import React from "react";
import ContactForm from "../components/ContactForm"; // Importa el formulario interactivo.
import { MapPin, Phone, Mail, Clock } from "lucide-react"; // Iconos para la info.

export default function ContactPage() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Título de la Página */}
        <h1 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Contáctanos
        </h1>

        {/* Layout de 2 Columnas:
            - 1 columna en móvil (grid-cols-1)
            - 2 columnas en desktop (md:grid-cols-2)
         */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* --------------------------- */}
          {/* Columna 1: Formulario       */}
          {/* --------------------------- */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Envíanos un Mensaje
            </h2>
            {/*
             * Aquí se renderiza el componente del formulario.
             * Toda la lógica (estado, handlers, envío a WhatsApp)
             * está encapsulada dentro de <ContactForm />.
             */}
            <ContactForm />
          </div>

          {/* --------------------------------- */}
          {/* Columna 2: Información Estática   */}
          {/* --------------------------------- */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Información de Contacto
            </h2>
            {/* Lista de datos de contacto */}
            <div className="space-y-6 text-gray-600">
              {/* Item: Dirección */}
              <div className="flex items-start gap-4">
                <MapPin size={24} className="text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Dirección</h3>
                  <p>Bermejo 477, Mar del Plata</p>
                </div>
              </div>
              {/* Item: Teléfono (WhatsApp) */}
              <div className="flex items-start gap-4">
                <Phone size={24} className="text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Teléfono</h3>
                  <p>+54 9 223 555-1071 (Solo WhatsApp)</p>
                </div>
              </div>
              {/* Item: Email */}
              <div className="flex items-start gap-4">
                <Mail size={24} className="text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Correo Electrónico
                  </h3>
                  <p>sellospro@gmail.com</p>
                </div>
              </div>
              {/* Item: Horario */}
              <div className="flex items-start gap-4">
                <Clock size={24} className="text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Horario</h3>
                  <p>Lunes a Viernes: 10:00 - 15:00 hs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
