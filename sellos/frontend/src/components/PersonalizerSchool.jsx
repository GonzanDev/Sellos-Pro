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

  // 🔤 Lista de fuentes disponibles (podés ampliarla si querés)
  const fonts = [
    { label: "Arial", value: "arial" },
    { label: "Times New Roman", value: "times" },
    { label: "Comic Sans MS", value: "comic" },
    { label: "Courier New", value: "courier" },
    { label: "Montserrat", value: "montserrat" },
  ];

  return (
    <div className="space-y-4">
      {/* Nombre */}
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

      {/* Dibujito */}
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



      {/* Fuente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de letra
        </label>
        <select
          value={customization.font || ""}
          onChange={(e) => handleChange("font", e.target.value)}
          className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
        >
          <option value="">Elegir fuente...</option>
          {fonts.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
      

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Detalles
        </label>
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
