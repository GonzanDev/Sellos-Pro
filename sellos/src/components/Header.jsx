import React, { useState } from "react";
import { ShoppingCart, Menu } from "lucide-react";

function Header({ cartCount }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="SellosPro" className="h-10" />
          <span className="font-bold text-lg">SellosPro</span>
        </div>

        <nav className="hidden md:flex space-x-6">
          <a href="#catalog" className="hover:text-red-600">
            Catálogo
          </a>
          <a href="#personalizer" className="hover:text-red-600">
            Personalizar
          </a>
          <a href="#faq" className="hover:text-red-600">
            FAQ
          </a>
          <a href="#contact" className="hover:text-red-600">
            Contacto
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <ShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full px-1">
                {cartCount}
              </span>
            )}
          </div>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            <Menu />
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden bg-black flex flex-col p-4 space-y-2">
          <a href="#catalog" className="hover:text-red-600">
            Catálogo
          </a>
          <a href="#personalizer" className="hover:text-red-600">
            Personalizar
          </a>
          <a href="#faq" className="hover:text-red-600">
            FAQ
          </a>
          <a href="#contact" className="hover:text-red-600">
            Contacto
          </a>
        </nav>
      )}
    </header>
  );
}

export default Header;
