import React from "react";

export default function FailurePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Pago fallido</h1>
      <p className="text-gray-700">
        Tu pago no pudo completarse. Intenta nuevamente o elige otro método.
      </p>
    </div>
  );
}
