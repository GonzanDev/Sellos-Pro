export function formatPrice(price) {
  const value = typeof price === "number" ? price : 0;
  return `$${value.toLocaleString("es-AR")}`;
}
