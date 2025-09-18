import React from "react";
import { Phone, Mail, Instagram, Facebook, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 mt-8">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
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
          <h3 className="text-lg font-semibold text-white mb-3">Contacto</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
  <MessageCircle size={16} className="text-red-500" /> 
  <a href="https://wa.me/5492235551071" target="_blank" rel="noopener noreferrer" className="hover:underline">
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
                className="hover:underline"
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
              className="hover:underline"
            >
              /sellospro
            </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SellosPro — Todos los derechos reservados.
      </div>
    </footer>
  );
}
