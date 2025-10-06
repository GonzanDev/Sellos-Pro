import React from "react";

export default function ColorPicker({ colors = [], value, onChange }) {
  if (!colors.length) return null;

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700">Color</label>
      <div className="flex gap-3 mt-2">
        {colors.map((color) => (
          <div key={color.hex} className="relative">
            <button
              type="button"
              disabled={!color.stock}
              onClick={() => onChange(color.hex)}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                value === color.hex ? "border-black" : "border-gray-300"
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
        Seleccionado:{" "}
        <strong>
          {colors.find((c) => c.hex === value)?.name || "Ninguno"}
        </strong>
      </p>
    </div>
  );
}
