import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

export default function CatalogPreview({ products, addToCart }) {
  return (
    <section className="py-12 px-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Nuestros sellos más pedidos</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} addToCart={addToCart} />
        ))}
      </div>
      <div className="text-center mt-8">
        <Link
          to="/catalog"
          className="px-6 py-3 bg-[#e30613] text-white rounded hover:bg-black transition"
        >
          Ver todo el catálogo
        </Link>
      </div>
    </section>
  );
}
