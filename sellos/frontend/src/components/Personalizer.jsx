import React from "react";

export default function Personalizer({ customization, setCustomization, product = {} }) {
  const handleChange = (field, value) => {
    setCustomization((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ si product.colors no existe → arreglo vacío
  const colors = product.colors || [];


  // Buscar el nombre del color seleccionado
  const selectedColor =
    colors.find((c) => c.hex === customization.color)?.name || "Ninguno";

  return (
    <div className="space-y-6">
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

      {/* 🎨 Colores del JSON */}
      {colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Color</label>
          <div className="flex gap-3 mt-2">
            {colors.map((color) => (
              <div key={color.hex} className="relative">
                <button
                  type="button"
                  disabled={!color.stock}
                  onClick={() => handleChange("color", color.hex)}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    customization.color === color.hex
                      ? "border-black"
                      : "border-gray-300"
                  } ${!color.stock ? "opacity-40 cursor-not-allowed" : ""}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
                {!color.stock && (
                  <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-red-600 font-medium">
                    Sin stock
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-gray-600">
            Seleccionado: <strong>{selectedColor}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
