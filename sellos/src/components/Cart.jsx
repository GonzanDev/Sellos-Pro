import React from "react";

export default function Cart({
  isOpen,
  cart = [],
  onClose,
  removeFromCart,
  updateQty,
  onCheckout,
  clearCart,
}) {
  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h3 className="text-lg font-semibold">Carrito</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-red-600"
            >
              Vaciar
            </button>
            <button
              onClick={onClose}
              className="px-2 py-1 rounded hover:bg-gray-100"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-160px)] space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              Tu carrito está vacío
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-400">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-16 object-contain"
                    />
                  ) : (
                    "Img"
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        AR$ {item.price}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-red-600">
                      AR$ {item.price * (item.qty || 1)}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, (item.qty || 1) - 1)}
                      className="px-2 py-1 bg-gray-100 rounded"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.qty || 1}
                      min="1"
                      onChange={(e) =>
                        updateQty(
                          item.id,
                          Math.max(1, Number(e.target.value || 1))
                        )
                      }
                      className="w-14 text-center border rounded px-2 py-1"
                    />
                    <button
                      onClick={() => updateQty(item.id, (item.qty || 1) + 1)}
                      className="px-2 py-1 bg-gray-100 rounded"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-sm text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t px-4 py-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-lg font-bold">AR$ {total}</div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 border rounded hover:bg-gray-50"
            >
              Seguir comprando
            </button>
            <button
              onClick={onCheckout}
              className="flex-1 py-2 bg-[#e30613] text-white rounded hover:bg-black transition"
            >
              Pagar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
