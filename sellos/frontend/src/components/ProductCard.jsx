import React from "react";

export default function ProductCard({ product, addToCart }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100 flex flex-col">
      <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full object-contain"
          />
        ) : (
          <span className="text-gray-400">Sin imagen</span>
        )}
      </div>

      <div className="flex-1 flex flex-col p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 flex-1">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-[#e30613]">
            ${product.price}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="px-3 py-1.5 rounded-lg bg-black text-white hover:bg-[#e30613] transition"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
