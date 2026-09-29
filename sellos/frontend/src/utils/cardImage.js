/**
 * Devuelve la variante liviana (~480px, generada de antemano) de la imagen
 * principal de un producto, para usar en tarjetas/listas pequeñas
 * (ProductCard, CrossSellItem, buscador del Header). La imagen original
 * (`product.image`) se sigue usando tal cual en ProductPage, donde se
 * muestra grande y con zoom.
 */
export function getCardImage(src) {
  if (!src) return src;
  const lastDot = src.lastIndexOf(".");
  if (lastDot === -1) return src;
  return `${src.slice(0, lastDot)}-card.webp`;
}
