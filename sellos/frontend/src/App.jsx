import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Catalog from "./components/Catalog";
import Personalizer from "./components/Personalizer";
import FAQ from "./components/FAQ";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import Toast from "./components/Toast";

const CART_LS_KEY = "cart_v1";

export default function App() {
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_LS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setCartOpen] = useState(false);

  // Cargar productos desde el backend
  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error cargando productos", err));
  }, []);

  // Persistencia carrito
  useEffect(() => {
    localStorage.setItem(CART_LS_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const ex = prev.find((p) => p.id === product.id);

      if (ex) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: (p.qty || 1) + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((p) => p.id !== id));

  const updateQty = (id, qty) =>
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))
    );

  const clearCart = () => setCart([]);

  const checkout = async () => {
    const res = await fetch("http://localhost:4000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header openCart={() => setCartOpen(true)} cartCount={cart.length} />
      <main>
        <Hero />
        <Catalog products={products} addToCart={addToCart} />
        <Personalizer />
        <FAQ />
        <ContactForm />
      </main>
      <Cart
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        removeFromCart={removeFromCart}
        updateQty={updateQty}
        clearCart={clearCart}
        onCheckout={checkout}
      />
      <Footer />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
