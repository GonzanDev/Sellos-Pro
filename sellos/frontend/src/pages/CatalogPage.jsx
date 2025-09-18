import React, { useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";

export default function CatalogPage({ products, addToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // Filtrado de productos
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "all" ? true : p.category === category;
      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] px-6 py-10">
      {/* Contenedor principal con espacio para footer */}
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
        {/* Filtros */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30613]"
          />

<select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className="w-full md:w-1/4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30613]"
>
  <option value="all">Todas las categorías</option>
  <option value="Automáticos">Automáticos</option>
  <option value="Fechadores">Fechadores</option>
  <option value="Numeradores">Numeradores</option>
  <option value="Almohadillas">Almohadillas</option>
  <option value="Tintas">Tintas</option>
  <option value="Otros">Otros</option>
</select>

        </div>

        {/* Grid de productos */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No se encontraron productos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
