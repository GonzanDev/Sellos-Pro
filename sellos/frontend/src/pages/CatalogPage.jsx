/**
 * ==============================================================================
 * 🛍️ PÁGINA: Catálogo de Productos (CatalogPage.jsx)
 * ==============================================================================
 *
 * Descripción: Esta es la página principal que muestra el catálogo de productos.
 *
 * Responsabilidades:
 * 1. Obtiene *todos* los productos, el estado de carga y el error
 * usando el hook `useProducts()`.
 * 2. Muestra un estado de "Cargando..." o "Error..." mientras se
 * obtienen los datos.
 * 3. Permite al usuario *filtrar* los productos por categoría (`category`).
 * 4. Permite al usuario *ordenar* los productos (`sortBy`) por precio o nombre.
 * 5. Utiliza `useMemo` para recalcular eficientemente la lista de productos
 * visibles solo cuando los filtros o los productos cambian.
 * 6. Renderiza la UI de filtros de forma responsive (botones en desktop,
 * selects en móvil).
 * 7. Muestra el grid final de `ProductCard` con los productos filtrados/ordenados.
 */

import React, { useState, useMemo } from "react";
import ProductCard from "../components/ProductCard"; // Componente para cada tarjeta.
import { useCart } from "../contexts/CartContext.jsx"; // Para la función addToCart.
import { useProducts } from "../hooks/useProducts.js"; // Hook para obtener los datos.
import { ChevronDown } from "lucide-react"; // Icono para los select.

export default function CatalogPage() {
  // 1. Obtiene los datos de la API (lista completa, estado de carga, error).
  const { products, loading, error } = useProducts();
  // 2. Obtiene la función para añadir al carrito (para pasarla a ProductCard).
  const { addToCart } = useCart();

  // 3. Estados locales para controlar los filtros.
  // Estado para el criterio de ordenamiento (precio, nombre, etc.).
  const [sortBy, setSortBy] = useState("default");
  // Estado para la categoría seleccionada (ej. 'Automáticos', 'Kits', 'all').
  const [category, setCategory] = useState("all");

  /**
   * --------------------------------------------------------------------------
   * 🧠 LÓGICA MEMORIZADA: Filtrado y Ordenamiento
   * --------------------------------------------------------------------------
   * `useMemo` es una optimización de rendimiento.
   * Esta función *solo* se volverá a ejecutar si `products`, `sortBy`,
   * o `category` cambian.
   * Si el usuario solo abre/cierra el carrito, esta lista no se recalcula.
   *
   * @returns {Array<object>} La lista de productos filtrada y ordenada.
   */
  const sortedAndFilteredProducts = useMemo(() => {
    // --- PASO 1: FILTRADO POR CATEGORÍA ---
    const filtered = products.filter((p) => {
      // Si la categoría es 'all', no se filtra nada.
      if (category === "all") return true;

      // Lógica de normalización (la misma de ProductCard)
      // Asegura que `p.category` sea siempre un array de strings en minúscula.
      const productCategories = Array.isArray(p.category)
        ? p.category
        : typeof p.category === "string"
        ? [p.category]
        : [];
      const productCategoriesLower = productCategories
        .filter((c) => typeof c === "string")
        .map((c) => c.toLowerCase());

      const selectedCategoryLower = category.toLowerCase();

      // Devuelve `true` si el array de categorías del producto
      // *incluye* la categoría seleccionada.
      return productCategoriesLower.includes(selectedCategoryLower);
    });

    // --- PASO 2: ORDENAMIENTO (Sorting) ---
    // Copiamos el array filtrado para no mutar el estado original
    let processableProducts = [...filtered];

    switch (sortBy) {
      case "price-asc":
        processableProducts.sort((a, b) => a.price - b.price); // Menor a mayor precio
        break;
      case "price-desc":
        processableProducts.sort((a, b) => b.price - a.price); // Mayor a menor precio
        break;
      case "name-asc":
        // localeCompare es la forma correcta de ordenar alfabéticamente.
        processableProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // No hace nada, mantiene el orden por defecto.
        break;
    }

    // --- PASO 3: RETORNO ---
    return processableProducts;
  }, [products, sortBy, category]); // Dependencias del useMemo

  // --- Manejo de Estados de Carga y Error ---

  // Muestra un spinner o texto mientras se cargan los productos.
  if (loading) {
    return <div className="text-center py-20">Cargando productos...</div>;
  }

  // Muestra un mensaje de error si la API falló.
  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        Error al cargar productos: {error}
      </div>
    );
  }

  // --- Renderización de la Página (Éxito) ---
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ---------------------------------- */}
        {/* 🔹 Filtros (Vista para Escritorio)  */}
        {/* ---------------------------------- */}
        {/* 'hidden sm:block' -> Oculto en móvil, visible en escritorio */}
        <div className="hidden sm:block">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center sm:text-left">
            Catálogo
          </h1>

          {/* Contenedor de filtros (Botones de categoría + Selector de orden) */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            {/* Botones de Categoría */}
            <div className="flex flex-wrap gap-3">
              {[
                "all",
                "Automáticos",
                "Fechadores",
                "Numeradores",
                "Almohadillas",
                "Tintas",
                "Kits",
                "Otros",
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)} // Actualiza el estado de 'category'
                  // Estilo condicional para el botón activo (seleccionado).
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                    category === cat
                      ? "bg-black text-white border-black shadow-md" // Activo
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-100" // Inactivo
                  }`}
                >
                  {cat === "all" ? "Todas" : cat}
                </button>
              ))}
            </div>

            {/* Selector de Orden (Sort By) */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Ordenar por:
              </label>
              <div className="relative w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)} // Actualiza el estado 'sortBy'
                  className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition"
                >
                  <option value="default">Predeterminado</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="name-asc">Nombre (A-Z)</option>
                </select>
                {/* Icono de flecha (decorativo) */}
                <ChevronDown
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------- */}
        {/* 🔹 Filtros (Vista para Móvil)       */}
        {/* ---------------------------------- */}
        {/* 'block sm:hidden' -> Visible en móvil, oculto en escritorio */}
        <div className="block sm:hidden mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Catálogo
          </h1>

          {/* En móvil, ambos filtros son Selects para ahorrar espacio */}
          <div className="flex justify-between items-center gap-3">
            {/* Selector de categorías (móvil) */}
            <div className="relative flex-1">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-md py-2 pl-4 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition"
              >
                <option value="all">Categorías</option>
                <option value="Automáticos">Automáticos</option>
                <option value="Fechadores">Fechadores</option>
                <option value="Numeradores">Numeradores</option>
                <option value="Almohadillas">Almohadillas</option>
                <option value="Tintas">Tintas</option>
                <option value="Kits">Kits</option>
                <option value="Otros">Otros</option>
              </select>
              <ChevronDown
                size={18}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {/* Selector de orden (móvil) */}
            <div className="relative flex-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-md py-2 pl-4 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition"
              >
                <option value="default">Ordenar</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
                <option value="name-asc">Nombre (A-Z)</option>
              </select>
              <ChevronDown
                size={18}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* ---------------------------------- */}
        {/* 🔹 Grid de Productos (Resultados)  */}
        {/* ---------------------------------- */}
        {/* Renderizado condicional: 
            Muestra el grid si hay productos, o un mensaje si no. */}
        {sortedAndFilteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6 lg:gap-8">
            {/* Itera sobre la lista *procesada* (filtrada y ordenada) */}
            {sortedAndFilteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        ) : (
          // Mensaje si el filtro no devuelve resultados.
          <div className="text-center text-gray-500 py-20">
            No se encontraron productos para esta categoría.
          </div>
        )}
      </div>
    </div>
  );
}
