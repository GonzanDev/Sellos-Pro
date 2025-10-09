import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import CatalogPreview from "../components/CatalogPreview";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../contexts/CartContext";
import { getProductsByIds } from "../../../backend/utils/utils";

const selectedIds = [2, 5, 7, 10]; // IDs de productos para "Los Más Vendidos"

export default function Home({ showToast }) {
  // Obtenemos los datos directamente desde los hooks
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    showToast(`${product.name} agregado al carrito`);
  };

  // Manejamos los estados de carga y error mientras se obtienen los productos
  if (loading) {
    return <div className="text-center py-20">Cargando...</div>;
  }
  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        Error al cargar los productos.
      </div>
    );
  }

  // Una vez que tenemos los productos, los filtramos
  const previewProducts = getProductsByIds(products, selectedIds);

  // El div principal ya no necesita un fondo específico, hereda el de la app.
  return (
    <div>
      <Hero />
      <section className="py-12 sm:py-16">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            {/* Estilo del título ajustado y centrado */}
            <h2 className="text-2xl font-bold text-gray-800">
              Los Más Vendidos
            </h2>
          </div>
          <CatalogPreview
            products={previewProducts}
            addToCart={handleAddToCart}
          />
          <div className="text-center mt-16">
            <Link
              to="/catalog"
              className="inline-block px-8 py-3 bg-white text-gray-800 rounded-md border border-gray-300 hover:bg-gray-100 transition font-semibold"
            >
              Ver todo el catálogo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
