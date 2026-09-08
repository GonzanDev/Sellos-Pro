/**
 * ==============================================================================
 * 🛍️ PÁGINA: Catálogo de Productos (CatalogPage.jsx)
 * ==============================================================================
 *
 * Lista de productos con filtro por categoría, orden y búsqueda (todo en la URL).
 * Los estados de carga/error/vacío quedan contenidos en la zona de resultados,
 * para no bloquear el encabezado ni los filtros.
 */

import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom"; // Estado de filtros en la URL
import { ChevronDown, RefreshCw, X } from "lucide-react"; // Íconos
import ProductCard from "../components/ProductCard"; // Tarjeta de producto
import { useProducts } from "../hooks/useProducts.js"; // Datos de la API

// Canal humano de respaldo para el estado de error.
const WHATSAPP_URL =
  "https://wa.me/5492235551071?text=" +
  encodeURIComponent("Hola! Tuve un problema para ver el catálogo en la web.");

// Orden preferido de categorías; cualquiera que aparezca en los datos y no
// esté acá se agrega al final (ninguna categoría queda inaccesible).
const CATEGORY_ORDER = [
  "Automáticos",
  "Fechadores",
  "Numeradores",
  "Portátiles",
  "Almohadillas",
  "Tintas",
  "Escolar",
  "Kits",
  "KitEmpanadas",
  "Otros",
];

/** Placeholder animado mientras cargan los productos (no bloquea el chrome). */
function CatalogSkeleton() {
  return (
    <>
      <p role="status" className="sr-only">
        Cargando productos…
      </p>
      <div
        className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6 lg:gap-8"
        aria-hidden="true"
      >
        {Array.from({ length: 8 }).map((_, i) => (
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

/** Estado de error: no reemplaza la página, ofrece reintentar y un canal humano. */
function CatalogError({ onRetry }) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-md text-center bg-white border border-gray-200 rounded-lg p-8"
    >
      <p className="text-base font-semibold text-gray-800">
        No pudimos cargar el catálogo
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

export default function CatalogPage() {
  // 1. Datos de la API (con refetch para reintentar sin recargar la SPA).
  const { products, loading, error, refetch } = useProducts();

  // 2. Estado de filtros derivado de la URL.
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sort") || "default";
  const searchTerm = searchParams.get("search") || "";

  // 3. Categorías derivadas de los productos reales (desktop y móvil comparten
  //    esta lista, así ninguna categoría queda fuera de los filtros).
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      const cats = Array.isArray(p.category)
        ? p.category
        : typeof p.category === "string"
        ? p.category.split(",")
        : [];
      cats.forEach((c) => {
        const t = String(c).trim();
        if (t) set.add(t);
      });
    });
    const found = [...set];
    const ordered = CATEGORY_ORDER.filter((c) => found.includes(c));
    const extras = found
      .filter((c) => !CATEGORY_ORDER.includes(c))
      .sort((a, b) => a.localeCompare(b));
    return ["all", ...ordered, ...extras];
  }, [products]);

  // 4. Filtrado + orden (memoizado).
  const sortedAndFilteredProducts = useMemo(() => {
    const searched = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filtered = searched.filter((p) => {
      if (category === "all") return true;
      const productCategories = Array.isArray(p.category)
        ? p.category
        : typeof p.category === "string"
        ? [p.category]
        : [];
      const productCategoriesLower = productCategories
        .filter((c) => typeof c === "string")
        .map((c) => c.toLowerCase());
      return productCategoriesLower.includes(category.toLowerCase());
    });

    const processableProducts = [...filtered];
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
  }, [products, sortBy, category, searchTerm]);

  // --- Handlers de URL ---
  const handleCategoryChange = (newCategory) => {
    const newParams = new URLSearchParams(searchParams);
    if (newCategory === "all") newParams.delete("category");
    else newParams.set("category", newCategory);
    setSearchParams(newParams, { replace: true });
  };

  const handleSortByChange = (newSortBy) => {
    const newParams = new URLSearchParams(searchParams);
    if (newSortBy === "default") newParams.delete("sort");
    else newParams.set("sort", newSortBy);
    setSearchParams(newParams, { replace: true });
  };

  const clearSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");
    setSearchParams(newParams, { replace: true });
  };

  const resetAll = () => setSearchParams(new URLSearchParams(), { replace: true });

  const count = sortedAndFilteredProducts.length;
  const ready = !loading && !error;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Título único (estable en ambos breakpoints) */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center sm:text-left">
          Catálogo
        </h1>

        {/* --- Filtros (Escritorio) --- */}
        <div className="hidden sm:block">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div
              role="group"
              aria-label="Filtrar por categoría"
              className="flex flex-wrap gap-3"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  aria-pressed={category === cat}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    category === cat
                      ? "bg-black text-white border-black shadow-md focus-visible:outline-black"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-100 focus-visible:outline-gray-800"
                  }`}
                >
                  {cat === "all" ? "Todas" : cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="catalog-sort"
                className="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                Ordenar por:
              </label>
              <div className="relative w-48">
                <select
                  id="catalog-sort"
                  value={sortBy}
                  onChange={(e) => handleSortByChange(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 transition"
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

        {/* --- Filtros (Móvil) --- */}
        <div className="block sm:hidden mb-6">
          <div className="flex justify-between items-center gap-3">
            <div className="relative flex-1">
              <label htmlFor="catalog-category-mobile" className="sr-only">
                Categoría
              </label>
              <select
                id="catalog-category-mobile"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-md py-2 pl-4 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 transition"
              >
                <option value="all">Categorías</option>
                {categories
                  .filter((c) => c !== "all")
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
              <ChevronDown
                size={18}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            <div className="relative flex-1">
              <label htmlFor="catalog-sort-mobile" className="sr-only">
                Ordenar
              </label>
              <select
                id="catalog-sort-mobile"
                value={sortBy}
                onChange={(e) => handleSortByChange(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-md py-2 pl-4 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 transition"
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

        {/* --- Barra de estado: búsqueda activa + conteo (anunciada a AT) --- */}
        {ready && (
          <div
            className="flex flex-wrap items-center gap-3 mb-6 min-h-[2rem]"
            aria-live="polite"
          >
            {searchTerm && (
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-300 pl-3 pr-2 py-1 text-sm text-gray-700">
                Resultados para “{searchTerm}”
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Quitar búsqueda"
                  className="grid place-items-center w-5 h-5 rounded-full text-gray-500 hover:text-[#e30613] hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e30613] transition-colors"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </span>
            )}
            <span className="text-sm text-gray-500">
              {count} {count === 1 ? "producto" : "productos"}
            </span>
          </div>
        )}

        {/* --- Resultados: carga / error / grilla / vacío --- */}
        {loading ? (
          <CatalogSkeleton />
        ) : error ? (
          <CatalogError onRetry={refetch} />
        ) : count > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6 lg:gap-8">
            {sortedAndFilteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">
            {searchTerm ? (
              <p>
                No se encontraron productos para "<strong>{searchTerm}</strong>".
              </p>
            ) : (
              <p>No se encontraron productos para esta categoría.</p>
            )}
            <button
              type="button"
              onClick={resetAll}
              className="mt-5 inline-block px-6 py-3 bg-white text-gray-800 rounded-md border border-gray-300 hover:bg-gray-100 transition font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
            >
              Ver todo el catálogo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
