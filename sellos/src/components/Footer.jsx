import React from "react";

function Footer() {
  return (
    <footer className="bg-black text-white py-6 mt-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="SellosPro" className="h-8" />
          <span className="font-bold">SellosPro</span>
        </div>
        <p className="text-gray-400 text-sm mt-4 md:mt-0">
          © {new Date().getFullYear()} SellosPro - Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
