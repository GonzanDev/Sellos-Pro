import React, { useState } from "react";

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email.includes("@")) return alert("Email inválido");
    setSent(true);
  };

  return (
    <section className="py-16 bg-gray-100" id="contact">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-black mb-8 text-center">
          Contacto
        </h2>
        {sent ? (
          <p className="text-center text-green-600 font-semibold">
            ¡Gracias por tu mensaje! Te responderemos pronto.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow space-y-4"
          >
            <input
              type="text"
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded p-2"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded p-2"
              required
            />
            <textarea
              placeholder="Mensaje"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border rounded p-2"
              rows="4"
              required
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-black transition"
            >
              Enviar
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default ContactForm;
