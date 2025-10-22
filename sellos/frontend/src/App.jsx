import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Contexto y Hooks
import { CartProvider, useCart } from "./contexts/CartContext";

// Componentes
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import Toast from "./components/Toast";

// Páginas
import Home from "./pages/Home";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import FAQPage from "./pages/FAQPage";
import ContactPage from "./pages/ContactPage";
import SuccessPage from "./pages/SuccesPage";
import FailurePage from "./pages/FailurePage";
import OrderStatusPage from "./pages/OrderStatusPage";
import { useSearchParams } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get("status");

  // Si el parámetro 'status' no es 'approved', redirigimos al inicio.
  if (paymentStatus !== "approved") {
    return <Navigate to="/" replace />;
  }

  // Si el pago fue aprobado, mostramos la página de éxito.
  return children;
}

// Componente interno para tener acceso a los contextos
function AppContent() {
  const { cartCount, openCart } = useCart();
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header openCart={openCart} cartCount={cartCount} />

      <main className="flex-1">
        <Routes>
          {/* Las páginas ahora son más limpias y no necesitan tantas props */}
          <Route path="/" element={<Home showToast={showToast} />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route
            path="/product/:id"
            element={<ProductPage showToast={showToast} />}
          />
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* --- NUEVAS RUTAS AÑADIDAS --- */}
          <Route path="/nosotros" element={<FAQPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <SuccessPage />
              </ProtectedRoute>
            }
          />
          <Route path="/failure" element={<FailurePage />} />
          <Route path="/order/:orderId" element={<OrderStatusPage />} />
        </Routes>
      </main>

      <Cart />
      <Footer />

      {toast && (
        <Toast message={toast} onClose={() => setToast(null)} position="left" />
      )}
    </div>
  );
}

// Envoltura principal con Router y Proveedor de Contexto
export default function App() {
  return (
    <Router>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </Router>
  );
}
