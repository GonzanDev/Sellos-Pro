import React from "react";
import ContactForm from "../components/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Contáctanos
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Columna del Formulario */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Envíanos un Mensaje
            </h2>
            <ContactForm />
          </div>

          {/* Columna de Información de Contacto */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Información de Contacto
            </h2>
            <div className="space-y-6 text-gray-600">
              <div className="flex items-start gap-4">
                <MapPin size={24} className="text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Dirección</h3>
                  <p>Bermejo 477, Mar del Plata</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone size={24} className="text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Teléfono</h3>
                  <p>+54 9 223 555-1071 (Solo WhatsApp)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail size={24} className="text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Correo Electrónico
                  </h3>
                  <p>sellospro@gmail.com</p>
                </div>
              </div>
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
