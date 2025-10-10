import React, { useRef } from "react";

const kits = {
  "Kit 1": { width: 4, height: 4 },
  "Kit 2": { width: 5, height: 3 },
  "Kit 3": { width: 6, height: 4 },
};

export default function PersonalizerLogo({ customization, setCustomization }) {
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    setCustomization((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      handleChange("logoPreview", fileUrl);
      handleChange("fileName", file.name);
    }
  };

  const handleKitClick = (kitName) => {
    const kit = kits[kitName];
    if (kit) {
      handleChange("width", kit.width);
      handleChange("height", kit.height);
      handleChange("selectedKit", kitName);
    }
  };

  const width = customization.width || 3;
  const height = customization.height || 3;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.keys(kits).map((kitName) => (
          <button
            key={kitName}
            onClick={() => handleKitClick(kitName)}
            className={`px-3 py-1 rounded transition text-sm ${
              customization.selectedKit === kitName
                ? "bg-red-600 text-white"
                : "bg-white border hover:bg-gray-200"
            }`}
          >
            {kitName}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subir Logo
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="w-full text-sm py-2 px-4 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          {customization.fileName ? customization.fileName : "Elegir archivo"}
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ancho (cm)
        </label>
        <input
          type="number"
          value={width}
          onChange={(e) => handleChange("width", Number(e.target.value))}
          className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
          min={1}
          step={1}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alto (cm)
        </label>
        <input
          type="number"
          value={height}
          onChange={(e) => handleChange("height", Number(e.target.value))}
          className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
          min={1}
          step={1}
        />
      </div>

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
