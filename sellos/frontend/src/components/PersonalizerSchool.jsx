/**
 * ==============================================================================
 * 🧑‍🏫 COMPONENTE: Personalizador Escolar (PersonalizerSchool.jsx)
 * ==============================================================================
 *
 * Descripción: Renderiza las opciones de personalización específicas para
 * productos de la categoría "Escolar" (ej. Sello Textil, Sello Vertical).
 *
 * Es un "componente controlado", al igual que los otros personalizadores.
 * Recibe `customization` y `setCustomization` de su componente padre.
 *
 * Funcionalidades Específicas:
 * 1. Campos para "Nombre", "Dibujito" (con validación), y "Fuente" (dropdown).
 * 2. Renderizado Condicional: Muestra checkboxes (Hoja, Materia, Año)
 * SOLAMENTE si el producto.id es 2 (Sello Vertical).
 * 3. Reutiliza el componente <ColorPicker>.
 *
 * @param {object} props
 * @param {object} props.customization - El objeto de estado actual de personalización.
 * @param {function} props.setCustomization - La función `setState` del padre.
 * @param {object} [props.product={}] - El objeto del producto para reglas (colores, id).
 */
import React from "react";
import ColorPicker from "./ColorPicker"; // Subcomponente para la selección de color.

export default function PersonalizerSchool({
  customization,
  setCustomization,
  product = {},
}) {
  /**
   * Manejador genérico para actualizar el estado `customization` en el padre.
   * @param {string} field - La clave del estado a actualizar (ej. 'Nombre', 'Dibujo').
   * @param {*} value - El nuevo valor.
   */
  const handleChange = (field, value) => {
    setCustomization((prev) => ({ ...prev, [field]: value }));
  };

  // Extrae los colores disponibles del producto, o un array vacío.
  const colors = product.colors || [];

  // 🔠 Genera un array de letras (A-Z) para el selector de fuentes.
  const letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

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

      {/* --- Campo Dibujito (con validación) --- */}
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
            // Validación: Solo actualiza el estado si el número está en el rango permitido.
            if (value >= 0 && value <= 158) {
              handleChange("Dibujo", value);
            }
          }}
          className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
          placeholder="Ej: 12"
        />
        <p className="text-xs text-gray-500 mt-1">
          Ingresá un número entre 0 y 158. El valor <strong>0</strong> significa
          sin dibujito.
        </p>
      </div>

      {/* --- 🔤 Selector de tipo de letra (Dropdown A-Z) --- */}
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
          {/* Itera sobre el array [A, B, C...] para crear las opciones */}
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

      {/* --- 💡 Detalles Condicionales (para Sello Vertical ID 2) --- */}
      {/* Este bloque de checkboxes SÓLO se renderiza si el producto.id es 2. */}
      {product.id === 2 && (
        <>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Detalles
          </label>
          <div className="flex flex-wrap gap-4">
            {/* Checkbox para "Hoja N°" */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={customization.Hoja || false}
                onChange={(e) => handleChange("Hoja", e.target.checked)}
              />
              Hoja N°
            </label>
            {/* Checkbox para "Materia" */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={customization.Materia || false}
                onChange={(e) => handleChange("Materia", e.target.checked)}
              />
              Materia
            </label>
            {/* Checkbox para "Año" */}
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
      {/* Reutiliza el componente ColorPicker */}
      <ColorPicker
        colors={colors}
        value={customization.color}
        onChange={(hex) => handleChange("color", hex)}
      />

      {/* --- 🗒 Comentarios Adicionales --- */}
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
