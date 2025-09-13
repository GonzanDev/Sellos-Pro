import React, { useEffect, useState } from "react";

const PERSONALIZER_LS_KEY = "sellospro_personalizer_v1";

export default function Personalizer() {
  const [options, setOptions] = useState({
    text: "",
    color: "#000000",
    size: "mediano",
  });

  // cargar opciones guardadas
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PERSONALIZER_LS_KEY);
      if (raw) setOptions(JSON.parse(raw));
    } catch (e) {
      console.warn("No se pudo cargar personalizador", e);
    }
  }, []);

  // guardar cada vez que cambien
  useEffect(() => {
    try {
      localStorage.setItem(PERSONALIZER_LS_KEY, JSON.stringify(options));
    } catch (e) {
      console.warn("No se pudo guardar personalizador", e);
    }
  }, [options]);

  const handleChange = (field, value) => {
    setOptions((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white shadow rounded p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Personaliza tu sello</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Texto</label>
          <input
            type="text"
            value={options.text}
            onChange={(e) => handleChange("text", e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Ingresa tu texto"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Color</label>
          <input
            type="color"
            value={options.color}
            onChange={(e) => handleChange("color", e.target.value)}
            className="w-16 h-10 border rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tamaño</label>
          <select
            value={options.size}
            onChange={(e) => handleChange("size", e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="chico">Chico</option>
            <option value="mediano">Mediano</option>
            <option value="grande">Grande</option>
          </select>
        </div>
      </div>

      <div className="mt-6 p-4 border rounded bg-gray-50 text-center">
        <p className="font-medium mb-2">Vista previa:</p>
        <div
          className="inline-block px-4 py-2 rounded border"
          style={{
            color: options.color,
            fontSize:
              options.size === "chico"
                ? "14px"
                : options.size === "grande"
                ? "24px"
                : "18px",
          }}
        >
          {options.text || "Tu texto aquí"}
        </div>
      </div>
    </div>
  );
}
