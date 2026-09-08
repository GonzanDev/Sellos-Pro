/**
 * ==============================================================================
 * 🃏 COMPONENTE: Tarjeta de Producto (ProductCard.jsx)
 * ==============================================================================
 *
 * Descripción: Renderiza una tarjeta individual para un producto en el catálogo.
 *
 * Responsabilidades:
 * 1. Muestra la imagen, nombre y precio del producto.
 * 2. La imagen y el título enlazan a la página de detalle del producto.
 * 3. Lógica condicional:
 * - Si el producto es un "kit" (o requiere personalización/cotización),
 * muestra un botón <Link> que lleva a la página del producto.
 * - Si es un producto estándar, muestra un botón <button> para
 * "Añadir al carrito" directamente (acción rápida).
 *
 * @param {object} props
 * @param {object} props.product - El objeto de producto con (id, name, price, image, category).
 */
import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Para la navegación a la página de detalle.

export default function ProductCard({ product }) {
  // Guardrail: Asegura que el precio sea un número para evitar errores
  // con .toLocaleString() si 'price' es undefined o null.
  const price = typeof product.price === "number" ? product.price : 0;

  const originalPrice = typeof product.originalPrice === "number" 
    ? product.originalPrice 
    : 0;
    
  const navigate = useNavigate();
  // --- Lógica de Categoría (Corrección) ---
  // Esta lógica robusta determina si el producto es un "kit".

  // 1. Estandarizamos 'category': Nos aseguramos de que 'categories'
  //    sea SIEMPRE un array, sin importar si 'product.category'
  //    es un string, un array, o nulo/undefined.
  const categories = (
    Array.isArray(product.category)
      ? product.category // Si ya es un array, lo usamos.
      : typeof product.category === "string"
      ? [product.category] // Si es un string, lo metemos en un array.
      : []
  ) // Si es nulo o cualquier otra cosa, usamos un array vacío.
    .filter((c) => typeof c === "string") // 2. Nos aseguramos que solo contenga strings.
    .map((c) => c.toLowerCase()); // 3. Pasamos todo a minúsculas para una comparación fiable.

  // 4. "kits" y "kitempanadas" siguen el camino de cotización (quote-first),
  //    por eso muestran el botón "Personalizar y Cotizar".
  const isKitProduct =
    categories.includes("kits") || categories.includes("kitempanadas");
  // --- Fin de la lógica de categoría ---

  // Sin stock: solo cuando el producto declara un stock numérico en 0 o menos.
  const outOfStock = typeof product.stock === "number" && product.stock <= 0;

  return (
    // Contenedor principal de la tarjeta.
    // 'group': Permite que los elementos hijos (como la imagen) reaccionen
    //          al 'hover' de esta tarjeta padre.
    // 'flex flex-col': Clave para que el 'flex-1' del contenido funcione.
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group flex flex-col">
      {/* Enlace a la página de detalle del producto, envuelve la imagen. */}
      <Link to={`/product/${product.id}`} className="block">
        {/* --- CONTENEDOR DE IMAGEN AJUSTADO --- */}
        {/* 'aspect-square': Mantiene una proporción 1:1 (cuadrada). */}
        {/* 'overflow-hidden': Necesario para que 'object-cover' funcione bien. */}
        <div className="relative aspect-square w-full bg-white flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            // 'object-cover': llena el contenedor cuadrado sin distorsión.
            // 'group-hover:scale-105': zoom sutil al hacer hover en la tarjeta.
            // Sin stock: la imagen se atenúa y desatura.
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              outOfStock ? "opacity-50 grayscale" : ""
            }`}
          />
          {outOfStock && (
            <span className="absolute top-2 left-2 rounded-full bg-gray-900/85 text-white text-xs font-semibold px-2.5 py-1">
              Sin stock
            </span>
          )}
        </div>
      </Link>

      {/* --- Contenido de la tarjeta (Texto y Botón) --- */}
      {/* 'flex-1': Hace que este div ocupe todo el espacio vertical sobrante. */}
      {/* 'flex-col justify-between': Separa el texto (arriba) del botón (abajo). */}
      <div className="p-4 text-left border-t border-gray-100 flex-1 flex flex-col justify-between">
        {/* Sección de Texto (Nombre y Precio) */}
        <div>
          <h3
            className="font-semibold text-base text-gray-800 truncate group-hover:text-[#e30613] transition-colors"
            title={product.name}
          >
            {/* 'truncate': Añade "..." si el nombre es muy largo. */}
            {product.name}
          </h3>
          {/* --- BLOQUE DE PRECIOS ACTUALIZADO --- */}
          {price > 0 && (
            <div className="mt-1 flex items-center gap-3 flex-wrap">
              {/* 🆕 1. PRECIO ORIGINAL TACHADO (si existe) */}
              {originalPrice > price && (
                <p className="text-sm text-gray-500 line-through">
                  ${originalPrice.toLocaleString("es-AR")} 
                </p>
              )}
              
              {/* 2. PRECIO REAL (destacado) */}
              <p className={`text-lg font-bold ${originalPrice > price ? 'text-[#e30613]' : 'text-gray-900'}`}>
                ${price.toLocaleString("es-AR")}
              </p>
              
            {/* 🆕 3. ETIQUETA 'PROMO' (si hay descuento) */}
              {originalPrice > price && (
              <span className="text-sm font-bold text-[#e30613] ml-1 hidden md:inline">
                PROMO
              </span>
              )}
            </div>
          )}
        </div>

        {/* --- Lógica Condicional de Botones --- */}
        {isKitProduct ? (
          // CASO A: Es un Kit o producto con logo
          // Muestra un <Link> (enlace) estilizado como botón.
          // El usuario DEBE ir a la página de detalle para personalizar.
          <Link
            to={`/product/${product.id}`}
            className="mt-4 w-full block text-center py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-300 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
          >
            Personalizar y Cotizar
          </Link>
        ) : (
          // CASO B: Es un producto estándar.
          // El botón lleva a la página de detalle para personalizar y comprar
          // (no agrega al carrito directamente), por eso la etiqueta es "Ver producto".
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="mt-4 w-full py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-[#e30613] transition-colors duration-300 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800"
          >
            Ver producto
          </button>
        )}
      </div>
    </div>
  );
}
