/**
 * ==============================================================================
 * 👣 COMPONENTE: Pie de Página (Footer.jsx)
 * ==============================================================================
 *
 * Descripción: Renderiza el pie de página principal del sitio web.
 * Es un componente presentacional (stateless) que no maneja lógica,
 * solo muestra información y enlaces.
 *
 * Estructura:
 * - Un grid responsive (1 columna en móvil, 4 en desktop).
 * - Columna 1: Logo e información de contacto/horarios.
 * - Columna 2: Enlaces de navegación interna (usa <Link>).
 * - Columna 3: Enlaces a redes sociales y WhatsApp (usa <a>).
 * - Columna 4: Mapa de ubicación (iframe).
 * - Barra de Copyright: Con el año dinámico.
 *
 * Dependencias:
 * - react-router-dom: Para la navegación interna (Inicio, Catálogo, etc.).
 * - lucide-react: Iconos para enlaces sociales y de contacto.
 */
import React from "react";
import { Link } from "react-router-dom"; // Para la navegación interna
import { Mail, Instagram, Facebook, MessageCircle } from "lucide-react"; // Iconos

export default function Footer() {
  return (
    // 'mt-16': Añade un margen superior grande para separarlo del contenido de la página.
    <footer className="bg-white text-gray-700 border-t border-gray-200 mt-16">
      {/* Contenedor principal: grid asimétrico de 12 columnas en desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* === Marca y datos === */}

        <div className="md:col-span-4">
          <h2 className="text-2xl font-bold text-[#e30613]">Sellospro®</h2>
          <p className="mt-3 text-sm text-gray-500">
            Lunes a Viernes de 10 a 15hs.
            <br />
            Bermejo 477, Mar del Plata. <br />
          </p>
        </div>


        {/* === Enlaces Rápidos === */}
        <div className="md:col-span-2">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Enlaces Rápidos
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-[#e30613] transition">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/catalog" className="hover:text-[#e30613] transition">
                Catálogo
              </Link>
            </li>
            <li>
              <Link to="/nosotros" className="hover:text-[#e30613] transition">
                Nosotros
              </Link>
            </li>
            <li>
              <Link to="/contacto" className="hover:text-[#e30613] transition">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* === Síguenos y Contacto === */}
        <div className="md:col-span-2">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Síguenos</h3>
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/sellospro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#e30613] transition"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://www.facebook.com/sellospro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-[#e30613] transition"
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
            className="flex items-center gap-2 text-gray-500 hover:text-[#e30613] transition"
          >
            <MessageCircle size={18} />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* === Mapa === */}
        <div className="md:col-span-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Encontranos
          </h3>
          <div className="rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <iframe
              title="Mapa de ubicación"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3142.162375726262!2d-57.5470841!3d-38.0433027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584dddc18595d0b%3A0xc065f0573a4604f0!2sSellospro%20Sellos%20desde%201980!5e0!3m2!1ses-419!2sar!4v1758299762397!5m2!1ses-419!2sar"
              width="100%"
              height="180"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* === Barra de Copyright === */}
      <div className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Sellospro — Todos los derechos reservados.
      </div>
    </footer>
  );
}
