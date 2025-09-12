import React from "react";

export default function ProductCard({ product, addToCart }) {
  return (
    <article className="bg-white rounded-lg shadow p-4 flex flex-col">
      <img
        src={product.image}
        alt={product.name}
        className="h-44 w-full object-cover rounded mb-3"
      />
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500 flex-1 my-2">{product.description}</p>
      <div className="flex items-center justify-between">
        <div className="text-red-600 font-bold">AR$ {product.price}</div>
        <button
          onClick={() => addToCart(product)}
          className="px-3 py-2 bg-[#e30613] text-white rounded hover:bg-black transition"
        >
          Añadir
        </button>
      </div>
    </article>
  );
}
