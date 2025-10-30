import React, { useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../contexts/CartContext.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { ChevronDown } from "lucide-react";

export default function CatalogPage() {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();

  const [sortBy, setSortBy] = useState("default");
  const [category, setCategory] = useState("all");

  const sortedAndFilteredProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      if (category === "all") return true;
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
  }, [products, sortBy, category]);

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 🔹 Vista para escritorio */}
        <div className="hidden sm:block">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center sm:text-left">
            Catálogo
          </h1>

          {/* Categorías + Ordenar por */}
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
                  onClick={() => setCategory(cat)}
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

            {/* Selector de orden a la derecha */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Ordenar por:
              </label>
              <div className="relative w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
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

        {/* 🔹 Vista para móvil */}
        <div className="block sm:hidden mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Catálogo
          </h1>

          {/* Filtros sin recuadro, uno al lado del otro */}
          <div className="flex justify-between items-center gap-3">
            {/* Selector de categorías */}
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

            {/* Selector de orden */}
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

        {/* 🔹 Catálogo */}
        {sortedAndFilteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6 lg:gap-8">
            {sortedAndFilteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">
            No se encontraron productos para esta categoría.
          </div>
        )}
      </div>
    </div>
  );
}
