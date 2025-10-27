import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Importamos 'Send' para el nuevo botón y 'Heart' que faltaba
import { ShoppingCart, Heart, X, Send } from "lucide-react";
import Personalizer from "../components/Personalizer";
import PersonalizerLogo from "../components/PersonalizerLogo";
import PersonalizerSchool from "../components/PersonalizerSchool";
import { useCart } from "../contexts/CartContext.jsx";
import { useProducts } from "../hooks/useProducts.js";

// Definimos la URL de la API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export default function ProductPage({ showToast }) {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();

  const [customization, setCustomization] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  // --- Estado para controlar el modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  // --- ¡NUEVO! Estado de carga para el botón de presupuesto ---
  const [isSendingBudget, setIsSendingBudget] = useState(false);

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
      <>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg">Producto no encontrado</p>
          <button
            onClick={() => navigate("/catalog")}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-[#e30613] transition"
          >
            Volver al catálogo
          </button>
        </div>
      </>
    );
  }

  const category = product.category?.toLowerCase();
  const isCustomizable = ["automáticos", "tintas"].includes(category);
  const isKit = category === "kits"; // Asegúrate que esta categoría sea correcta
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

  // --- ¡NUEVO! Función para solicitar presupuesto ---
  const handleRequestBudget = async () => {
    // Validamos que se haya subido un logo
    if (isKit && !customization.logoPreview) {
      showToast("Por favor, sube un logo para solicitar el presupuesto.");
      return;
    }

    setIsSendingBudget(true); // Mostramos estado de carga
    try {
      const response = await fetch(`${API_URL}/request-budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: { id: product.id, name: product.name }, // Enviamos info básica del producto
          customization: customization, // Enviamos todos los detalles de personalización
          quantity: quantity, // Enviamos la cantidad (aunque para kits puede ser 1 siempre)
        }),
      });

      if (response.ok) {
        showToast("Solicitud de presupuesto enviada. Te contactaremos pronto.");
        // Opcional: limpiar el formulario o redirigir
        setCustomization({});
      } else {
        const errorData = await response.json();
        showToast(
          `Error al enviar la solicitud: ${
            errorData.details || "Intenta de nuevo."
          }`
        );
      }
    } catch (err) {
      console.error("Error enviando solicitud de presupuesto:", err);
      showToast("Error de conexión al enviar la solicitud.");
    } finally {
      setIsSendingBudget(false); // Quitamos estado de carga
    }
  };

  // Aseguramos que images sea un array y filtramos null/undefined
  const images = [product.image, ...(product.thumbnails || [])].filter(Boolean);

  const pageTitle = `${product.name} - SellosPro`;
  const pageDescription = `Compra ${
    product.name
  } personalizado en SellosPro. ${product.description?.substring(
    0,
    120
  )}... Calidad profesional en Mar del Plata.`;

  return (
    <div className="= py-8 md:py-12">
      {" "}
      {/* Fondo blanco para la página */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Columna de Imágenes */}
          <div>
            {/* --- CONTENEDOR PRINCIPAL ES UN BOTÓN PARA ABRIR MODAL --- */}
            <button
              className="aspect-square bg-white rounded-lg flex items-center justify-center border overflow-hidden relative w-full cursor-pointer hover:opacity-90 transition group" // Añadido group
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover" // object-cover para llenar
              />
              {/* Icono sutil para indicar zoom */}
              <div className="absolute bottom-3 right-3 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </div>
            </button>
            {/* Miniaturas */}
            <div className="flex gap-2 sm:gap-4 mt-4 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center p-1 border-2 overflow-hidden ${
                    activeImage === index
                      ? "border-red-600 ring-1 ring-red-300"
                      : "border-gray-200 hover:border-red-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
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
            {/* --- PRECIO CONDICIONAL --- */}
            <p className="text-3xl md:text-4xl font-bold text-red-600 my-6">
              {isKit ? "Precio a cotizar" : `$${product.price.toFixed(2)}`}
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

              {/* Sección Almohadilla */}
              {product.requiresPad &&
                (() => {
                  const padProduct = products.find((p) => p.id === 19); // Asegúrate que el ID es correcto
                  if (!padProduct) return null;
                  const handleAddPad = () => {
                    addToCart({ ...padProduct, qty: 1 });
                    showToast(`${padProduct.name} agregado al carrito`);
                  };
                  return (
                    <div className="mt-6 border-t border-gray-300 pt-4">
                      {/* ... (código sección almohadilla) ... */}
                    </div>
                  );
                })()}

              {/* --- BOTONES CONDICIONALES --- */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                {isKit ? (
                  // Botón para solicitar presupuesto (solo para kits)
                  <button
                    onClick={handleRequestBudget}
                    disabled={isSendingBudget}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                    {isSendingBudget ? "Enviando..." : "Solicitar Presupuesto"}
                  </button>
                ) : (
                  // Botones estándar para otros productos
                  <>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3 py-2 text-lg hover:bg-gray-200 transition rounded-l-md"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-semibold ">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-3 py-2 text-lg hover:bg-gray-200 transition rounded-r-md"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 bg-[#e30613] text-white font-semibold rounded-md hover:bg-red-700 transition"
                    >
                      <ShoppingCart size={20} />
                      Añadir al Carrito
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* --- MODAL PARA LA IMAGEN --- */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in" // Simple fade-in animation
          onClick={() => setIsModalOpen(false)}
        >
          {/* Contenedor del modal con stopPropagation */}
          <div
            className="relative max-w-3xl max-h-[85vh] bg-white rounded-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen dentro del modal */}
            <img
              src={images[activeImage]}
              alt={product.name}
              className="block max-h-[85vh] w-auto object-contain"
            />
            {/* Botón para cerrar el modal */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 p-2 bg-white/80 rounded-full text-gray-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              aria-label="Cerrar imagen"
            >
              <X size={24} />
            </button>
          </div>
          {/* Añadimos estilos para la animación fade-in si no los tienes globalmente */}
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
          `}</style>
        </div>
      )}
    </div>
  );
}
