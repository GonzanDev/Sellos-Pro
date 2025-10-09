import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product, addToCart }) {
  const price = typeof product.price === "number" ? product.price : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group flex flex-col">
      {/* La imagen ahora es un link a la página del producto */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="bg-white h-56 flex items-center justify-center p-4 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      {/* Contenido de la tarjeta */}
      <div className="p-4 text-left border-t border-gray-100 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-base text-gray-800 truncate">
            {product.name}
          </h3>
          <p className="mt-1 text-lg font-bold text-gray-900">
            ${price.toLocaleString("es-AR")}
          </p>
        </div>
        <button
          onClick={() => addToCart(product)}
          className="mt-4 w-full py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-[#e30613] transition-colors duration-300"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
