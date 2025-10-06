import React from "react";
import ColorPicker from "./ColorPicker";

export default function Personalizer({ customization, setCustomization, product = {} }) {
  const handleChange = (field, value) => {
    setCustomization((prev) => ({ ...prev, [field]: value }));
  };

  const colors = product.colors || [];

  return (
    <div className="space-y-6">
      {/* Líneas de texto */}
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <label className="block text-sm font-medium text-gray-700">
            Línea {i}
          </label>
          <input
            type="text"
            value={customization[`line${i}`] || ""}
            onChange={(e) => handleChange(`line${i}`, e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>
      ))}

      {customization.line1?.length > 15 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Línea 4
          </label>
          <input
            type="text"
            value={customization.line4 || ""}
            onChange={(e) => handleChange("line4", e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>
      )}

      {/* Fuente */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fuente
        </label>
        <select
          value={customization.font || ""}
          onChange={(e) => handleChange("font", e.target.value)}
          className="mt-1 w-full border rounded-lg px-3 py-2"
        >
          <option value="arial">Arial</option>
          <option value="times">Times New Roman</option>
          <option value="comic">Comic Sans</option>
        </select>
      </div>

      {/* 🎨 Selector de colores (reutilizable) */}
      <ColorPicker
        colors={colors}
        value={customization.color}
        onChange={(hex) => handleChange("color", hex)}
      />
    </div>
  );
}
