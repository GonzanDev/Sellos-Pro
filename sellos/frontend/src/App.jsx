import React, { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import Catalog from "./components/Catalog";
import Personalizer from "./components/Personalizer";
import FAQ from "./components/FAQ";
import ContactForm from "./components/ContactForm";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import Toast from "./components/Toast";
import products from "./data/products";

const CART_LS_KEY = "sellospro_cart_v1";

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const sectionsRef = useRef({});

  // refs de secciones
  useEffect(() => {
    sectionsRef.current = {
      hero: document.getElementById("hero"),
      catalog: document.getElementById("catalog"),
      personalizer: document.getElementById("personalizer"),
      faq: document.getElementById("faq"),
      contact: document.getElementById("contact"),
    };
  }, []);

  // Estado inicial con función → carga desde localStorage
  useState(() => {
    try {
      const raw = localStorage.getItem(CART_LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem(CART_LS_KEY, JSON.stringify(cart));
  }, [cart]);

  // toast ahora dura 3s
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // funciones carrito
  const addToCart = (product) => {
    setCart((prev) => {
      const ex = prev.find((p) => p.id === product.id);
      if (ex) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
    setToast(`${product.name} agregado al carrito ✅`);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))
    );
  };

  const clearCart = () => setCart([]);

  // checkout → MP backend
  const onCheckout = async () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/create_preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      const data = await res.json();
      if (data.id) {
        window.open(
          `https://www.mercadopago.com/checkout/v1/redirect?pref_id=${data.id}`,
          "_blank"
        );
      }
    } catch (err) {
      console.error(err);
      alert("Error al iniciar el pago");
    }
  };

  // scroll con animación
  const scrollToSection = (id) => {
    const el = sectionsRef.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.classList.remove("section-focus");
    void el.offsetWidth;
    el.classList.add("section-focus");
    setTimeout(() => el.classList.remove("section-focus"), 900);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        openCart={() => setCartOpen(true)}
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        onNavigate={scrollToSection}
      />

      <main>
        <section id="hero">
          <Hero />
        </section>
        <section id="catalog" className="pt-6">
          <Catalog products={products} addToCart={addToCart} />
        </section>
        <section id="personalizer" className="pt-6">
          <Personalizer />
        </section>
        <section id="faq" className="pt-6">
          <FAQ />
        </section>
        <section id="contact" className="pt-6">
          <ContactForm />
        </section>
      </main>

      <Cart
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        removeFromCart={removeFromCart}
        updateQty={updateQty}
        onCheckout={onCheckout}
        clearCart={clearCart}
      />

      <Footer />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
