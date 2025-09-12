import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Catalog from "./components/Catalog";
import Personalizer from "./components/Personalizer";
import Cart from "./components/Cart";
import FAQ from "./components/FAQ";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import products from "./data/products";

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQty = (id, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Number(qty) } : item
      )
    );
  };

  return (
    <div className="bg-gray-50 text-gray-900">
      <Header cartCount={cart.length} />
      <Hero />
      <Catalog products={products} addToCart={addToCart} />
      <Personalizer />
      <Cart cart={cart} removeFromCart={removeFromCart} updateQty={updateQty} />
      <FAQ />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;
