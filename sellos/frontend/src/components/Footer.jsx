import React from "react";
import { Phone, Mail, Instagram, Facebook, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 mt-8">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Columna 1: Logo y descripción */}
        <div>
          <h2 className="text-2xl font-bold text-red-600">SellosPro</h2>
          <p className="mt-3 text-sm text-gray-400">
            Sellos personalizados de alta calidad. Diseñados para tu negocio o
            emprendimiento, con envíos a todo el país.
          </p>
        </div>

        {/* Columna 2: Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Enlaces</h3>
          <ul className="space-y-2">
            <li>
              <a href="#hero" className="hover:text-red-500">
                Inicio
              </a>
            </li>
            <li>
              <a href="/catalog" className="hover:text-red-500">
                Catálogo
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-red-500">
                FAQ
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-red-500">
                Contacto
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 3: Contacto */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 ">Contacto</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MessageCircle size={16} className="text-red-500" />
              <a
                href="https://wa.me/5492235551071"
                target="_blank"
                rel="noopener noreferrer"
                className="relative after:bg-white after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:h-px after:transition-all after:duration-300 cursor-pointer"
              >
                +54 9 223 555 1071 (Solo WhatsApp)
              </a>
            </li>

            <li className="flex items-center gap-2">
              <Mail size={16} className="text-red-500" /> contacto@sellospro.com
            </li>
            <li className="flex items-center gap-2">
              <Instagram size={16} className="text-red-500" />
              <a
                href="https://www.instagram.com/sellospro"
                target="_blank"
                rel="noopener noreferrer"
                className="relative after:bg-white after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:h-px after:transition-all after:duration-300 cursor-pointer"
              >
                @sellospro
              </a>
            </li>

            <li className="flex items-center gap-2">
              <Facebook size={16} className="text-red-500" />
              <a
                href="https://www.facebook.com/sellospro"
                target="_blank"
                rel="noopener noreferrer"
                className="relative after:bg-white after:absolute after:h-1 after:w-0 after:bottom-0 after:left-0 hover:after:w-full after:h-px after:transition-all after:duration-300 cursor-pointer"
              >
                /sellospro
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Encontranos en
          </h3>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="Mapa de ubicación"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3142.162375726262!2d-57.5470841!3d-38.0433027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584dddc18595d0b%3A0xc065f0573a4604f0!2sSellospro%20Sellos%20desde%201980!5e0!3m2!1ses-419!2sar!4v1758299762397!5m2!1ses-419!2sar"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SellosPro — Todos los derechos reservados.
      </div>
    </footer>
  );
}
