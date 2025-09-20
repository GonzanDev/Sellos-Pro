import React from "react";

export default function Personalizer({ customization, setCustomization }) {
  const handleChange = (field, value) => {
    setCustomization((prev) => ({ ...prev, [field]: value }));
  };

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

      {/* Controles comunes */}
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

      <div>
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <div className="flex gap-2 items-center mt-1">
          <input
            type="color"
            value={customization.color || "#000000"}
            onChange={(e) => handleChange("color", e.target.value)}
            className="w-12 h-10 p-1 border rounded"
          />
          <div
            className="w-10 h-10 rounded border"
            style={{ backgroundColor: customization.color || "#000000" }}
          />
        </div>
      </div>
    </div>
  );
}
