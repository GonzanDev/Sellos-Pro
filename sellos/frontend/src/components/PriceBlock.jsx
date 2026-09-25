/**
 * Bloque de precio reutilizable: precio original tachado + precio actual +
 * etiqueta "PROMO" cuando corresponde. Único lugar que decide cómo se ve
 * un precio con descuento, para que catálogo y detalle no diverjan.
 */
import React from "react";
import { formatPrice } from "../utils/formatPrice.js";

const SIZES = {
  card: {
    original: "text-sm text-gray-500 line-through",
    current: "text-lg font-bold",
    promo: "text-sm font-bold text-red-600 ml-1 hidden md:inline",
  },
  page: {
    original: "text-lg md:text-xl text-gray-500 line-through",
    current: "text-3xl md:text-4xl font-bold",
    promo: "text-sm font-bold text-red-600 ml-1",
  },
};

export default function PriceBlock({ price, originalPrice, size = "card" }) {
  const hasPromo = originalPrice > price;
  const styles = SIZES[size];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {hasPromo && (
        <p className={styles.original}>{formatPrice(originalPrice)}</p>
      )}
      <p
        className={`${styles.current} ${
          hasPromo ? "text-red-600" : "text-gray-900"
        }`}
      >
        {formatPrice(price)}
      </p>
      {hasPromo && <span className={styles.promo}>PROMO</span>}
    </div>
  );
}
