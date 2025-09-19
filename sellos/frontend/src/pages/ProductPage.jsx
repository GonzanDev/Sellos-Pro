import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Personalizer from "../components/Personalizer";
import PersonalizerLogo from "../components/PersonalizerLogo";
import PersonalizerSchool from "../components/PersonalizerSchool";

export default function ProductPage({ products, addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("description");
  const [customization, setCustomization] = useState({});

  const product = products.find((p) => String(p.id) === id);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-600">
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

  const isCustomizable = ["Automáticos", "Fechadores", "Numeradores"].includes(
    product.category
  );
  const isKit = ["Kit"].includes(product.category);

  const isSchool = ["Escolar"].includes(product.category);

  const handleAddToCart = () => {
    const productWithCustomization =
      isCustomizable || isKit ? { ...product, customization } : product;

    addToCart(productWithCustomization);
  };

  return (
    <div className="bg-white min-h-[calc(100vh-200px)]">
      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Imagen */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-[500px] flex items-center justify-center bg-gray-50 rounded-lg">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full object-contain"
                />
              ) : (
                <span className="text-gray-400">Sin imagen</span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <span className="text-3xl font-semibold text-[#e30613] mb-6">
              ${product.price}
            </span>

            <div className="flex gap-4 mb-10">
              <button
                onClick={handleAddToCart}
                className="px-6 py-3 rounded-lg bg-black text-white font-semibold hover:bg-[#e30613] transition"
              >
                Agregar al carrito
              </button>
              <button
                onClick={() => navigate("/catalog")}
                className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Volver al catálogo
              </button>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  className={`px-4 py-2 transition ${
                    activeTab === "description"
                      ? "border-b-2 border-[#e30613] text-[#e30613] font-semibold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Descripción
                </button>

                {isCustomizable && (
                  <button
                    className={`px-4 py-2 transition ${
                      activeTab === "personalizer"
                        ? "border-b-2 border-[#e30613] text-[#e30613] font-semibold"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab("personalizer")}
                  >
                    Personalizador
                  </button>
                )}

                {isKit && (
                  <button
                    className={`px-4 py-2 transition ${
                      activeTab === "logo"
                        ? "border-b-2 border-[#e30613] text-[#e30613] font-semibold"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab("logo")}
                  >
                    Logo
                  </button>
                )}

                {isSchool && (
                  <button
                    className={`px-4 py-2 transition ${
                      activeTab === "escolar"
                        ? "border-b-2 border-[#e30613] text-[#e30613] font-semibold"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab("escolar")}
                  >
                    Logo
                  </button>
                )}
              </div>

              {/* Contenido de tabs */}
              <div className="mt-6">
                {activeTab === "description" && (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                )}

                {activeTab === "personalizer" && isCustomizable && (
                  <div className="mt-4">
                    <Personalizer
                      customization={customization}
                      setCustomization={setCustomization}
                    />
                  </div>
                )}

                {activeTab === "logo" && isKit && (
                  <div className="mt-4">
                    <PersonalizerLogo
                      customization={customization}
                      setCustomization={setCustomization}
                    />
                  </div>
                )}

                {activeTab === "escolar" && isSchool && (
                  <div className="mt-4">
                    <PersonalizerSchool
                      customization={customization}
                      setCustomization={setCustomization}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
