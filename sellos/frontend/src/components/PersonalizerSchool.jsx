import React from "react";
import ColorPicker from "./ColorPicker";

export default function PersonalizerSchool({
  customization,
  setCustomization,
  product = {},
}) {
  const handleChange = (field, value) => {
    setCustomization((prev) => ({ ...prev, [field]: value }));
  };

  const colors = product.colors || [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <input
          type="text"
          value={customization.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
          placeholder="Nombre del alumno"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dibujito
        </label>
        <select
          value={customization.icon || ""}
          onChange={(e) => handleChange("icon", e.target.value)}
          className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
        >
          <option value="">Elegir...</option>
          <option value="estrella">⭐ Estrella</option>
          <option value="corazon">❤️ Corazón</option>
          <option value="lapiz">✏️ Lápiz</option>
        </select>
      </div>

      <ColorPicker
        colors={colors}
        value={customization.color}
        onChange={(hex) => handleChange("color", hex)}
      />

      <div className="pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comentarios adicionales
        </label>
        <textarea
          value={customization.comentarios || ""}
          onChange={(e) => handleChange("comentarios", e.target.value)}
          rows="3"
          className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 resize-none"
          placeholder="Aclaraciones, detalles de diseño, etc."
        />
      </div>
    </div>
  );
}
