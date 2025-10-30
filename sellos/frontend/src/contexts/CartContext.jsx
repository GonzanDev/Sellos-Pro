import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
// No necesitamos 'uuid' ya que usamos 'crypto.randomUUID()'
// import { v4 as uuidv4 } from "uuid";

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};

const CART_LS_KEY = "cart_v1";

// Función CLAVE: Crea una "huella digital" para un objeto de personalización.
const getCustomizationKey = (customization) => {
  if (!customization || Object.keys(customization).length === 0) {
    return "{}";
  }
  // Ordenamos las claves alfabéticamente antes de convertir a string
  return JSON.stringify(
    Object.keys(customization)
      .sort()
      .reduce((obj, key) => {
        // Ignoramos valores vacíos para no crear items diferentes innecesariamente
        if (customization[key]) {
          obj[key] = customization[key];
        }
        return obj;
      }, {})
  );
};

export function CartProvider({ children }) {
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
      return [];
    }
  });

  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_LS_KEY, JSON.stringify(cart));
  }, [cart]);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const addToCart = (productToAdd) => {
    setCart((prevCart) => {
      const customizationKeyToAdd = getCustomizationKey(
        productToAdd.customization
      );
      const existingItem = prevCart.find(
        (item) =>
          item.id === productToAdd.id &&
          getCustomizationKey(item.customization) === customizationKeyToAdd
      );

      if (existingItem) {
        // Si ya existe un producto IDÉNTICO, incrementamos la cantidad
        return prevCart.map((item) =>
          item.cartItemId === existingItem.cartItemId
            ? { ...item, qty: (item.qty || 1) + (productToAdd.qty || 1) } // Sumamos la cantidad
            : item
        );
      } else {
        // Si es nuevo, lo agregamos como un item nuevo.
        const newCartItem = {
          ...productToAdd,
          cartItemId: crypto.randomUUID(), // Asignamos un ID único
          qty: productToAdd.qty || 1, // Usamos la cantidad del producto (para la pág. de producto)
        };
        return [...prevCart, newCartItem];
      }
    });
    openCart();
  };

  // Usamos el ID único del carrito (cartItemId)
  const removeFromCart = (cartItemId) =>
    setCart((prev) => prev.filter((p) => p.cartItemId !== cartItemId));

  const updateQty = (cartItemId, qty) => {
    setCart((prev) => {
      if (qty < 1) {
        return prev.filter((p) => p.cartItemId !== cartItemId);
      }
      return prev.map((p) => (p.cartItemId === cartItemId ? { ...p, qty } : p));
    });
  };

  // --- ¡NUEVA FUNCIÓN AÑADIDA! ---
  // Esta función actualiza un item existente en el carrito (identificado por cartItemId)
  // con los nuevos datos que le pasamos.
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

  const clearCart = () => setCart([]);

  const cartCount = useMemo(
    () => cart.reduce((s, i) => s + (i.qty || 1), 0),
    [cart]
  );
  const total = useMemo(
    () => cart.reduce((s, i) => s + i.price * (i.qty || 1), 0),
    [cart]
  );

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
    cartCount,
    total,
    updateCartItem, // <-- Exponemos la nueva función
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
