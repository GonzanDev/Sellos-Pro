/**
 * ==============================================================================
 * 📦 PÁGINA: Detalle de Producto (ProductPage.jsx)
 * ==============================================================================
 *
 * Descripción:
 * Esta es la página más compleja del frontend. Muestra el detalle de un
 * producto individual y maneja toda la lógica de personalización.
 *
 * Responsabilidades Clave:
 * 1. Obtener y mostrar el producto (basado en el 'id' de la URL).
 * 2. Determinar el TIPO de producto (Kit, Escolar, Estándar, Tinta)
 * usando 'useMemo' para analizar sus categorías.
 * 3. Renderizar DINÁMICAMENTE el personalizador correcto
 * (<Personalizer />, <PersonalizerLogo />, <PersonalizerSchool />, o <ColorPicker />).
 * 4. Manejar el "Modo Edición": Si se accede desde el carrito (vía location.state),
 * precarga la 'customization' y 'quantity' existentes.
 * 5. Manejar Acciones Condicionales:
 * - "Añadir al Carrito" (para productos nuevos).
 * - "Actualizar Cambios" (para productos en "Modo Edición").
 * - "Solicitar Presupuesto" (para productos "Kit" con logo), que
 * incluye un modal, un formulario de contacto, y una llamada a la API
 * del backend con 'FormData' para enviar el archivo.
 * 6. Manejar "Cross-selling" (venta cruzada) sugiriendo productos
 * relacionados como almohadillas o tinta.
 * 7. Gestionar la galería de imágenes (thumbnails y modal de zoom).
 */

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Heart, // (No se usa actualmente)
  X,
  Send,
  User,
  Mail,
  Phone,
  RefreshCw,
} from "lucide-react";
// --- Importa TODOS los personalizadores ---
import Personalizer from "../components/Personalizer";
import PersonalizerLogo from "../components/PersonalizerLogo";
import PersonalizerSchool from "../components/PersonalizerSchool";
import ColorPicker from "../components/ColorPicker";
// ----------------------------------------------------
import { useCart } from "../contexts/CartContext.jsx";
import { useProducts } from "../hooks/useProducts.js";

// URL del backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export default function ProductPage({ showToast }) {
  // --- 1. HOOKS: Obtención de Datos y Contexto ---
  const { products, loading, error } = useProducts(); // Lista completa de productos
  const { addToCart, updateCartItem } = useCart(); // Funciones del carrito
  const { id } = useParams(); // ID del producto desde la URL (ej. /product/5)
  const navigate = useNavigate(); // Para redirigir
  const location = useLocation(); // Para leer el "state" (modo edición)

  // --- 2. LÓGICA DE PRODUCTO: Encontrar el producto actual ---
  // Busca el producto en la lista completa.
  const product = products.find((p) => String(p.id) === id);

  // --- 3. LÓGICA DE CATEGORÍA (Optimizada con useMemo) ---
  // `useMemo` recalcula estas banderas solo si el `product` cambia.
  // Este es el "cerebro" que decide qué UI mostrar.
  const { isKit, isSchool, isCustomizable, isInk, isDateStamp } =
    useMemo(() => {
      // Normaliza las categorías a un array de minúsculas
      const categories = (
        Array.isArray(product?.category)
          ? product.category
          : typeof product?.category === "string"
          ? [product.category]
          : []
      ).map((c) => c.toLowerCase());

      // Define las banderas booleanas
      const isKit = categories.includes("kits");
      const isSchool = categories.includes("escolar");
      const isInk = categories.includes("tintas");
      const isDateStamp = categories.includes("fechadores");
      // "Personalizable" es un automático estándar (que no es tinta ni fechador)
      const isCustomizable =
        categories.includes("automáticos") && !isInk && !isDateStamp;

      return {
        isKit,
        isSchool,
        isCustomizable,
        isInk,
        isDateStamp,
      };
    }, [product]); // Dependencia: solo el objeto 'product'

  // --- 4. LÓGICA DE "MODO EDICIÓN" ---
  // `location.state` es null a menos que naveguemos desde el carrito.
  const existingCartItem = location.state;
  // Si `existingCartItem` no es nulo, estamos en "Modo Edición".
  const isEditing = !!existingCartItem;

  // --- 5. ESTADOS LOCALES DE LA PÁGINA ---
  const [customization, setCustomization] = useState(
    existingCartItem?.customization || {} // Precarga la personalización si editamos
  );
  const [quantity, setQuantity] = useState(existingCartItem?.quantity || 1); // Precarga la cantidad si editamos
  const [activeImage, setActiveImage] = useState(0); // Imagen activa en la galería
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal de zoom de imagen

  // --- Estados para el Modal de Presupuesto (para "Kits") ---
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isSendingBudget, setIsSendingBudget] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({});

  /**
   * --------------------------------------------------------------------------
   * 🧠 EFECTO: Resetear Estado al Cambiar de Producto
   * --------------------------------------------------------------------------
   * Este hook es VITAL. Si el usuario está en `/product/5` y hace clic
   * en un link a `/product/10`, el componente no se "desmonta", solo se
   * actualiza. Este hook detecta ese cambio (en `id` o `location.state`)
   * y resetea todos los estados locales a sus valores por defecto (o a los
   * nuevos valores de "edición" si se da el caso).
   */
  useEffect(() => {
    // Re-leemos el state (datos del carrito) por si cambió
    const newExistingCartItem = location.state;

    // Reiniciamos los estados
    setCustomization(newExistingCartItem?.customization || {});
    setQuantity(newExistingCartItem?.quantity || 1);
    setActiveImage(0); // Volvemos a la primera imagen
    setFormErrors({}); // Limpiamos errores de formulario
    setBuyerInfo({ name: "", email: "", phone: "" }); // Limpiamos datos del comprador
    setIsBudgetModalOpen(false); // Cerramos el modal por si acaso
  }, [id, location.state]); // Dependencias: el ID del producto y el state de navegación

  // --- 6. GUARD CLAUSES (Carga, Error, No Encontrado) ---
  if (loading)
    return <div className="text-center py-20">Cargando producto...</div>;
  if (error)
    return (
      <div className="text-center py-20 text-red-600">
        Error al cargar el producto.
      </div>
    );
  // Si 'loading' terminó pero el 'product' no se encontró
  if (!product) {
    return (
      <>
        <title>Producto no encontrado - SellosPro</title>
        <meta name="robots" content="noindex" />
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

  // --- 7. MANEJADORES DE ACCIONES (Handlers) ---

  /**
   * Añade el producto (con su personalización y cantidad) al carrito.
   */
  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      customization,
      qty: quantity,
    };
    addToCart(productToAdd);
    showToast(`${product.name} agregado al carrito`);
  };

  /**
   * "Modo Edición": Actualiza un ítem *existente* en el carrito.
   */
  const handleUpdateCartItem = () => {
    const updatedProductData = {
      ...product, // Mantenemos los datos base del producto
      customization: customization,
      qty: quantity,
    };
    updateCartItem(existingCartItem.cartItemId, updatedProductData);
    showToast(`${product.name} actualizado en el carrito`);
    navigate("/"); // Redirige al inicio (o podría ser -1 para "atrás")
  };

  /**
   * Manejador para los inputs del formulario de presupuesto (en el modal).
   */
  const handleBuyerChange = (e) => {
    const { name, value } = e.target;
    setBuyerInfo((prev) => ({ ...prev, [name]: value }));
    // Limpia el error de este campo al empezar a escribir
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  /**
   * Abre el modal de presupuesto.
   * Valida que se haya subido un logo si el producto es un "Kit".
   */
  const handleOpenBudgetModal = () => {
    // Validación: No abrir el modal si es un Kit y falta el logo.
    if (isKit && !customization.logoFile) {
      showToast("Por favor, sube un logo antes de cotizar.");
      return;
    }
    setFormErrors({}); // Limpiamos errores antiguos
    setIsBudgetModalOpen(true); // Abrimos el modal
  };

  /**
   * --------------------------------------------------------------------------
   * 🚀 ACCIÓN: Enviar Solicitud de Presupuesto (API Call)
   * --------------------------------------------------------------------------
   * Esta es la lógica para contactar al backend y enviar la solicitud de
   * presupuesto (para productos "Kit").
   */
  const handleRequestBudget = async () => {
    // 1. Validación del formulario de contacto (en el modal)
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
    setIsSendingBudget(true); // Activa el estado de carga

    // 2. Construcción de FormData
    // Se usa FormData porque vamos a enviar un ARCHIVO (logoFile).
    // No se puede usar JSON para enviar archivos.
    const formData = new FormData();

    // Añadimos los datos como pares clave/valor.
    // Los objetos se envían como strings JSON.
    formData.append(
      "product",
      JSON.stringify({ id: product.id, name: product.name })
    );
    // Excluimos el 'logoFile' y 'logoPreview' de la personalización JSON.
    const { logoFile, logoPreview, ...customizationDetails } = customization;
    formData.append("customization", JSON.stringify(customizationDetails));
    formData.append("quantity", quantity);
    formData.append("buyer", JSON.stringify(buyerInfo));

    // 3. Añadimos el archivo (si existe)
    if (logoFile) {
      formData.append("logoFile", logoFile); // 'logoFile' es el objeto File
    }

    // 4. Llamada a la API (fetch)
    try {
      const response = await fetch(`${API_URL}/request-budget`, {
        method: "POST",
        body: formData, // El body es el FormData (no 'headers: Content-Type')
      });

      // 5. Manejo de Respuesta
      if (response.ok) {
        // ÉXITO
        showToast("Solicitud de presupuesto enviada. Te contactaremos pronto.");
        setCustomization({}); // Resetea personalización
        setBuyerInfo({ name: "", email: "", phone: "" }); // Resetea formulario
        setIsBudgetModalOpen(false); // Cierra el modal
      } else {
        // ERROR (del backend)
        const errorData = await response.json();
        showToast(
          `Error al enviar la solicitud: ${
            errorData.details || "Intenta de nuevo."
          }`
        );
      }
    } catch (err) {
      // ERROR (de red/CORS)
      console.error("Error enviando solicitud de presupuesto:", err);
      showToast("Error de conexión al enviar la solicitud.");
    } finally {
      setIsSendingBudget(false); // Desactiva el estado de carga
    }
  };

  // --- 8. PREPARACIÓN DE RENDER ---

  // Combina la imagen principal y las miniaturas en un solo array, filtrando nulos.
  const images = [product.image, ...(product.thumbnails || [])].filter(Boolean);

  // SEO y Metadatos
  const pageTitle = `${product.name} - SellosPro`;
  const pageDescription = `Compra ${
    product.name
  } personalizado en SellosPro. ${product.description?.substring(
    0,
    120
  )}... Calidad profesional en Mar del Plata.`;

  /**
   * Manejador específico para el ColorPicker de las tintas.
   */
  const handleColorChange = (hex) => {
    setCustomization((prev) => ({ ...prev, color: hex }));
  };

  // --- 9. RENDERIZACIÓN (JSX) ---
  return (
    <div className=" py-6 md:py-6">
      {/* SEO */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* --- ESTRUCTURA DE GRID PRINCIPAL (1 o 2 columnas) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* ======================================= */}
          {/* --- COLUMNA 1: IMAGEN E INFORMACIÓN --- */}
          {/* ======================================= */}
          <div>
            {/* Contenedor de Galería de Imagen */}
            <div>
              {/* Imagen Principal (con botón de zoom) */}
              <button
                className="aspect-square bg-white rounded-lg flex items-center justify-center border overflow-hidden relative w-full cursor-pointer hover:opacity-90 transition group"
                onClick={() => setIsModalOpen(true)} // Abre el modal de zoom
              >
                <img
                  src={images[activeImage]} // Muestra la imagen activa
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Icono de Zoom (aparece al hover) */}
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
              {/* Miniaturas (Thumbnails) - solo si hay más de 1 imagen */}
              {images.length > 1 && (
                <div className="flex gap-2 sm:gap-4 mt-4 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)} // Cambia la imagen activa
                      // Estilo condicional para la miniatura activa
                      className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center p-1 border-2 overflow-hidden ${
                        activeImage === index
                          ? "border-red-600 ring-1 ring-red-300" // Activa
                          : "border-gray-200 hover:border-red-400" // Inactiva
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
              )}
              <p className="text-sm text-gray-500 mt-1 text-center italic">
                💡 Haz clic sobre la imagen para verla en tamaño completo.
              </p>
            </div>

            {/* --- Información del Producto (Título, Precio, Descripción) --- */}
            <div>
              <div className="flex flex-row justify-between items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                {/* Precio Condicional */}
                <p className="text-3xl md:text-4xl font-bold text-red-600 my-6">
                  {isKit ? "Precio a cotizar" : `$${product.price.toFixed(2)}`}
                </p>
              </div>
              {/* Descripción (con formato de saltos de línea) */}
              <p className="text-gray-600 mt-2 leading-relaxed whitespace-pre-wrap">
                {" "}
                {/* 'whitespace-pre-wrap' respeta los \n (saltos de línea) */}
                {product.description.split("\n").map((line, index, array) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < array.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>

          {/* =============================================== */}
          {/* --- COLUMNA 2: PERSONALIZACIÓN Y ACCIONES --- */}
          {/* =============================================== */}
          <div className="top-24 h-fit">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                {isKit
                  ? "Completa los datos para cotizar"
                  : "Personaliza tu Sello"}
              </h2>

              {/* -------------------------------------------------- */}
              {/* --- LÓGICA DE PERSONALIZADOR DINÁMICO (El "Cerebro") --- */}
              {/* -------------------------------------------------- */}
              {/*
               * Solo UNO de estos bloques se renderizará,
               * basado en las banderas booleanas del 'useMemo'.
               */}
              {isCustomizable && (
                <Personalizer
                  product={product}
                  customization={customization}
                  setCustomization={setCustomization}
                />
              )}
              {isInk && (
                <ColorPicker
                  colors={product.colors || []}
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

              {/* ---------------------------------- */}
              {/* --- SECCIONES DE CROSS-SELL --- */}
              {/* ---------------------------------- */}

              {/* Sección Almohadilla (Condicional) */}
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
          <img
            src={padProduct.image}
            alt={padProduct.name}
            className="w-16 h-16 object-cover rounded-md bg-white flex-shrink-0 border"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">
              Este producto requiere una almohadilla + tinta para su uso. ¡Añade el kit!
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                {padProduct.name}: ${padProduct.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

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

              {isCustomizable &&
  (() => {
    const inkProduct = products.find((p) => p.id === 24);
    if (!inkProduct) return null;

    const handleAddInk = () => {
      addToCart({ ...inkProduct, qty: 1 });
      showToast(`${inkProduct.name} agregado al carrito`);
    };

    return (
      <div className="mt-6 border-t border-gray-300 pt-4">
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          ¿Necesitas un frasquito para tu sello?
        </h3>

        <div className="flex gap-4 items-center mb-3">
          <img
            src={inkProduct.image}
            alt={inkProduct.name}
            className="w-16 h-16 object-cover rounded-md bg-white flex-shrink-0 border"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">
              Recomendado para mantener tu sello automático en óptimas condiciones.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                {inkProduct.name}: ${inkProduct.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleAddInk}
          className="w-full flex items-center justify-center gap-1 py-2 px-3 bg-[#e30613] text-white text-sm font-medium rounded-md hover:bg-red-700 transition"
        >
          <ShoppingCart size={18} />
          Añadir {inkProduct.name} al Carrito
        </button>
      </div>
    );
  })()}

              {/* ---------------------------------- */}
              {/* --- BOTONES DE ACCIÓN (Lógica Condicional) --- */}
              {/* ---------------------------------- */}
              <div className="flex flex-row items-center gap-4 mt-6">
                {isKit ? (
                  // --- CASO 1: Producto "Kit" (a cotizar) ---
                  <button
                    onClick={handleOpenBudgetModal} // Abre el modal de presupuesto
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                  >
                    <Send size={20} />
                    Solicitar Presupuesto
                  </button>
                ) : (
                  // --- CASO 2: Producto normal (comprable) ---
                  <>
                    {/* Selector de Cantidad */}
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
                      // --- CASO 2a: Modo Edición ---
                      <button
                        onClick={handleUpdateCartItem} // Llama a la función de ACTUALIZAR
                        className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                      >
                        <RefreshCw size={20} />
                        Actualizar Cambios
                      </button>
                    ) : (
                      // --- CASO 2b: Modo Añadir (normal) ---
                      <button
                        onClick={handleAddToCart} // Llama a la función de AÑADIR
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

      {/* ======================= */}
      {/* --- MODALES (Ocultos) --- */}
      {/* ======================= */}

      {/* --- MODAL PARA ZOOM DE IMAGEN --- */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setIsModalOpen(false)} // Cierra al hacer clic fuera
        >
          <div
            className="relative max-w-3xl max-h-[85vh] bg-white rounded-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Evita cierre al hacer clic dentro
          >
            <img
              src={images[activeImage]}
              alt={product.name}
              className="block max-h-[85vh] w-auto object-contain"
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 p-2 bg-white/80 rounded-full text-gray-900 hover:bg-white"
              aria-label="Cerrar imagen"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL PARA SOLICITUD DE PRESUPUESTO --- */}
      {isBudgetModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setIsBudgetModalOpen(false)} // Cierra al hacer clic fuera
        >
          {/* Contenido del Modal */}
          <div
            className="relative bg-white rounded-lg shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()} // Evita cierre
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

            {/* Cuerpo del Modal (Formulario de contacto) */}
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
        </div>
      )}

      {/* Estilos para la animación (si no están globales) */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
