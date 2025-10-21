import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Personalizer from "../components/Personalizer";
import PersonalizerLogo from "../components/PersonalizerLogo";
import PersonalizerSchool from "../components/PersonalizerSchool";
import { useCart } from "../contexts/CartContext.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { ShoppingCart } from "lucide-react";

export default function ProductPage({ showToast }) {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();

  const [customization, setCustomization] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const product = products.find((p) => String(p.id) === id);

  if (loading)
    return <div className="text-center py-20">Cargando producto...</div>;
  if (error)
    return (
      <div className="text-center py-20 text-red-600">
        Error al cargar el producto.
      </div>
    );
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg">Producto no encontrado</p>
        <button
          onClick={() => navigate("/catalog")}
          className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-[#e30613] transition"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  const category = product.category?.toLowerCase();
  const isCustomizable = ["automáticos", "tintas"].includes(category);
  const isKit = category === "kit";
  const isSchool = category === "escolar";

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      customization,
      qty: quantity,
    };
    addToCart(productToAdd);
    showToast(`${product.name} agregado al carrito`);
  };

  const images = [product.image, ...(product.thumbnails || [])];

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Columna de Imágenes */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="max-h-full object-contain p-4"
              />
            </div>
            <div className="flex gap-2 sm:gap-4 mt-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center p-1 border-2 ${
                    activeImage === index
                      ? "border-red-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="max-h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Columna de Información y Personalización */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="text-gray-600 mt-4 leading-relaxed">
              {product.description}
            </p>
            <p className="text-3xl md:text-4xl font-bold text-red-600 my-6">
              ${product.price.toFixed(2)}
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Personaliza tu Sello
              </h2>

              {isCustomizable && (
                <Personalizer
                  product={product}
                  customization={customization}
                  setCustomization={setCustomization}
                />
              )}
              {isKit && (
                <PersonalizerLogo
                  customization={customization}
                  setCustomization={setCustomization}
                />
              )}
              {isSchool && (
                <PersonalizerSchool
                  product={product}
                  customization={customization}
                  setCustomization={setCustomization}
                />
              )}

              {/* 🔸 Sección adicional para Almohadilla + Tinta */}
              {product.requiresPad && (() => {
                const padProduct = products.find((p) => p.id === 19);
                if (!padProduct) return null;

                const handleAddPad = () => {
                  addToCart({
                    ...padProduct,
                    qty: 1,
                  });
                  showToast(`${padProduct.name} agregado al carrito`);
                };

                return (
                  <div className="mt-6 border-t border-gray-300 pt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Este producto necesita:
                    </h3>
                    <div className="flex items-center gap-4">
                      <img
                        src={padProduct.image}
                        alt={padProduct.name}
                        className="w-20 h-20 object-contain rounded-md border"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {padProduct.name}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {padProduct.description}
                        </p>
                        <p className="text-red-600 font-bold mt-1">
                          ${padProduct.price}
                        </p>
                      </div>
                      <button
                        onClick={handleAddPad}
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-[#e30613] transition"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                );
              })()}

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 bg-[#e30613] text-white font-semibold rounded-md hover:bg-red-700 transition"
                >
                  <ShoppingCart size={20} />
                  Añadir al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
