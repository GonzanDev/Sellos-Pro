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

  // 🔠 Letras A-Z para seleccionar tipo de fuente
  const letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  return (
    <div className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <input
          type="text"
          value={customization.Nombre || ""}
          onChange={(e) => handleChange("Nombre", e.target.value)}
          className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
          placeholder="Nombre del alumno"
        />
      </div>

      {/* Dibujito */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dibujito
        </label>
        <input
          type="number"
          min="0"
          max="158"
          value={customization.Dibujo || 0}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 0 && value <= 158) handleChange("Dibujo", value);
          }}
          className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
          placeholder="Ej: 12"
        />
        <p className="text-xs text-gray-500 mt-1">
          Ingresá un número entre 0 y 158. El valor <strong>0</strong> significa
          sin dibujito.
        </p>
      </div>

      {/* 🔤 Selector de tipo de letra (A–Z) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de letra
        </label>
        <select
          value={customization.Fuente || ""}
          onChange={(e) => handleChange("Fuente", e.target.value)}
          className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
        >
          <option value="">Elegir tipo (A-Z)...</option>
          {letters.map((letter) => (
            <option key={letter} value={letter}>
              {letter}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Consultá la imagen con los modelos A–Z para ver cómo es cada fuente.
        </p>
      </div>

      {/* Detalles */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Detalles
      </label>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={customization.Hoja || false}
            onChange={(e) => handleChange("Hoja", e.target.checked)}
          />
          Hoja
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={customization.Grado || false}
            onChange={(e) => handleChange("Grado", e.target.checked)}
          />
          Grado
        </label>
      </div>

      {/* Color */}
      <ColorPicker
        colors={colors}
        value={customization.color}
        onChange={(hex) => handleChange("color", hex)}
      />

      {/* Comentarios */}
      <div className="pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comentarios adicionales
        </label>
        <textarea
          value={customization.Comentarios || ""}
          onChange={(e) => handleChange("Comentarios", e.target.value)}
          rows="3"
          className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 resize-none"
          placeholder="Aclaraciones, detalles de diseño, etc."
        />
      </div>
    </div>
  );
}
