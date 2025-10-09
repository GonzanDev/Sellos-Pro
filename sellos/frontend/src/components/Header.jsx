import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";

export default function Header({ openCart, cartCount }) {
  const navigate = useNavigate();

  return (
    <header className="bg-white text-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-red-600">
          SellosPro
        </Link>

        {/* Links de Navegación */}
        <nav className="hidden md:flex items-center gap-6 text-base font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-red-600" : "hover:text-red-600 transition"
            }
          >
            Inicio
          </NavLink>
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              isActive ? "text-red-600" : "hover:text-red-600 transition"
            }
          >
            Catálogo
          </NavLink>
          <NavLink
            to="/faq"
            className={({ isActive }) =>
              isActive ? "text-red-600" : "hover:text-red-600 transition"
            }
          >
            Nosotros
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "text-red-600" : "hover:text-red-600 transition"
            }
          >
            Contacto
          </NavLink>
        </nav>

        {/* Búsqueda y Carrito */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar sellos..."
              className="pl-10 pr-4 py-2 w-48 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            onClick={openCart}
            className="relative flex items-center hover:text-red-600 transition"
          >
            <ShoppingCart size={28} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
