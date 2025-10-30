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
  const maxLines = product.maxLines || 4;

  // Generar letras A a Z
  const letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  // Verificar si el producto pertenece a la categoría "Portátiles"
  const isPortable = Array.isArray(product.category)
    ? product.category.includes("Portátiles")
    : product.category === "Portátiles";

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

        {/* 🔤 Selector de tipo de letra (A–Z) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de letra (A–Z) (Ver en imagen)
          </label>

          <div className="grid grid-cols-7 sm:grid-cols-9 gap-2">
            {letters.map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => handleChange("Fuente", letter)}
                className={`flex items-center justify-center w-9 h-9 text-sm font-semibold rounded border transition 
                  ${
                    customization.Fuente === letter
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="mt-2">
            <button
              type="button"
              onClick={() => handleChange("Fuente", "")}
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              Borrar selección
            </button>
          </div>
        </div>

        {/* 🎨 Selector de color */}
        <ColorPicker
          colors={colors}
          value={customization.color}
          onChange={(hex) => handleChange("color", hex)}
        />

{/* 🖐 Opción de zurdo (solo para Portátiles) - USANDO CHECKBOX GRANDE */}
    {isPortable && (
     <div className="pt-4 flex items-center">
      <input
       type="checkbox"
       id="zurdo-checkbox"
       checked={customization.zurdo || false}
       onChange={() => handleChange("zurdo", !customization.zurdo)}
       className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 cursor-pointer" // Aumentado w-5 y h-5
      />
      <label
       htmlFor="zurdo-checkbox"
       className="ml-2 text-base font-semibold text-gray-800 cursor-pointer" // Aumentado text-base y font-semibold, color más oscuro
      >
       Soy zurdo
      </label>
      
     </div>
    )}

    {/* Agrega la nota descriptiva debajo (opcional) */}
    {isPortable && (
     <p className="text-sm text-gray-600 mt-1 ml-7"> {/* Aumentado text-sm y ml-7 para alinear un poco mejor */}
      Activá esta opción si usás el sello con la mano izquierda.
     </p>
    )}
      </div>

      {/* 🗒 Comentarios adicionales */}
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
