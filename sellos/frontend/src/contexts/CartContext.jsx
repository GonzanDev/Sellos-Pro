/**
 * ==============================================================================
 * 🧠 CONTEXTO: Estado Global del Carrito (CartContext.jsx)
 * ==============================================================================
 *
 * Descripción: Este archivo crea y gestiona el estado global del carrito de
 * compras usando React Context.
 *
 * Funcionalidades:
 * 1. Mantiene la lista de productos en el carrito (`cart`).
 * 2. Mantiene el estado del modal del carrito (`isCartOpen`).
 * 3. Persiste el carrito en `localStorage` para que no se pierda al recargar.
 * 4. Provee un hook (`useCart`) para que cualquier componente pueda
 * acceder y modificar el estado del carrito.
 * 5. Provee funciones para (agregar, eliminar, actualizar cantidad, editar ítem, limpiar).
 * 6. Calcula valores derivados (total de ítems, subtotal en ARS).
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

// Crea el Context. El valor `null` inicial es para el chequeo en `useCart`.
const CartContext = createContext(null);

/**
 * 🔗 Hook Personalizado (Hook Consumidor)
 * ------------------------------------------------------------------------------
 * Este es el hook que los componentes usarán para acceder al contexto del carrito.
 * @returns {object} El objeto de valor del contexto (estado y funciones).
 * @throws {Error} Si se usa fuera de un `CartProvider`.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  // Guardrail: Asegura que el hook se use dentro del árbol del Provider.
  if (context === null) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};

// Clave única para guardar el carrito en el Local Storage del navegador.
const CART_LS_KEY = "cart_v1";

/**
 * 🔑 Función Clave: Generador de "Huella Digital" de Personalización
 * ------------------------------------------------------------------------------
 * Esta función es CRUCIAL. Crea un string "huella digital" (key) único para
 * un objeto de personalización.
 *
 * ¿Por qué?
 * Para determinar si dos productos son "idénticos". Un "Sello A" con
 * {line1: 'Hola'} es DIFERENTE a un "Sello A" con {line1: 'Mundo'}.
 *
 * Lógica:
 * 1. Ordena las claves del objeto alfabéticamente.
 * (Esto asegura que {color: 'rojo', line1: 'a'} y {line1: 'a', color: 'rojo'}
 * produzcan la MISMA huella).
 * 2. Filtra cualquier clave que tenga un valor vacío (null, undefined, "").
 * 3. Convierte el objeto ordenado y filtrado a un string JSON.
 *
 * @param {object} customization - El objeto de personalización del producto.
 * @returns {string} Un string JSON que representa la personalización.
 * Ej: '{"color":"#FF0000","line1":"Texto de prueba"}'
 */
const getCustomizationKey = (customization) => {
  if (!customization || Object.keys(customization).length === 0) {
    return "{}"; // Huella para ítems sin personalización.
  }
  // Ordenamos las claves alfabéticamente antes de convertir a string
  return JSON.stringify(
    Object.keys(customization)
      .sort() // 1. Ordena
      .reduce((obj, key) => {
        // 2. Filtra (Ignoramos valores vacíos)
        if (customization[key]) {
          obj[key] = customization[key];
        }
        return obj;
      }, {})
  ); // 3. Convierte a JSON string
};

/**
 * 📦 Componente Proveedor (Provider)
 * ------------------------------------------------------------------------------
 * Este componente envuelve la aplicación (o las partes que necesiten el carrito)
 * y provee el estado y las funciones a través de `CartContext.Provider`.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Los componentes hijos que tendrán acceso al contexto.
 */
export function CartProvider({ children }) {
  /**
   * --------------------------------------------------------------------------
   * ESTADO PRINCIPAL: `cart`
   * --------------------------------------------------------------------------
   * Se inicializa de forma "perezosa" (lazy initialization) con una función
   * que se ejecuta solo en el primer render.
   *
   * Lógica de inicialización:
   * 1. Intenta leer el carrito guardado desde `localStorage`.
   * 2. Si falla o no existe, usa un array vacío `[]`.
   * 3. (MIGRACIÓN/LIMPIEZA): Se asegura que cada ítem cargado tenga un
   * `cartItemId` único. Esto es vital para que `updateQty`, `removeFromCart`
   * y `updateCartItem` funcionen correctamente.
   */
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_LS_KEY);
      const initialCart = saved ? JSON.parse(saved) : [];

      // Aseguramos que cada item, incluso los viejos, tenga un ID único.
      return initialCart.map((item) => ({
        ...item,
        cartItemId: item.cartItemId || crypto.randomUUID(),
      }));
    } catch {
      // Si `localStorage` falla (ej. JSON malformado), resetea.
      return [];
    }
  });

  /**
   * --------------------------------------------------------------------------
   * ESTADO: `isCartOpen`
   * --------------------------------------------------------------------------
   * Controla la visibilidad del modal/sidebar del carrito.
   */
  const [isCartOpen, setCartOpen] = useState(false);

  /**
   * --------------------------------------------------------------------------
   * EFECTO: Persistencia en Local Storage
   * --------------------------------------------------------------------------
   * Este `useEffect` se dispara CADA VEZ que el estado `cart` cambia.
   * Guarda la versión más reciente del carrito en el `localStorage`.
   */
  useEffect(() => {
    localStorage.setItem(CART_LS_KEY, JSON.stringify(cart));
  }, [cart]);

  // --- Funciones para controlar el Modal ---
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  /**
   * --------------------------------------------------------------------------
   * FUNCIÓN: Añadir al Carrito (`addToCart`)
   * --------------------------------------------------------------------------
   * Agrega un producto al carrito.
   * Si un producto IDÉNTICO (mismo ID y misma personalización) ya existe,
   * simplemente SUMA la cantidad.
   * Si es un producto nuevo, lo añade a la lista con un ID único (`cartItemId`).
   *
   * @param {object} productToAdd - El objeto del producto a agregar.
   */
  const addToCart = (productToAdd) => {
    setCart((prevCart) => {
      // 1. Obtiene la "huella digital" del producto a agregar.
      const customizationKeyToAdd = getCustomizationKey(
        productToAdd.customization
      );

      // 2. Busca si ya existe un ítem idéntico.
      const existingItem = prevCart.find(
        (item) =>
          item.id === productToAdd.id && // Mismo ID de producto
          getCustomizationKey(item.customization) === customizationKeyToAdd // Misma personalización
      );

      if (existingItem) {
        // 3.A. SI EXISTE: Incrementa la cantidad.
        return prevCart.map((item) =>
          item.cartItemId === existingItem.cartItemId
            ? { ...item, qty: (item.qty || 1) + (productToAdd.qty || 1) } // Suma la cantidad
            : item
        );
      } else {
        // 3.B. SI ES NUEVO: Lo agrega al array.
        const newCartItem = {
          ...productToAdd,
          cartItemId: crypto.randomUUID(), // Asigna un ID único para ESTA instancia en el carrito.
          qty: productToAdd.qty || 1,
        };
        return [...prevCart, newCartItem];
      }
    });
    openCart(); // Abre el carrito para mostrar el ítem agregado.
  };

  /**
   * --------------------------------------------------------------------------
   * FUNCIÓN: Eliminar del Carrito (`removeFromCart`)
   * --------------------------------------------------------------------------
   * Elimina un ítem del carrito usando su ID único (`cartItemId`).
   *
   * @param {string} cartItemId - El ID único del ítem en el carrito.
   */
  const removeFromCart = (cartItemId) =>
    setCart((prev) => prev.filter((p) => p.cartItemId !== cartItemId));

  /**
   * --------------------------------------------------------------------------
   * FUNCIÓN: Actualizar Cantidad (`updateQty`)
   * --------------------------------------------------------------------------
   * Actualiza la cantidad de un ítem específico.
   * Si la cantidad llega a ser 0 o menos, elimina el ítem del carrito.
   *
   * @param {string} cartItemId - El ID único del ítem en el carrito.
   * @param {number} qty - La nueva cantidad.
   */
  const updateQty = (cartItemId, qty) => {
    setCart((prev) => {
      // Si la cantidad es menor a 1, filtramos (eliminamos) el producto.
      if (qty < 1) {
        return prev.filter((p) => p.cartItemId !== cartItemId);
      }
      // Si es 1 o más, actualizamos la cantidad.
      return prev.map((p) => (p.cartItemId === cartItemId ? { ...p, qty } : p));
    });
  };

  /**
   * --------------------------------------------------------------------------
   * ¡NUEVA FUNCIÓN AÑADIDA!
   * FUNCIÓN: Actualizar Ítem del Carrito (`updateCartItem`)
   * --------------------------------------------------------------------------
   * Esta función es para EDITAR un ítem existente (ej. desde la pág. de producto).
   * Reemplaza los datos de un ítem existente (identificado por `cartItemId`)
   * con los nuevos datos proporcionados.
   *
   * @param {string} cartItemId - El ID del ítem a actualizar.
   * @param {object} newProductData - Los nuevos datos (ej. { customization: {...}, qty: 3 }).
   */
  const updateCartItem = (cartItemId, newProductData) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, ...newProductData } // Sobrescribe el item con los nuevos datos
          : item
      )
    );
    openCart(); // Abrimos el carrito para mostrar el cambio
  };

  /**
   * --------------------------------------------------------------------------
   * FUNCIÓN: Limpiar Carrito (`clearCart`)
   * --------------------------------------------------------------------------
   * Vacía completamente el carrito.
   */
  const clearCart = () => setCart([]);

  /**
   * --------------------------------------------------------------------------
   * VALORES MEMORIZADOS: `cartCount` y `total`
   * --------------------------------------------------------------------------
   * Se usan con `useMemo` para optimizar.
   * Estas sumas solo se recalculan si el array `cart` cambia.
   */

  // Calcula el número total de ítems (sumando cantidades).
  const cartCount = useMemo(
    () => cart.reduce((s, i) => s + (i.qty || 1), 0),
    [cart]
  );

  // Calcula el subtotal (precio * cantidad) de todo el carrito.
  const total = useMemo(
    () => cart.reduce((s, i) => s + i.price * (i.qty || 1), 0),
    [cart]
  );

  /**
   * --------------------------------------------------------------------------
   * VALOR DEL CONTEXTO
   * --------------------------------------------------------------------------
   * Este es el objeto que se pone a disposición de todos los componentes
   * que usen el hook `useCart()`.
   */
  const value = {
    cart, // El array de productos
    addToCart, // Función para añadir
    removeFromCart, // Función para eliminar
    updateQty, // Función para cambiar cantidad
    clearCart, // Función para vaciar
    isCartOpen, // Estado del modal (abierto/cerrado)
    openCart, // Función para abrir modal
    closeCart, // Función para cerrar modal
    cartCount, // Número total de ítems
    total, // Costo total (subtotal)
    updateCartItem, // <-- Exponemos la nueva función de "editar"
  };

  // Retorna el Provider de React, pasando el `value` a todos los `children`.
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
