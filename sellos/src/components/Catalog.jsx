import React from "react";
import ProductCard from "./ProductCard";

function Catalog({ products, addToCart }) {
  return (
    <section className="py-16 bg-gray-50" id="catalog">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-black mb-8 text-center">
          Nuestro Catálogo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Catalog;
