import React, { useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Header from "./components/Header";
import Hero from "./components/Hero";
import CatalogPreview from "./components/CatalogPreview";
import FAQ from "./components/FAQ";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import Toast from "./components/Toast";
import CatalogPage from "./pages/CatalogPage";

import KitLogo from "./pages/KitLogo";
import ProductPage from "./pages/ProductPage";

const CART_LS_KEY = "cart_v1";

function Home({ products, addToCart }) {
  const sectionsRef = useRef({});

  useEffect(() => {
    sectionsRef.current = {
      hero: document.getElementById("hero"),
      catalog: document.getElementById("catalog"),
      personalizer: document.getElementById("personalizer"),
      faq: document.getElementById("faq"),
      contact: document.getElementById("contact"),
    };
  }, []);

  const scrollToSection = (id) => {
    const el = sectionsRef.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <main className="flex-1">
      <section id="hero">
        <Hero />
      </section>

      <section id="catalog" className="pt-6">
        {/* Vista previa de catálogo */}
        <CatalogPreview products={products.slice(0, 3)} addToCart={addToCart} />
      </section>

      <section id="faq" className="pt-6">
        <FAQ />
      </section>

      <section id="contact" className="pt-6">
        <ContactForm />
      </section>
    </main>
  );
}

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

  // Cargar productos desde backend
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
    setToast(`${product.name} agregado al carrito`);
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
    if (data.init_point) {
      window.location.href = data.init_point; // Redirigir a MercadoPago
    } else {
      alert("Error iniciando pago");
    }
  };
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header
          openCart={() => setCartOpen(true)}
          cartCount={cart.reduce((s, i) => s + (i.qty || 1), 0)}
        />

        {/* Contenido principal crece */}
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={<Home products={products} addToCart={addToCart} />}
            />
            <Route
              path="/catalog"
              element={
                <CatalogPage products={products} addToCart={addToCart} />
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProductPage products={products} addToCart={addToCart} />
              }
            />
            <Route
              path="/KitLogo"
              element={<KitLogo products={products} addToCart={addToCart} />}
            />
          </Routes>
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

        {toast && (
          <Toast
            message={toast}
            onClose={() => setToast(null)}
            position="left"
          />
        )}
      </div>
    </Router>
  );
}
