import React from "react";
import ProductCard from "./ProductCard";

export default function CatalogPreview({ products, addToCart }) {
  return (
    // Añadimos padding horizontal (px) y limitamos el ancho máximo (max-w) con centrado (mx-auto)
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} addToCart={addToCart} />
      ))}
    </div>
  );
}
