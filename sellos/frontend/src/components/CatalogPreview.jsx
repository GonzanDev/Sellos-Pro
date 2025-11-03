/**
 * ==============================================================================
 * 🖼️ COMPONENTE: Vista Previa del Catálogo (CatalogPreview.jsx)
 * ==============================================================================
 *
 * Descripción: Este es un componente "presentacional" (o "tonto") muy simple.
 * Su única responsabilidad es recibir un array de productos y mostrarlos
 * en un grid responsive.
 *
 * No tiene estado propio. Delega la renderización de cada ítem individual
 * al componente `ProductCard`.
 *
 * @param {object} props
 * @param {Array<object>} props.products - El array de objetos de producto que se
 * van a mostrar en el grid.
 * @param {function} props.addToCart - La función (probablemente del CartContext)
 * que se pasará a cada `ProductCard` para el botón de "Añadir al carrito" rápido.
 */
import React from "react";
import ProductCard from "./ProductCard"; // Importa el componente hijo que renderiza cada tarjeta.

export default function CatalogPreview({ products, addToCart }) {
  return (
    // Contenedor del Grid (usando Tailwind CSS)
    // - Muestra 2 columnas en pantallas pequeñas (móviles).
    // - Muestra 4 columnas en pantallas 'sm' (640px) y superiores.
    // - Añade un espaciado (gap) entre los elementos del grid.
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
      {/*
       * Mapea (itera) sobre el array de `products` recibido por props.
       * Para cada objeto de producto `p` en el array...
       */}
      {products.map((p) => (
        // ...renderiza un componente `ProductCard`.
        <ProductCard
          key={p.id} // La 'key' de React, fundamental para el rendimiento en listas.
          product={p} // Pasa el objeto de producto completo al componente hijo.
          addToCart={addToCart} // Pasa la función de "añadir al carrito" al componente hijo.
        />
      ))}
    </div>
  );
}
