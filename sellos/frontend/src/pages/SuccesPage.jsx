import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useCart } from "../contexts/CartContext";

export default function SuccessPage() {
  const { clearCart, cart, total } = useCart();
  const [searchParams] = useSearchParams();

  // Obtenemos los datos de la URL que nos devuelve MercadoPago
  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");

  // Limpiamos el carrito solo una vez cuando la página carga
  useEffect(() => {
    // Solo limpiamos si el estado es 'approved' para evitar vaciar el carrito si el usuario recarga
    if (status === "approved") {
      clearCart();
    }
  }, [status, clearCart]);

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white p-8 sm:p-12 rounded-xl shadow-lg">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            ¡Gracias por tu pedido!
          </h1>
          <p className="mt-2 text-md text-gray-600">
            Hemos recibido tu pedido y lo estamos procesando. Recibirás una
            notificación por correo electrónico con los detalles.
          </p>
        </div>

        <div className="mt-8 bg-gray-100 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">Número de pedido</p>
          <p className="text-lg font-mono font-semibold text-gray-800 tracking-wider">
            {paymentId ? `MP-${paymentId}` : "SP-123456789"}
          </p>
        </div>

        {/* Solo mostramos el resumen si el carrito aún no se ha vaciado */}
        {cart.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Resumen del pedido
            </h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.cartItemId} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-md border"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Cantidad: {item.qty}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    AR$ {(item.price * item.qty).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t mt-6 pt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-800">
                  AR$ {total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span className="text-gray-800">Total</span>
                <span className="text-gray-900">AR$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/catalog"
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
          >
            Seguir Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
