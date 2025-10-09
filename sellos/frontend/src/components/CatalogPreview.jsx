import React from "react";
import ProductCard from "./ProductCard";

export default function CatalogPreview({ products, addToCart }) {
  return (
    // Añadimos padding horizontal (px) y limitamos el ancho máximo (max-w) con centrado (mx-auto)
    <div className="max-w-9xl mx-20 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}
