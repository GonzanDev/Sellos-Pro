import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product, addToCart }) {
  const price = typeof product.price === "number" ? product.price : 0;
  const isKitProduct = product.category?.toLowerCase() === "kits";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group flex flex-col">
      <Link to={`/product/${product.id}`} className="block">
        {/* --- CONTENEDOR DE IMAGEN AJUSTADO --- */}
        {/* Usamos aspect-square para mantener proporción 1:1 y bg-white */}
        <div className="aspect-square w-full bg-white flex items-center justify-center  overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            // --- CAMBIO CLAVE: object-cover ---
            // La imagen ahora llenará el contenedor, recortándose si es necesario.
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      {/* Contenido de la tarjeta */}
      <div className="p-4 text-left border-t border-gray-100 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-base text-gray-800 truncate group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 text-lg font-bold text-gray-900">
            ${price.toLocaleString("es-AR")}
          </p>
        </div>
        {isKitProduct ? (
          // Botón para productos kit/logo: lleva a la página de producto para personalizar
          <Link
            to={`/product/${product.id}`}
            className="mt-4 w-full block text-center py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-300 text-sm"
          >
            Personalizar y Cotizar
          </Link>
        ) : (
          // Botón estándar para agregar al carrito
          <button
            onClick={() => addToCart(product)}
            className="mt-4 w-full py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-[#e30613] transition-colors duration-300 text-sm"
          >
            Agregar
          </button>
        )}
      </div>
    </div>
  );
}
