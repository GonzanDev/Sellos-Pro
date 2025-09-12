import React from "react";

function ProductCard({ product, addToCart }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">
      <img
        src={product.image}
        alt={product.name}
        className="rounded-lg mb-4 h-40 object-cover"
      />
      <h3 className="font-semibold text-lg text-black">{product.name}</h3>
      <p className="text-gray-600 flex-1">{product.description}</p>
      <p className="text-red-600 font-bold mt-2">${product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-black transition"
      >
        Añadir al Carrito
      </button>
    </div>
  );
}

export default ProductCard;
