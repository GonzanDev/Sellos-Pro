import React from "react";

function Cart({ cart, removeFromCart, updateQty }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <section className="py-16 bg-gray-100" id="cart">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-black mb-8 text-center">
          Carrito de Compras
        </h2>
        {cart.length === 0 ? (
          <p className="text-center text-gray-600">Tu carrito está vacío.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
              >
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={item.qty}
                    min="1"
                    onChange={(e) => updateQty(item.id, e.target.value)}
                    className="w-16 border rounded p-1 text-center"
                  />
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-black"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            <div className="text-right font-bold text-lg">Total: ${total}</div>
            <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-black transition w-full">
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Cart;
