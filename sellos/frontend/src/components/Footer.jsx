import React from "react";
import { Link } from "react-router-dom";
import { Mail, Instagram, Facebook, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Columna 1: Logo y descripción */}
        <div>
          <h2 className="text-2xl font-bold text-red-600">Sellospro</h2>
          <p className="mt-3 text-sm text-gray-500">
            Lunes a Viernes de 10 a 15hs.
            <br />
            Bermejo 477, Mar del Plata. <br />
          </p>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Enlaces Rápidos
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-red-600 transition">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/catalog" className="hover:text-red-600 transition">
                Catálogo
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-red-600 transition">
                Nosotros
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-red-600 transition">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Síguenos y Contacto */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Síguenos
          </h3>
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/sellospro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-red-600 transition"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://www.facebook.com/sellospro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-red-600 transition"
            >
              <Facebook size={24} />
            </a>
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-4 mt-6">
            Contacto
          </h3>
          <a
            href="https://wa.me/5492235551071"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition"
          >
            <MessageCircle size={18} />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Columna 4: Mapa */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Encontranos
          </h3>
          <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <iframe
              title="Mapa de ubicación"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3142.162375726262!2d-57.5470841!3d-38.0433027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584dddc18595d0b%3A0xc065f0573a4604f0!2sSellospro%20Sellos%20desde%201980!5e0!3m2!1ses-419!2sar!4v1758299762397!5m2!1ses-419!2sar"
              width="100%"
              height="150"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SellosPro — Todos los derechos reservados.
      </div>
    </footer>
  );
}
