import React from "react";
import ProductCard from "./ProductCard";

export default function Catalog({ products = [], addToCart }) {
  return (
    <section id="catalog" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Catálogo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </section>  
  );
}
