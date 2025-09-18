import React, { useState, useMemo, useRef } from "react";
import ProductCard from "../components/ProductCard";
import PersonalizerLogo from "../components/PersonalizerLogo";

export default function KitLogo({ products, addToCart }) {
  const [search, setSearch] = useState("");
  const personalizerRef = useRef(null); // ref local al PersonalizerLogo

  // Filtrado SOLO de productos de tipo "Kit"
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const isKit = p.category === "Kit";
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return isKit && matchSearch;
    });
  }, [products, search]);

  // Función de scroll usando el ref local
  const scrollToPersonalizer = () => {
    if (personalizerRef.current) {
      personalizerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] px-6 py-10">
      {/* Botón para ir al personalizer */}
      <div className="flex justify-center mb-6">
        <button
          onClick={scrollToPersonalizer}
          className="px-6 py-3 bg-[#e30613] text-white rounded-lg hover:bg-red-700 transition"
        >
          Previsualiza tu logo
        </button>
      </div>

      <hr className="my-6" />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
        {/* Buscador */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <input
            type="text"
            placeholder="Buscar kits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e30613]"
          />
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
              No se encontraron kits.
            </div>
          )}
        </div>
      </div>

      {/* Personalizer con ref */}
      <div ref={personalizerRef}>
        <PersonalizerLogo />
      </div>
    </div>
  );
}
