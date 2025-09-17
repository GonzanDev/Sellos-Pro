import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export default function Header({ openCart, cartCount }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScroll = (id) => {
    if (location.pathname !== "/") {
      // Si no estamos en la landing, redirigimos primero
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-2xl font-bold text-red-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          SellosPro
        </div>

        {/* Links */}
        <nav className="hidden md:flex space-x-6 text-lg">
          <button
            onClick={() => handleScroll("hero")}
            className="hover:text-red-500"
          >
            Inicio
          </button>
          <Link to="/catalog" className="hover:text-red-500">
            Catálogo
          </Link>
          <button
            onClick={() => handleScroll("personalizer")}
            className="hover:text-red-500"
          >
            Personalizer
          </button>
          <button
            onClick={() => handleScroll("faq")}
            className="hover:text-red-500"
          >
            FAQ
          </button>
          <button
            onClick={() => handleScroll("contact")}
            className="hover:text-red-500"
          >
            Contacto
          </button>
        </nav>

        {/* Carrito */}
        <button
          onClick={openCart}
          className="relative flex items-center hover:text-red-500"
        >
          <ShoppingCart size={28} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
