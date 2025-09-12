import React, { useState } from "react";

function Personalizer() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <section className="py-16 bg-white" id="personalizer">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-black mb-8 text-center">
          Personalizá tu sello
        </h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <label className="block mb-4">
              <span className="text-gray-700">Texto del sello:</span>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mt-2 w-full border rounded p-2"
                placeholder="Ej: Empresa SRL"
              />
            </label>
            <label className="block mb-4">
              <span className="text-gray-700">Subí tu logo:</span>
              <input
                type="file"
                onChange={handleImage}
                className="mt-2 w-full"
                accept="image/*"
              />
            </label>
          </div>
          <div className="flex-1 border rounded-lg p-6 flex flex-col items-center justify-center">
            <p className="font-semibold text-gray-600 mb-2">Vista previa</p>
            <div className="w-40 h-40 border flex items-center justify-center relative">
              {image ? (
                <img
                  src={image}
                  alt="Preview"
                  className="max-h-full max-w-full"
                />
              ) : (
                <span className="text-gray-400">Logo aquí</span>
              )}
              {text && (
                <span className="absolute bottom-2 text-sm font-bold text-black bg-white px-2">
                  {text}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Personalizer;
