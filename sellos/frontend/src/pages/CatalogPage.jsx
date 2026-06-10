/**
 * ==============================================================================
 * 🛍️ PÁGINA: Catálogo de Productos (CatalogPage.jsx)
 * ==============================================================================
 *
 * ... (comentarios de descripción sin cambios)
 */

// --- Importamos 'useEffect' y 'useSearchParams' ---
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // Hook para leer/escribir en la URL
import ProductCard from "../components/ProductCard"; // Componente para cada tarjeta.
import { useCart } from "../contexts/CartContext.jsx"; // Para la función addToCart.
import { useProducts } from "../hooks/useProducts.js"; // Hook para obtener los datos.
import { ChevronDown } from "lucide-react"; // Icono para los select.

export default function CatalogPage() {
  // 1. Obtiene los datos de la API
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();

  // 2. Lógica para leer y escribir en la URL
  const [searchParams, setSearchParams] = useSearchParams();

  // 3. El estado se deriva directamente de la URL
  const category = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sort") || "default";
  const searchTerm = searchParams.get("search") || ""; // Leemos el término de búsqueda del Header

  // --- ¡NUEVO! Log de depuración ---
  // Este useEffect se ejecutará cada vez que la URL cambie (y por lo tanto,
  // cambien 'category', 'sortBy' o 'searchTerm').
  // Esto nos permitirá ver en la consola si los valores se están actualizando.
  useEffect(() => {
    console.log("Valores de filtro actualizados:", {
      category,
      sortBy,
      searchTerm,
    });
  }, [category, sortBy, searchTerm]); // Depende de los valores que leemos de la URL

  /**
   * --------------------------------------------------------------------------
   * 🧠 LÓGICA MEMORIZADA: Filtrado y Ordenamiento
   * --------------------------------------------------------------------------
   */
  const sortedAndFilteredProducts = useMemo(() => {
    // --- PASO 1: FILTRADO POR BÚSQUEDA (Search Term) ---
    const searched = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- PASO 2: FILTRADO POR CATEGORÍA ---
    const filtered = searched.filter((p) => {
      if (category === "all") return true;

      // Lógica de normalización
      const productCategories = Array.isArray(p.category)
        ? p.category
        : typeof p.category === "string"
        ? [p.category]
        : [];
      const productCategoriesLower = productCategories
        .filter((c) => typeof c === "string")
        .map((c) => c.toLowerCase());

      const selectedCategoryLower = category.toLowerCase();

      return productCategoriesLower.includes(selectedCategoryLower);
    });

    // --- PASO 3: ORDENAMIENTO (Sorting) ---
    let processableProducts = [...filtered];

    switch (sortBy) {
      case "price-asc":
        processableProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        processableProducts.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        processableProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return processableProducts;
  }, [products, sortBy, category, searchTerm]); // Dependencias actualizadas

  // --- Handlers para actualizar la URL ---

  const handleCategoryChange = (newCategory) => {
    const newParams = new URLSearchParams(searchParams);
    if (newCategory === "all") {
      newParams.delete("category"); // Limpia la URL si es 'all'
    } else {
      newParams.set("category", newCategory);
    }
    setSearchParams(newParams, { replace: true }); // 'replace' evita añadir al historial
  };

  const handleSortByChange = (newSortBy) => {
    const newParams = new URLSearchParams(searchParams);
    if (newSortBy === "default") {
      newParams.delete("sort"); // Limpia la URL si es 'default'
    } else {
      newParams.set("sort", newSortBy);
    }
    setSearchParams(newParams, { replace: true });
  };

  // --- Manejo de Estados de Carga y Error ---
  if (loading) {
    return <div className="text-center py-20">Cargando productos...</div>;
  }
  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        Error al cargar productos: {error}
      </div>
    );
  }

  // --- Renderización de la Página ---
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ---------------------------------- */}
        {/* 🔹 Filtros (Vista para Escritorio)  */}
        {/* ---------------------------------- */}
        <div className="hidden sm:block">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center sm:text-left">
            Catálogo
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
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
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                    category === cat
                      ? "bg-black text-white border-black shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-100"
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
                  onChange={(e) => handleSortByChange(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition"
                >
                  <option value="default">Predeterminado</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="name-asc">Nombre (A-Z)</option>
                </select>
                <ChevronDown
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------- */}
        {/* 🔹 Filtros (Vista para Móvil)       */}
        {/* ---------------------------------- */}
        <div className="block sm:hidden mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Catálogo
          </h1>

          <div className="flex justify-between items-center gap-3">
            {/* Selector de categorías (móvil) */}
            <div className="relative flex-1">
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
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
                onChange={(e) => handleSortByChange(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-md py-2 pl-4 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition"
              >
                {/* --- CORRECCIÓN DE TYPO: </Goption> a </option> --- */}
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
        {/* 🔹 Grid de Productos (Resultados)  */}
        {/* ---------------------------------- */}
        {sortedAndFilteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6 lg:gap-8">
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
            {searchTerm ? (
              <span>
                No se encontraron productos para "<strong>{searchTerm}</strong>
                ".
              </span>
            ) : (
              <span>No se encontraron productos para esta categoría.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
