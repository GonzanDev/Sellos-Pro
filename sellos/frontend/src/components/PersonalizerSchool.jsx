import React from "react";
import ColorPicker from "./ColorPicker";

export default function PersonalizerSchool({ customization, setCustomization, product = {} }) {
  const handleChange = (field, value) => {
    setCustomization((prev) => ({ ...prev, [field]: value }));
  };

  const colors = product.colors || [];

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          value={customization.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          className="mt-1 w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Dibujito</label>
        <select
          value={customization.icon || ""}
          onChange={(e) => handleChange("icon", e.target.value)}
          className="mt-1 w-full border rounded-lg px-3 py-2"
        >
          <option value="">Elegir...</option>
          <option value="estrella">⭐ Estrella</option>
          <option value="corazon">❤️ Corazón</option>
          <option value="lapiz">✏️ Lápiz</option>
        </select>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={customization.hoja || false}
            onChange={(e) => handleChange("hoja", e.target.checked)}
          />
          Hoja
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={customization.grado || false}
            onChange={(e) => handleChange("grado", e.target.checked)}
          />
          Grado
        </label>
      </div>

      {/* 🎨 Selector de colores (reutilizable) */}
      <ColorPicker
        colors={colors}
        value={customization.color}
        onChange={(hex) => handleChange("color", hex)}
      />
    </>
  );
}
