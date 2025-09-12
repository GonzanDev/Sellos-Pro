import React from "react";

export default function ContactForm() {
  return (
    <section id="contact" className="py-16 max-w-3xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Contacto</h2>
      <form className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Nombre</label>
          <input className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-2 font-medium">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-2 font-medium">Mensaje</label>
          <textarea className="w-full border rounded px-3 py-2" rows="4" />
        </div>
        <button className="px-6 py-3 bg-[#e30613] text-white rounded hover:bg-black transition">
          Enviar Mensaje
        </button>
      </form>
    </section>
  );
}
