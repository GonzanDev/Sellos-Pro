/**
 * ==============================================================================
 * ⬆️ COMPONENTE: Encabezado (Header.jsx)
 * ==============================================================================
 *
 * Descripción: Renderiza la barra de navegación principal del sitio.
 * Es un componente 'sticky' (se mantiene fijo en la parte superior).
 *
 * Responsabilidades:
 * 1. Mostrar el logo/marca (Link a 'Inicio').
 * 2. Mostrar la navegación principal (Escritorio y Móvil).
 * 3. Integrar un componente de Búsqueda en Vivo con previsualización.
 * 4. Mostrar el ícono del carrito con un contador de ítems.
 * 5. Manejar el estado del menú móvil (abierto/cerrado).
 *
 * @param {object} props
 * @param {function} props.openCart - Función (del CartContext) para abrir el modal del carrito.
 * @param {number} props.cartCount - Número total de ítems en el carrito (para el 'badge').
 */
import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Search } from "lucide-react";
import { useProducts } from "../hooks/useProducts"; // Importamos el hook para acceder a los productos

export default function Header({ openCart, cartCount }) {
  // --- ESTADO ---
  // Estado para el menú móvil (hamburguesa).
  const [isMenuOpen, setMenuOpen] = useState(false);
  // Estado para el texto en la barra de búsqueda.
  const [searchQuery, setSearchQuery] = useState("");
  // Hook de React Router para navegar programáticamente (usado en la búsqueda).
  const navigate = useNavigate();

  // --- LÓGICA DE BÚSQUEDA ---
  // Obtenemos todos los productos desde nuestro hook (probablemente un Context).
  const { products } = useProducts();
  // Estado para guardar los resultados filtrados de la búsqueda.
  const [searchResults, setSearchResults] = useState([]);
  // Estado para controlar la visibilidad del dropdown de previsualización.
  const [isSearchPreviewOpen, setIsSearchPreviewOpen] = useState(false);

  /**
   * --------------------------------------------------------------------------
   * 🧠 EFECTO: Búsqueda "en vivo" (Search-as-you-type)
   * --------------------------------------------------------------------------
   * Este efecto se dispara cada vez que el usuario escribe en la barra de
   * búsqueda (`searchQuery`) o cuando la lista de productos cambia.
   */
  useEffect(() => {
    // Si la búsqueda está vacía, limpia los resultados.
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    // Filtra la lista completa de productos.
    const filtered = products
      .filter((product) =>
        // Compara nombres en minúsculas.
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5); // Limita los resultados a los primeros 5.

    setSearchResults(filtered);
  }, [searchQuery, products]); // Dependencias: se re-ejecuta si cambian.

  /**
   * --------------------------------------------------------------------------
   * MANEJADOR: `handleSearch` (Búsqueda por "Enter")
   * --------------------------------------------------------------------------
   * Se activa al presionar una tecla en el input de búsqueda.
   * Si la tecla es "Enter" y hay texto, navega a la página de catálogo
   * completa, pasando la búsqueda como un parámetro de URL.
   *
   * @param {React.KeyboardEvent<HTMLInputElement>} e - El evento de teclado.
   */
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      // Navega a: /catalog?search=texto_buscado
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false); // Cierra el menú móvil (si estuviera abierto)
      setIsSearchPreviewOpen(false); // Cierra la previsualización
      setSearchQuery(""); // Limpia el input
    }
  };

  /**
   * --------------------------------------------------------------------------
   * MANEJADOR: `handleResultClick` (Clic en Previsualización)
   * --------------------------------------------------------------------------
   * Se activa al hacer clic en un ítem de la previsualización.
   * Cierra la previsualización y limpia el input.
   * (La navegación la realiza el <Link> en el que se hizo clic).
   */
  const handleResultClick = () => {
    setIsSearchPreviewOpen(false);
    setSearchQuery("");
  };

  // --- FUNCIONES DE ESTILO (Helpers) ---
  /**
   * Función helper para `NavLink` (Escritorio).
   * Asigna clases condicionales si el enlace está activo.
   */
  const navLinkClass = ({ isActive }) =>
    `font-medium transition ${
      isActive ? "text-red-600" : "text-gray-800 hover:text-red-600"
    }`;

  /**
   * Función helper para `NavLink` (Móvil).
   */
  const mobileNavLinkClass = ({ isActive }) =>
    `text-lg font-medium text-left ${
      isActive ? "text-red-600" : "text-gray-800"
    }`;

  // --- RENDERIZACIÓN ---
  return (
    // 'sticky top-0 z-50': Mantiene el header fijo en la parte superior.
    <header className="bg-white text-gray-800 shadow-sm sticky top-0 z-50">
      {/* Contenedor principal centrado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barra principal (Logo, Nav, Iconos) */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-red-600">
            Sellospro
          </Link>

          {/* Navegación de Escritorio ('md:flex' la oculta en móvil) */}
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

          {/* Iconos (Búsqueda, Carrito, Menú Móvil) */}
          <div className="flex items-center gap-4">
            {/* --- 🔍 BÚSQUEDA EN DESKTOP CON VISTA PREVIA --- */}
            <div className="hidden md:block relative">
              {/* Icono de Lupa (posicionado absoluto) */}
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
                onKeyDown={handleSearch} // Para "Enter"
                onFocus={() => setIsSearchPreviewOpen(true)} // Abre el dropdown
                onBlur={() =>
                  // Cierra el dropdown con un delay.
                  // Esto es VITAL para permitir que el 'onClick'
                  // en un resultado se registre antes de que desaparezca.
                  setTimeout(() => setIsSearchPreviewOpen(false), 150)
                }
              />
              {/* --- Dropdown de Previsualización --- */}
              {isSearchPreviewOpen && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <ul className="divide-y divide-gray-100">
                    {searchResults.map((product) => (
                      <li key={product.id}>
                        {/* Cada resultado es un Link a la página del producto */}
                        <Link
                          to={`/product/${product.id}`}
                          onClick={handleResultClick} // Limpia la búsqueda
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

            {/* --- 🛒 Botón de Carrito --- */}
            <button
              onClick={openCart} // Prop recibida del padre
              className="relative p-2 rounded-full hover:bg-gray-100"
            >
              <ShoppingCart size={22} />
              {/* Badge de contador (solo visible si cartCount > 0) */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* --- 🍔 Botón Menú Móvil (Hamburguesa) --- */}
            {/* 'md:hidden' lo muestra solo en móvil */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------- */}
      {/* 📱 Menú Overlay para Mobile       */}
      {/* ---------------------------------- */}
      {/* 1. Fondo Oscuro (Overlay) */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* 2. Panel Deslizante (Menú) */}
        <div
          className={`absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            // Controla el slide (entrada/salida)
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header del panel móvil */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-bold text-lg">Menú</h2>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
          {/* Navegación móvil */}
          <div className="p-6">
            <nav className="flex flex-col space-y-6">
              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)} // Cierra el menú al navegar
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
