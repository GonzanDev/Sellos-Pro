import React from "react";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        ¡Pago aprobado!
      </h1>
      <p className="text-gray-700">
        Gracias por tu compra. Te enviaremos la confirmación por WhatsApp 📲
      </p>
    </div>
  );
}
