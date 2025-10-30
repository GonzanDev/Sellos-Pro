import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  X,
  Send,
  User,
  Mail,
  Phone,
  RefreshCw,
} from "lucide-react";
import Personalizer from "../components/Personalizer";
import PersonalizerLogo from "../components/PersonalizerLogo";
import PersonalizerSchool from "../components/PersonalizerSchool";
// --- Agrega el ColorPicker si aún no está importado ---
import ColorPicker from "../components/ColorPicker";
// ----------------------------------------------------
import { useCart } from "../contexts/CartContext.jsx";
import { useProducts } from "../hooks/useProducts.js";

// Definimos la URL de la API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export default function ProductPage({ showToast }) {
  const { products, loading, error } = useProducts();
  const { addToCart, updateCartItem } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // Verificamos si estamos editando un item existente
  const existingCartItem = location.state;
  const isEditing = !!existingCartItem;
  const [customization, setCustomization] = useState(
    existingCartItem?.customization || {}
  );
  const [quantity, setQuantity] = useState(existingCartItem?.quantity || 1);
  const [activeImage, setActiveImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // --- Estados para la solicitud de presupuesto ---
  const [isSendingBudget, setIsSendingBudget] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // --- ¡NUEVO! useEffect para resetear el estado al cambiar de producto ---
  // Esto soluciona el bug de que la personalización de un producto
  // se "pegue" al navegar a otro producto desde el carrito.
  useEffect(() => {
    // Leemos el state (datos del carrito) de la ubicación actual
    const newExistingCartItem = location.state;

    // Reiniciamos los estados a sus valores por defecto (o los del item a editar)
    setCustomization(newExistingCartItem?.customization || {});
    setQuantity(newExistingCartItem?.quantity || 1);
    setActiveImage(0); // Volvemos a la primera imagen
    setFormErrors({}); // Limpiamos errores de formulario
    setBuyerInfo({ name: "", email: "", phone: "" }); // Limpiamos datos del comprador
  }, [id, location.state]);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
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

  const categories = (
    Array.isArray(product.category)
      ? product.category
      : typeof product.category === "string"
      ? [product.category]
      : []
  ).map((c) => c.toLowerCase());

  // --- ✅ NUEVA LÓGICA DE CATEGORÍAS CORREGIDA ---
  const isKit = categories.includes("kits");
  const isSchool = categories.includes("escolar");
  const isInk = categories.includes("tintas"); // Identificamos las tintas
  const isDateStamp = categories.includes("fechadores"); // <-- AÑADIDO: Identifica fechadores

  // isCustomizable: Solo si es Automático Y NO es Tinta Y NO es Fechador (u otros no personalizables)
  const isCustomizable =
    categories.includes("automáticos") && !isInk && !isDateStamp;
  // ----------------------------------------------// ----------------------------------------------

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      customization,
      qty: quantity,
    };
    addToCart(productToAdd);
    showToast(`${product.name} agregado al carrito`);
  };
  // Esta se llama si estamos en modo "edición"
  const handleUpdateCartItem = () => {
    const updatedProductData = {
      ...product, // Mantenemos los datos base del producto
      customization: customization,
      qty: quantity,
    };
    // Usamos la nueva función del contexto
    updateCartItem(existingCartItem.cartItemId, updatedProductData);
    showToast(`${product.name} actualizado en el carrito`);
  };

  // --- Manejador para el formulario de datos del comprador ---
  const handleBuyerChange = (e) => {
    const { name, value } = e.target;
    setBuyerInfo((prev) => ({ ...prev, [name]: value }));
    // Limpiamos el error de este campo al empezar a escribir
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleOpenBudgetModal = () => {
    // Validamos que se haya subido un logo ANTES de abrir el modal
    if (isKit && !customization.logoPreview) {
      showToast("Por favor, sube un logo antes de cotizar.");
      return;
    }
    setFormErrors({}); // Limpiamos errores antiguos
    setIsBudgetModalOpen(true); // Abrimos el modal
  };

  const handleRequestBudget = async () => {
    // Validación de campos del formulario
    const errors = {};
    if (!buyerInfo.name.trim()) errors.name = "El nombre es obligatorio.";
    if (!buyerInfo.email.trim() || !/\S+@\S+\.\S+/.test(buyerInfo.email))
      errors.email = "El email no es válido.";
    if (!buyerInfo.phone.trim()) errors.phone = "El teléfono es obligatorio.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast("Por favor, completa tus datos de contacto.");
      return;
    }

    setFormErrors({});
    setIsSendingBudget(true);

    // --- Construimos un FormData para enviar el archivo ---
    const formData = new FormData();
    formData.append(
      "product",
      JSON.stringify({ id: product.id, name: product.name })
    );

    // Quitamos los archivos del objeto de personalización antes de enviarlo como JSON
    const { logoFile, logoPreview, ...customizationDetails } = customization;
    formData.append("customization", JSON.stringify(customizationDetails));

    formData.append("quantity", quantity);
    formData.append("buyer", JSON.stringify(buyerInfo));

    // Adjuntamos el archivo del logo
    if (logoFile) {
      formData.append("logoFile", logoFile);
    }

    try {
      const response = await fetch(`${API_URL}/request-budget`, {
        method: "POST",
        // No establecemos 'Content-Type', el navegador lo hace por nosotros
        body: formData,
      });

      if (response.ok) {
        showToast("Solicitud de presupuesto enviada. Te contactaremos pronto.");
        setCustomization({});
        setBuyerInfo({ name: "", email: "", phone: "" }); // Limpiamos el formulario
        setIsBudgetModalOpen(false); // Cerramos el modal
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
      setIsSendingBudget(false);
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

  // --- Función para manejar el cambio de color para tintas ---
  const handleColorChange = (hex) => {
    setCustomization((prev) => ({ ...prev, color: hex }));
  };
  // --------------------------------------------------------

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
            {/* Aviso debajo de las imágenes */}
<p className="text-sm text-gray-500 mt-2 text-center italic">
  💡 Haz clic sobre la imagen para verla en tamaño completo.
</p>

          </div>

          {/* Columna de Información y Personalización */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="text-gray-600 mt-4 leading-relaxed">
              {product.description.split("\n").map((line, index, array) => (
                <React.Fragment key={index}>
                  {line}
                  {/* Añade un <br /> si NO es la última línea, para evitar un salto extra al final */}
                  {index < array.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
            {/* --- PRECIO CONDICIONAL --- */}
            <p className="text-3xl md:text-4xl font-bold text-red-600 my-6">
              {isKit ? "Precio a cotizar" : `$${product.price.toFixed(2)}`}
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                {/* --- TÍTULO CONDICIONAL --- */}
                {isKit
                  ? "Completa los datos para cotizar"
                  : "Personaliza tu Sello"}
              </h2>

              {/* Muestra Personalizer SOLO si es customizable (ej: automático) y NO es tinta */}
              {isCustomizable && (
                <Personalizer
                  product={product}
                  customization={customization}
                  setCustomization={setCustomization}
                />
              )}

              {/* Muestra SOLO ColorPicker si es Tinta */}
              {isInk && (
                <ColorPicker
                  colors={product.colors || []} // Colores del producto
                  value={customization.color}
                  onChange={handleColorChange}
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
                  const padProduct = products.find((p) => p.id === 19);
                  if (!padProduct) return null;

                  const handleAddPad = () => {
                    addToCart({ ...padProduct, qty: 1 });
                    showToast(`${padProduct.name} agregado al carrito`);
                  };

                  return (
                    <div className="mt-6 border-t border-gray-300 pt-4">
                      <h3 className="text-md font-semibold text-gray-800 mb-2">
                        ¿No tienes Almohadilla + Tinta?
                      </h3>

                      <div className="flex gap-4 items-center mb-3">
                        {/* <-- AQUÍ SE AGREGA LA IMAGEN --> */}
                        <img
                          src={padProduct.image}
                          alt={padProduct.name}
                          className="w-16 h-16 object-cover  rounded-md bg-white flex-shrink-0"
                        />

                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Este producto requiere una almohadilla + tinta para
                            su uso. ¡Añade el kit!
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-900">
                              {padProduct.name}: ${padProduct.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Botón de añadir separado al final del bloque */}
                      <button
                        onClick={handleAddPad}
                        className="w-full flex items-center justify-center gap-1 py-2 px-3 bg-[#e30613] text-white text-sm font-medium rounded-md hover:bg-red-700 transition"
                      >
                        <ShoppingCart size={18} />
                        Añadir {padProduct.name} al Carrito
                      </button>
                    </div>
                  );
                })()}

              {/* Sección Frasquito de Tinta opcional */}
              {categories.includes("automáticos") &&
                (() => {
                  const inkRefill = products.find((p) => p.id === 24);
                  if (!inkRefill) return null;

                  const handleAddInk = () => {
                    addToCart({ ...inkRefill, qty: 1 });
                    showToast(`${inkRefill.name} agregado al carrito`);
                  };

                  return (
                    <div className="mt-6 border-t border-gray-300 pt-4">
                      <h3 className="text-md font-semibold text-gray-800 mb-2">
                        ¿Vas a necesitar un frasquito para cargar tu sello?
                      </h3>

                      <div className="flex gap-4 items-center mb-3">
                        <img
                          src={inkRefill.image}
                          alt={inkRefill.name}
                          className="w-16 h-16 object-cover  rounded-md bg-white flex-shrink-0"
                        />

                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Si le vas a dar mucho uso, te damos la opcion
                            agregar a tu compra un frasquito de nuestra tinta
                            especial para sellos que estira su vida útil. Con
                            unas gotitas es suficiente para recargarlo.
                          </p>
                          <span className="text-lg font-bold text-gray-900">
                            {inkRefill.name}: ${inkRefill.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleAddInk}
                        className="w-full flex items-center justify-center gap-1 py-2 px-3 bg-[#e30613] text-white text-sm font-medium rounded-md hover:bg-red-700 transition"
                      >
                        <ShoppingCart size={18} />
                        Añadir {inkRefill.name} al Carrito
                      </button>
                    </div>
                  );
                })()}

              {/* --- BOTONES CONDICIONALES --- */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                {isKit ? (
                  // Botón para ABRIR EL MODAL de presupuesto
                  <button
                    onClick={handleOpenBudgetModal}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                  >
                    <Send size={20} />
                    Solicitar Presupuesto
                  </button>
                ) : (
                  // --- LÓGICA DE BOTÓN ACTUALIZADA ---
                  // Mostramos "Actualizar" o "Añadir" según el modo
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

                    {isEditing ? (
                      // Botón de Actualizar
                      <button
                        onClick={handleUpdateCartItem} // <-- Llama a la nueva función
                        className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                      >
                        <RefreshCw size={20} />
                        Actualizar Cambios
                      </button>
                    ) : (
                      // Botón de Añadir
                      <button
                        onClick={handleAddToCart} // <-- Llama a la función original
                        className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 bg-[#e30613] text-white font-semibold rounded-md hover:bg-red-700 transition"
                      >
                        <ShoppingCart size={20} />
                        Añadir al Carrito
                      </button>
                    )}
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
      {/* --- ¡NUEVO! MODAL PARA SOLICITUD DE PRESUPUESTO --- */}
      {isBudgetModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setIsBudgetModalOpen(false)} // Cierra al hacer clic fuera
        >
          <div
            className="relative bg-white rounded-lg shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro
          >
            {/* Header del Modal */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Solicitar Presupuesto
              </h3>
              <button
                onClick={() => setIsBudgetModalOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cuerpo del Modal (el formulario) */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Por favor, completa tus datos para que podamos contactarte con
                la cotización para tu <strong>{product.name}</strong>.
              </p>

              {/* Campo Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre y Apellido
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <User size={16} className="text-gray-400" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={buyerInfo.name}
                    onChange={handleBuyerChange}
                    className="w-full pl-10 border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
                    placeholder="Tu nombre"
                  />
                </div>
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>
              {/* Campo Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail size={16} className="text-gray-400" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={buyerInfo.email}
                    onChange={handleBuyerChange}
                    className="w-full pl-10 border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
                    placeholder="tu@email.com"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
              {/* Campo Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono (WhatsApp)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Phone size={16} className="text-gray-400" />
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={buyerInfo.phone}
                    onChange={handleBuyerChange}
                    className="w-full pl-10 border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
                    placeholder="223 123-4567"
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Footer del Modal (Botón de envío) */}
            <div className="p-4 bg-gray-50 border-t rounded-b-lg">
              <button
                onClick={handleRequestBudget} // Llama a la función de envío
                disabled={isSendingBudget}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Send size={20} />
                {isSendingBudget ? "Enviando..." : "Confirmar Solicitud"}
              </button>
            </div>
          </div>
          {/* Estilos para la animación (si no los tienes globales) */}
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
          `}</style>
        </div>
      )}
    </div>
  );
}
