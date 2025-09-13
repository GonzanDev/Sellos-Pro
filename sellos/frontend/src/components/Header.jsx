import React from "react";
import { ShoppingCart, Menu } from "lucide-react";

export default function Header({ openCart, cartCount = 0, onNavigate }) {
  // mobile menu simple
  const [open, setOpen] = React.useState(false);

  const go = (id) => {
    if (onNavigate) onNavigate(id);
    setOpen(false);
  };

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="SellosPro" className="h-10" />
          <span className="font-bold text-lg">SellosPro</span>
        </div>

        <nav className="hidden md:flex gap-6">
          <button onClick={() => go("hero")} className="hover:text-[#e30613]">
            Inicio
          </button>
          <button
            onClick={() => go("catalog")}
            className="hover:text-[#e30613]"
          >
            Catálogo
          </button>
          <button
            onClick={() => go("personalizer")}
            className="hover:text-[#e30613]"
          >
            Personalizar
          </button>
          <button onClick={() => go("faq")} className="hover:text-[#e30613]">
            FAQ
          </button>
          <button
            onClick={() => go("contact")}
            className="hover:text-[#e30613]"
          >
            Contacto
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            className="relative px-3 py-2 rounded hover:bg-white/5 transition"
          >
            <ShoppingCart />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full px-1 text-white">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            <Menu />
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden bg-black px-4 pb-4 space-y-2">
          <button
            onClick={() => go("hero")}
            className="block w-full text-left hover:text-[#e30613] py-2"
          >
            Inicio
          </button>
          <button
            onClick={() => go("catalog")}
            className="block w-full text-left hover:text-[#e30613] py-2"
          >
            Catálogo
          </button>
          <button
            onClick={() => go("personalizer")}
            className="block w-full text-left hover:text-[#e30613] py-2"
          >
            Personalizar
          </button>
          <button
            onClick={() => go("faq")}
            className="block w-full text-left hover:text-[#e30613] py-2"
          >
            FAQ
          </button>
          <button
            onClick={() => go("contact")}
            className="block w-full text-left hover:text-[#e30613] py-2"
          >
            Contacto
          </button>
        </nav>
      )}
    </header>
  );
}
