import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

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
// Esto nos permite comparar dos personalizaciones de forma fiable, incluso si
// las propiedades están en un orden diferente.
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
      // Aseguramos que cada item, incluso los viejos, tenga un ID único para poder borrarlo.
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
        // Si ya existe un producto IDÉNTICO (misma personalización), incrementamos la cantidad
        return prevCart.map((item) =>
          item.cartItemId === existingItem.cartItemId
            ? { ...item, qty: (item.qty || 1) + 1 }
            : item
        );
      } else {
        // Si es nuevo o tiene una personalización diferente, lo agregamos como un item nuevo.
        const newCartItem = {
          ...productToAdd,
          cartItemId: crypto.randomUUID(), // Asignamos un ID único a esta entrada del carrito
          qty: 1,
        };
        return [...prevCart, newCartItem];
      }
    });
    openCart();
  };

  // Ahora, para eliminar y actualizar, usamos el ID único del carrito (cartItemId),
  // lo que evita cualquier ambigüedad.
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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
