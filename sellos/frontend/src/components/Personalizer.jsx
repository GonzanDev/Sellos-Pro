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

  return (
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tamaño
        </label>
        <select
          value={customization.size || ""}
          onChange={(e) => handleChange("size", e.target.value)}
          className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
        >
          <option value="">Seleccionar tamaño...</option>
          <option value="pequeno">Pequeño (38x14mm)</option>
          <option value="mediano">Mediano (47x18mm)</option>
          <option value="grande">Grande (58x22mm)</option>
        </select>
      </div>

      <ColorPicker
        colors={colors}
        value={customization.color}
        onChange={(hex) => handleChange("color", hex)}
      />
    </div>
  );
}
