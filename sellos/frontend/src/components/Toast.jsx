import React from "react";

export default function Toast({ message, onClose }) {
  return (
    <div
      className="fixed bottom-6 left-6 bg-black text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-in-left"
      role="alert"
    >
      <div className="flex items-center justify-between gap-3">
        <span>{message}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  );
}
