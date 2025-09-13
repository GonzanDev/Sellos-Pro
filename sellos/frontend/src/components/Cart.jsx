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
      {/* Backdrop → sin blur, solo overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl transform transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">Carrito</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="p-5 overflow-y-auto h-[calc(100%-180px)] space-y-5">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              Tu carrito está vacío
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
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
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, (item.qty || 1) - 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
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
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer fijo con botones visibles siempre */}
        <div className="sticky bottom-0 bg-white border-t px-5 py-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total</span>
            <span className="text-xl font-bold">AR$ {total}</span>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={onCheckout}
              className="w-full py-3 bg-[#e30613] text-white rounded-lg hover:bg-black transition"
            >
              Pagar
            </button>
            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="flex-1 py-2 border rounded hover:bg-gray-50"
              >
                Vaciar
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 border rounded hover:bg-gray-50"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
