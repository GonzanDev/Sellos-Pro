/**
 * ==============================================================================
 * 🏠 PÁGINA: Inicio (Home.jsx)
 * ==============================================================================
 *
 * Descripción:
 * Esta es la página de inicio o "landing page" principal de la aplicación.
 *
 * Responsabilidades:
 * 1. Renderizar el componente <Hero /> (el carrusel principal).
 * 2. Obtener *todos* los productos de la API usando el hook `useProducts()`.
 * 3. Manejar los estados de "Cargando" y "Error" de la obtención de datos.
 * 4. Filtrar la lista completa de productos para obtener una selección de
 * "Los Más Vendidos" (basado en una lista de `selectedIds` hardcodeada).
 * 5. Renderizar un <CatalogPreview /> con esa lista filtrada.
 * 6. Mostrar un botón para navegar a la página de catálogo completa.
 */

import React from "react";
import { Link } from "react-router-dom"; // Para el botón "Ver todo el catálogo"
import { RefreshCw } from "lucide-react"; // Ícono del botón "Reintentar"
import Hero from "../components/Hero"; // El carrusel principal
import CatalogPreview from "../components/CatalogPreview"; // El grid de productos
import { useProducts } from "../hooks/useProducts"; // Hook para obtener productos
// Helper para filtrar la lista de productos
import { getProductsByIds } from "../../../backend/utils/utils"; // (Nota: Importando desde la carpeta 'backend')

// IDs de los productos a mostrar en la sección "Los Más Vendidos"
const selectedIds = [1, 100, 102, 20];

// Canal de contacto para el fallback del estado de error.
const WHATSAPP_URL =
  "https://wa.me/5492235551071?text=" +
  encodeURIComponent(
    "Hola! Tuve un problema para ver los productos en la web."
  );

/**
 * Placeholder animado que reserva el espacio del grid mientras cargan los
 * productos. Refleja el layout real de <ProductCard> para evitar saltos.
 */
function PreviewSkeleton() {
  return (
    <>
      <p role="status" className="sr-only">
        Cargando productos…
      </p>
      <div
        className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
        aria-hidden="true"
      >
        {Array.from({ length: selectedIds.length }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <div className="aspect-square w-full bg-gray-100 animate-pulse" />
            <div className="p-4 space-y-3 border-t border-gray-100">
              <div className="h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
              <div className="h-5 w-1/2 rounded bg-gray-100 animate-pulse" />
              <div className="h-9 w-full rounded-lg bg-gray-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/**
 * Estado vacío: si la selección de destacados no devuelve productos (p. ej.
 * los IDs quedaron desactualizados), en vez de un grid en blanco mostramos un
 * mensaje breve que reencamina al catálogo completo.
 */
function PreviewEmpty() {
  return (
    <div className="mx-auto max-w-md text-center">
      <p className="text-base font-semibold text-gray-800">
        Estamos preparando nuestra selección
      </p>
      <p className="mt-1 text-sm text-gray-600">
        Mientras tanto, explorá todo el catálogo y encontrá el sello que
        necesitás.
      </p>
    </div>
  );
}

/**
 * Estado de error de la sección: no reemplaza la página, ofrece reintentar
 * (sin recargar la SPA) y un canal humano de respaldo por WhatsApp.
 */
function PreviewError({ onRetry }) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-md text-center bg-white border border-gray-200 rounded-lg p-8"
    >
      <p className="text-base font-semibold text-gray-800">
        No pudimos cargar los productos
      </p>
      <p className="mt-1 text-sm text-gray-600">
        Revisá tu conexión e intentá de nuevo. Si el problema continúa,
        escribinos y te ayudamos.
      </p>
      <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#e30613] text-white font-semibold rounded-lg hover:bg-[#b91c1c] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e30613]"
        >
          <RefreshCw size={16} aria-hidden="true" />
          Reintentar
        </button>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-800 border border-gray-300 font-semibold rounded-lg hover:bg-gray-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
        >
          Escribinos por WhatsApp
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  // --- 1. HOOKS ---
  // Obtiene la lista COMPLETA de productos, los estados de carga/error y refetch.
  const { products, loading, error, refetch } = useProducts();

  // --- 2. LÓGICA DE NEGOCIO: FILTRADO DE PRODUCTOS ---
  // Solo filtramos cuando hay datos disponibles (ni cargando ni en error).
  const previewProducts =
    loading || error ? [] : getProductsByIds(products, selectedIds);

  // --- 3. RENDERIZACIÓN ---
  // El Hero y la estructura de la página se muestran SIEMPRE. Los estados de
  // carga y error quedan contenidos en la sección de productos, para no
  // bloquear la primera impresión ni ocultar el resto de la página.
  return (
    <div>
      {/* 1. Renderiza el carrusel principal */}
      <Hero />

      {/* 2. Franja de identidad: quiénes somos, en la primera pantalla.
          Aterriza la propuesta (fabricante local desde 1980, personalización
          online) apenas debajo del Hero. Solo afirmaciones reales. */}
      <section
        aria-labelledby="home-about-title"
        className="border-b border-gray-200 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <h2
            id="home-about-title"
            className="max-w-xl text-2xl sm:text-3xl font-semibold leading-tight text-gray-800 text-balance"
          >
            Sellos personalizados, fabricados en Mar del Plata{" "}
            <span className="font-bold text-[#e30613]">desde 1980</span>.
          </h2>
          <p className="mt-6 max-w-[60ch] text-base sm:text-lg font-normal leading-[1.75] text-gray-600">
            Diseñá tu sello automático, fechador o numerador en la web —elegí
            texto, tipografía y color— y compralo online. ¿Necesitás un sello
            con tu logo? Pedí tu presupuesto y lo hacemos a medida.
          </p>
          <ul className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
            <li>Fabricantes en Mar del Plata</li>
            <li className="flex items-center before:mr-4 before:block before:h-3.5 before:w-px before:bg-gray-300">
              Diseño y compra 100% online
            </li>
            <li className="flex items-center before:mr-4 before:block before:h-3.5 before:w-px before:bg-gray-300">
              Sellos con tu logo, a medida
            </li>
          </ul>
        </div>
      </section>

      {/* 3. Sección "Los Más Vendidos" */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Los Más Vendidos
            </h2>
          </div>

          {/* 3. Estado de la sección: cargando / error / grid de productos */}
          {loading ? (
            <PreviewSkeleton />
          ) : error ? (
            <PreviewError onRetry={refetch} />
          ) : previewProducts.length === 0 ? (
            <PreviewEmpty />
          ) : (
            <CatalogPreview
              // Le pasamos la lista *filtrada* de productos.
              products={previewProducts}
            />
          )}

          {/* 4. Botón para ver el catálogo completo */}
          <div className="text-center mt-16">
            <Link
              to="/catalog"
              className="inline-block px-8 py-3 bg-white text-gray-800 rounded-md border border-gray-300 hover:bg-gray-100 transition font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
            >
              Ver todo el catálogo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
