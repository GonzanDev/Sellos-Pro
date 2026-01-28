import React, { useEffect } from "react";
import ColorPicker from "./ColorPicker"; // Subcomponente para la selección de color.

export default function PersonalizerSchool({
  customization,
  setCustomization,
  product = {},
}) {
  // Manejador genérico para actualizar el estado `customization` en el padre.
  const handleChange = (field, value) => {
    setCustomization((prev) => ({ ...prev, [field]: value }));
  };

  // Colores disponibles del producto
  const colors = product.colors || [];

  // 🔠 Genera un array de letras (A-Z)
  const letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  // ✅ Si no hay fuente seleccionada, se setea "sin-preferencia" por defecto
  useEffect(() => {
    if (!customization.Fuente) {
      setCustomization((prev) => ({ ...prev, Fuente: "sin-preferencia" }));
    }
  }, [customization.Fuente, setCustomization]);

  return (
    <div className="space-y-4">
      {/* --- Campo Nombre --- */}
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

      {/* --- Campo Dibujito --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dibujito (Ver en imagen)
        </label>
        <input
          type="number"
          min="200"
          max="389"
          value={customization.Dibujo || 200}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 200 && value <= 389) {
              handleChange("Dibujo", value);
            }
          }}
          className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
          placeholder="Ej: 12"
        />
        <p className="text-xs text-gray-500 mt-1">
          Ingresá un número entre 200 y 389. El valor <strong>200</strong> significa
          sin dibujito.
        </p>
      </div>

      {/* --- 🔤 Selector de tipo de letra --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de letra
        </label>
        <select
          value={customization.Fuente || "sin-preferencia"}
          onChange={(e) => handleChange("Fuente", e.target.value)}
          className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
        >
          {/* Primera opción: Sin preferencia */}
          <option value="sin-preferencia">
            Sin preferencia — Nosotros te elegimos la mejor opción
          </option>

          {/* Otras fuentes A-Z */}
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

      {/* --- Detalles Condicionales (solo para Sello Vertical ID 2) --- */}
      {product.id === 2 && (
        <>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Detalles
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={customization.Hoja || false}
                onChange={(e) => handleChange("Hoja", e.target.checked)}
              />
              Hoja N°
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={customization.Materia || false}
                onChange={(e) => handleChange("Materia", e.target.checked)}
              />
              Materia
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={customization.Año || false}
                onChange={(e) => handleChange("Año", e.target.checked)}
              />
              Año
            </label>
          </div>
        </>
      )}

      {/* --- 🎨 Selector de Color --- */}
      <ColorPicker
        colors={colors}
        value={customization.color}
        onChange={(hex) => handleChange("color", hex)}
      />

      {/* --- 🗒 Comentarios adicionales --- */}
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
