import React from "react";
import ColorPicker from "./ColorPicker";

export default function Personalizer({
  customization,
  setCustomization,
  product = {},
}) {
  const handleChange = (field, value) => {
    setCustomization((prev) => ({ ...prev, [field]: value }));
  };

  const colors = product.colors || [];
  const maxLines = product.maxLines || 3;

  // Lista de fuentes disponibles
  const fonts = [
    { label: "Arial", value: "Arial" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Courier New", value: "Courier New" },
    { label: "Montserrat", value: "Montserrat" },
    { label: "Comic Sans MS", value: "Comic Sans MS" },
  ];

  return (
    <div>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Texto del Sello (Máx. {maxLines} líneas)
        </p>

        {Array.from({ length: maxLines }).map((_, i) => (
          <div key={i}>
            <input
              type="text"
              value={customization[`line${i + 1}`] || ""}
              onChange={(e) => handleChange(`line${i + 1}`, e.target.value)}
              className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
              placeholder={`Línea ${i + 1}`}
            />
          </div>
        ))}

        {/* 🔹 Selección de letra (fuente) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de letra
          </label>
          <select
            value={customization.font || ""}
            onChange={(e) => handleChange("font", e.target.value)}
            className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
          >
            <option value="">Seleccionar fuente...</option>
            {fonts.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* 🔹 Selector de color */}
        <ColorPicker
          colors={colors}
          value={customization.color}
          onChange={(hex) => handleChange("color", hex)}
        />
      </div>

      {/* 🔹 Comentarios adicionales */}
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
