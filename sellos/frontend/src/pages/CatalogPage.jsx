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
    // --- ✅ INICIO DE LA CORRECCIÓN ---
    const filtered = products.filter((p) => {
      // 1. Si la categoría es "all", mostrar todo
      if (category === "all") return true;

      // 2. Estandarizar p.category para que SIEMPRE sea un array
      // (Maneja si es un array, un string, o undefined/null)
      const productCategories = Array.isArray(p.category)
        ? p.category
        : typeof p.category === "string"
        ? [p.category]
        : [];

      // 3. Convertir todo a minúsculas para una comparación segura
      const productCategoriesLower = productCategories
        .filter(c => typeof c === 'string') // Filtra por si hay nulls en el array
        .map(c => c.toLowerCase());
      
      const selectedCategoryLower = category.toLowerCase();

      // 4. Comprobar si el array de categorías del producto INCLUYE la categoría seleccionada
      return productCategoriesLower.includes(selectedCategoryLower);
    });
    // --- ✅ FIN DE LA CORRECCIÓN ---

    // El resto de tu lógica de ordenamiento (sort) está perfecta y no necesita cambios
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
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 self-start sm:self-center">
            Catálogo
          </h1>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-md py-2 pl-4 pr-10 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition"
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
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-md py-2 pl-4 pr-10 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 transition"
              >
                <option value="default">Ordenar por</option>
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

        {sortedAndFilteredProducts.length > 0 ? (
          // --- AJUSTE RESPONSIVE DE LA GRILLA ---
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