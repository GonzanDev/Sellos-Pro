// funcion para obtener los productos a destacar en el inicio
export const getProductsByIds = (products, ids) => {
  return products.filter((p) => ids.includes(p.id));
};
