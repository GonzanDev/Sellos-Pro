import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-6 mt-16">
      <div className="max-w-6xl mx-auto text-center">
        <img src="/logo.png" alt="SellosPro" className="h-10 mx-auto mb-2" />
        <p className="text-sm">
          © {new Date().getFullYear()} SellosPro. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
