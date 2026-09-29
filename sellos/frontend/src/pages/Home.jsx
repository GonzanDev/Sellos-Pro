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
 * 6. Proveer un "manejador" (handler) personalizado para `addToCart` que,
 * además de agregar al carrito, dispara una notificación "toast" (cuya
 * función `showToast` se recibe por props).
 * 7. Mostrar un botón para navegar a la página de catálogo completa.
 */

import React from "react";
import { Link } from "react-router-dom"; // Para el botón "Ver todo el catálogo"
import Hero from "../components/Hero"; // El carrusel principal
import CatalogPreview from "../components/CatalogPreview"; // El grid de productos
import { useProducts } from "../hooks/useProducts"; // Hook para obtener productos
import { useCart } from "../contexts/CartContext"; // Hook para el carrito
// Helper para filtrar la lista de productos
import { getProductsByIds } from "../../../backend/utils/utils"; // (Nota: Importando desde la carpeta 'backend')

// IDs de los productos a mostrar en la sección "Los Más Vendidos"
const selectedIds = [1, 100, 102, 20];

/**
 * @param {object} props
 * @param {function} props.showToast - Función (callback) recibida del
 * componente padre (ej. App.jsx) para mostrar una notificación.
 */
export default function Home({ showToast }) {
  // --- 1. HOOKS ---
  // Obtiene la lista COMPLETA de productos, y los estados de carga/error.
  const { products, loading, error } = useProducts();
  // Obtiene la función `addToCart` del contexto del carrito.
  const { addToCart } = useCart();

  /**
   * --------------------------------------------------------------------------
   * MANEJADOR: `handleAddToCart` (con Notificación)
   * --------------------------------------------------------------------------
   * Esta es una función "wrapper" (envoltorio).
   * Se pasa al <CatalogPreview /> en lugar del `addToCart` original.
   *
   * @param {object} product - El producto que se va a agregar.
   */
  const handleAddToCart = (product) => {
    // 1. Llama a la función original del contexto para agregar el producto.
    addToCart(product);
    // 2. Llama a la función (recibida por props) para mostrar la notificación.
    showToast(`${product.name} agregado al carrito`);
  };

  // --- 2. LÓGICA DE NEGOCIO: FILTRADO DE PRODUCTOS ---
  // Solo tiene sentido una vez que los productos se cargaron (loading=false
  // y error=null); en cualquier otro caso queda vacío.
  const previewProducts =
    !loading && !error ? getProductsByIds(products, selectedIds) : [];

  // --- 3. RENDERIZACIÓN ---
  // El <Hero /> no depende de los productos, así que se renderiza siempre de
  // entrada: bloquearlo detrás del fetch de /api/products retrasaba el LCP
  // (el carrusel esperaba a que el backend responda antes de pintar nada).
  return (
    <div>
      {/* 1. Renderiza el carrusel principal */}
      <Hero />

      {/* 2. Sección "Los Más Vendidos" */}
      <section className="py-12 sm:py-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">
              Los Más Vendidos
            </h2>
          </div>

          {loading && (
            <div className="text-center py-20">Cargando productos...</div>
          )}
          {error && !loading && (
            <div className="text-center py-20 text-red-600">
              Error al cargar los productos.
            </div>
          )}

          {/* 3. Renderiza el grid (vista previa) de productos */}
          {!loading && !error && (
            <CatalogPreview
              // Le pasamos la lista *filtrada* de productos.
              products={previewProducts}
              // Le pasamos nuestro handler *personalizado* (el que muestra el toast).
              addToCart={handleAddToCart}
            />
          )}

          {/* 4. Botón para ver el catálogo completo */}
          <div className="text-center mt-16">
            <Link
              to="/catalog"
              className="inline-block px-8 py-3 bg-white text-gray-800 rounded-md border border-gray-300 hover:bg-gray-100 transition font-semibold"
            >
              Ver todo el catálogo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
