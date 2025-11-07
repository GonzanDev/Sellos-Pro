import React from "react";
import { ShoppingCart } from "lucide-react";
import { useProducts } from "../hooks/useProducts.js";
import { useCart } from "../contexts/CartContext.jsx";

/**
 * Componente reutilizable para mostrar una tarjeta de "cross-sell" (venta cruzada).
 *
 * Este componente se encarga de:
 * 1. Encontrar el producto a mostrar (por su ID) de la lista global de productos.
 * 2. Renderizarse solo si la 'displayCondition' es verdadera Y el producto se encuentra.
 * 3. Mostrar la tarjeta del producto con su imagen, título, descripción y precio.
 * 4. Manejar su propio botón de "Añadir al Carrito".
 */
export default function CrossSellItem({
  productIdToFind,
  displayCondition,
  title,
  description,
  showToast,
}) {
  const { products } = useProducts();
  const { addToCart } = useCart();

  // No mostrar nada si la condición (ej: product.requiresPad) no se cumple.
  if (!displayCondition) {
    return null;
  }

  // Encontrar el producto de cross-sell usando el ID
  const product = products.find((p) => p.id === productIdToFind);

  // No mostrar nada si el producto no se encontró en la lista
  if (!product) {
    return null;
  }

  // Manejador para añadir este item específico al carrito
  const handleAddItem = () => {
    addToCart({ ...product, qty: 1 });
    showToast(`${product.name} agregado al carrito`);
  };

  return (
    <div className="mt-6 border-t border-gray-300 pt-4">
      <h3 className="text-md font-semibold text-gray-800 mb-2">{title}</h3>

      <div className="flex gap-4 items-center mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-md bg-white flex-shrink-0 border"
        />
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              {product.name}: ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleAddItem}
        className="w-full flex items-center justify-center gap-1 py-2 px-3 bg-[#e30613] text-white text-sm font-medium rounded-md hover:bg-red-700 transition"
      >
        <ShoppingCart size={18} />
        Añadir {product.name} al Carrito
      </button>
    </div>
  );
}
