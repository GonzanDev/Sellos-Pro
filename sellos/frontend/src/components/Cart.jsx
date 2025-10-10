import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import { X, ShoppingBag } from "lucide-react";

// Componente para renderizar los detalles de personalización de forma flexible
const CustomizationDetails = ({ customization }) => {
  if (!customization || Object.keys(customization).length === 0) {
    return null;
  }

  // 1. Extraemos los comentarios para tratarlos por separado
  const { comentarios, ...otherDetails } = customization;

  // 2. Filtramos el resto de los detalles que queremos mostrar
  const details = Object.entries(otherDetails).filter(
    ([key, value]) => value && key !== "fileName" && key !== "selectedKit"
  );

  if (details.length === 0 && !comentarios) {
    return null;
  }

  return (
    <div className="mt-2 text-xs text-gray-500 space-y-1 border-t border-gray-200 pt-2">
      {/* 3. Renderizamos los otros detalles primero */}
      {details.map(([key, value]) => {
        switch (key) {
          case "logoPreview":
            return (
              <img
                key={key}
                src={value}
                alt="Logo personalizado"
                className="max-h-12 rounded border mt-1"
              />
            );
          case "color":
            return (
              <p key={key} className="flex items-center gap-2">
                <span className="font-medium capitalize text-gray-600">
                  {key}:
                </span>
                <span
                  className="inline-block w-4 h-4 rounded-full border"
                  style={{ backgroundColor: value }}
                />
              </p>
            );
          default:
            return (
              <p key={key}>
                <span className="font-medium capitalize text-gray-600">
                  {key.replace("line", "Línea ")}:
                </span>{" "}
                {String(value)}
              </p>
            );
        }
      })}
      {/* 4. Si existen comentarios, los renderizamos al final y con el nuevo estilo */}
      {comentarios && (
        <p className="text-gray-600 pt-1">
          <span className="font-medium capitalize text-gray-600">
            Comentarios:
          </span>{" "}
          {String(comentarios)}
        </p>
      )}
    </div>
  );
};

// Componente para el estado de carrito vacío
const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
    <ShoppingBag size={48} className="mb-4 text-gray-300" />
    <h3 className="text-lg font-semibold text-gray-700">
      Tu carrito está vacío
    </h3>
    <p className="text-sm mt-1">Agrega productos para verlos aquí.</p>
  </div>
);

export default function Cart() {
  const {
    isCartOpen,
    cart,
    closeCart,
    removeFromCart,
    updateQty,
    clearCart,
    total = 0,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 transition-opacity duration-300 z-50 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col z-50 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isCartOpen}
      >
        {/* Header del Carrito */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Mi Carrito</h2>
          <button
            onClick={closeCart}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido del Carrito */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <EmptyCart />
          ) : (
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li
                  key={item.cartItemId}
                  className="flex items-start gap-4 py-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-contain rounded-lg border border-gray-200 bg-white"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          AR$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-md font-semibold text-gray-900">
                        AR$ {(item.price * (item.qty || 1)).toFixed(2)}
                      </p>
                    </div>

                    <CustomizationDetails customization={item.customization} />

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQty(item.cartItemId, (item.qty || 1) - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-medium">
                          {item.qty || 1}
                        </span>
                        <button
                          onClick={() =>
                            updateQty(item.cartItemId, (item.qty || 1) + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer del Carrito */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-800">
                Subtotal
              </span>
              <span className="text-2xl font-bold text-gray-900">
                AR$ {total.toFixed(2)}
              </span>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-[#e30613] text-white font-semibold rounded-lg hover:bg-red-700 transition shadow-sm"
              >
                Finalizar Compra
              </button>
              <button
                onClick={closeCart}
                className="w-full py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Seguir Comprando
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
