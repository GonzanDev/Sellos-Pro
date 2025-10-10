import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { useProducts } from "../hooks/useProducts"; // Importamos el hook para acceder a los productos

export default function Header({ openCart, cartCount }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Obtenemos todos los productos para poder filtrarlos
  const { products } = useProducts();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchPreviewOpen, setIsSearchPreviewOpen] = useState(false);

  // Efecto para filtrar productos mientras el usuario escribe
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const filtered = products
      .filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5); // Mostramos hasta 5 resultados
    setSearchResults(filtered);
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
      setIsSearchPreviewOpen(false);
      setSearchQuery("");
    }
  };

  const handleResultClick = () => {
    setIsSearchPreviewOpen(false);
    setSearchQuery("");
  };

  const navLinkClass = ({ isActive }) =>
    `font-medium transition ${
      isActive ? "text-red-600" : "text-gray-800 hover:text-red-600"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `text-lg font-medium text-left ${
      isActive ? "text-red-600" : "text-gray-800"
    }`;

  return (
    <header className="bg-white text-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-red-600">
            SellosPro
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClass}>
              Inicio
            </NavLink>
            <NavLink to="/catalog" className={navLinkClass}>
              Catálogo
            </NavLink>
            <NavLink to="/nosotros" className={navLinkClass}>
              Nosotros
            </NavLink>
            <NavLink to="/contacto" className={navLinkClass}>
              Contacto
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            {/* --- BÚSQUEDA EN DESKTOP CON VISTA PREVIA --- */}
            <div className="hidden md:block relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar sellos..."
                className="pl-10 pr-4 py-2 w-48 border rounded-full focus:outline-none focus:ring-1 focus:ring-current transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => setIsSearchPreviewOpen(true)}
                onBlur={() =>
                  setTimeout(() => setIsSearchPreviewOpen(false), 150)
                } // Delay para permitir click
              />
              {isSearchPreviewOpen && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <ul className="divide-y divide-gray-100">
                    {searchResults.map((product) => (
                      <li key={product.id}>
                        <Link
                          to={`/product/${product.id}`}
                          onClick={handleResultClick}
                          className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg transition"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-contain rounded-md bg-gray-100"
                          />
                          <div>
                            <p className="font-medium text-sm text-gray-800">
                              {product.name}
                            </p>
                            <p className="text-sm text-red-600">
                              ${product.price.toFixed(2)}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={openCart}
              className="relative p-2 rounded-full hover:bg-gray-100"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Menú Overlay para Mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-bold text-lg">Menú</h2>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-6">
            <nav className="flex flex-col space-y-6">
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                Inicio
              </NavLink>
              <NavLink
                to="/catalog"
                onClick={() => setMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                Catálogo
              </NavLink>
              <NavLink
                to="/nosotros"
                onClick={() => setMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                Nosotros
              </NavLink>
              <NavLink
                to="/contacto"
                onClick={() => setMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                Contacto
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
