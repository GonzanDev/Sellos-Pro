import React, { useState } from "react";

const WHATSAPP_NUMBER = "5492235551071";

export default function ContactForm() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.email || !form.mensaje) {
      alert("Por favor completá todos los campos.");
      return;
    }

    const text = `Hola! Soy ${form.nombre} (${form.email}).%0A%0A${form.mensaje}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

    window.open(url, "_blank");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full bg-gray-100 border-transparent rounded-md px-4 py-3 focus:ring-2 focus:ring-red-500 focus:bg-white transition"
          placeholder="Tu nombre completo"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo Electrónico
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full bg-gray-100 border-transparent rounded-md px-4 py-3 focus:ring-2 focus:ring-red-500 focus:bg-white transition"
          placeholder="tu@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mensaje
        </label>
        <textarea
          name="mensaje"
          value={form.mensaje}
          onChange={handleChange}
          rows="5"
          className="w-full bg-gray-100 border-transparent rounded-md px-4 py-3 focus:ring-2 focus:ring-red-500 focus:bg-white transition"
          placeholder="Escribe tu consulta aquí..."
        />
      </div>
      <button
        type="submit"
        className="w-full bg-[#e30613] text-white py-3 rounded-md hover:bg-red-700 transition font-semibold text-lg"
      >
        Enviar Mensaje
      </button>
    </form>
  );
}
