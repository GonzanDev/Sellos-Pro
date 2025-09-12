import React, { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import Catalog from "./components/Catalog";
import Personalizer from "./components/Personalizer";
import FAQ from "./components/FAQ";
import ContactForm from "./components/ContactForm";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import products from "./data/products";

/**
 * KEY: localStorage key para persistencia del carrito
 */
const CART_LS_KEY = "sellospro_cart_v1";

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const sectionsRef = useRef({});

  // Inicializar refs para secciones
  useEffect(() => {
    sectionsRef.current = {
      hero: document.getElementById("hero"),
      catalog: document.getElementById("catalog"),
      personalizer: document.getElementById("personalizer"),
      faq: document.getElementById("faq"),
      contact: document.getElementById("contact"),
    };
  }, []);

  // Cargar carrito desde localStorage al inicio
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_LS_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch (e) {
      console.warn("No se pudo cargar carrito desde localStorage", e);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem(CART_LS_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("No se pudo guardar carrito en localStorage", e);
    }
  }, [cart]);

  // Funciones del carrito
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
    setCartOpen(true); // abrir drawer cuando agregan
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

  // Checkout stub (a integrar con backend / MercadoPago luego)
  const onCheckout = () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    // ejemplo: llamar a backend -> crear preferencia -> redirigir
    alert("Checkout demo: implementar integración con backend / MercadoPago.");
  };

  // Scroll suavizado + animación puntual en la sección objetivo
  const scrollToSection = (id) => {
    const el = sectionsRef.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // Añadir clase temporal para animación, removerla después
    el.classList.remove("section-focus");
    // forced reflow para reiniciar animación si es necesario
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
    </div>
  );
}
