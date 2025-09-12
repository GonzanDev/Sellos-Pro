import React, { useState } from "react";

export default function Personalizer({ addToCart }) {
  const [text, setText] = useState("");
  const [color, setColor] = useState("#000000");
  const [font, setFont] = useState("Arial");
  const [logo, setLogo] = useState(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleAddToCart = () => {
    const product = {
      name: `Sello Personalizado`,
      price: 2500, // 💲 puedes ajustar el precio base
      options: { text, color, font, logo },
    };
    addToCart(product);
  };

  return (
    <section id="personalizer" className="py-16 px-6 bg-white">
      <h2 className="text-3xl font-bold text-center mb-8 text-red-600">
        Personaliza tu Sello
      </h2>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Formulario */}
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Texto</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Ej: Mi Empresa"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-10 border rounded-md cursor-pointer"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Tipografía</label>
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier New</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Subir Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-red-600 hover:bg-black text-white py-2 rounded-lg transition"
          >
            Agregar al Carrito
          </button>
        </div>

        {/* Vista previa */}
        <div className="flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg shadow-md">
          <div
            className="w-40 h-40 flex items-center justify-center rounded-full border-4"
            style={{ borderColor: color, fontFamily: font, color: color }}
          >
            {logo ? (
              <img
                src={logo}
                alt="Logo preview"
                className="w-20 h-20 object-contain"
              />
            ) : (
              <span className="text-lg font-bold">
                {text || "Vista Previa"}
              </span>
            )}
          </div>
          <p className="mt-4 text-gray-600">Así se verá tu sello</p>
        </div>
      </div>
    </section>
  );
}
