import React, { useRef, useEffect } from "react";

const kits = {
  "Kit 1": { width: 4, height: 4 },
  "Kit 2": { width: 10, height: 6 },
  "Kit 3": { width: 12, height: 8 },
  "Kit 4": { width: 10, height: 15 },
  "Kit 5": { width: 15, height: 9 },
  "Kit 6": { width: 20, height: 13 },
};

export default function PersonalizerLogo({ customization, setCustomization }) {
  const fileInputRef = useRef(null);

  // ✅ Seleccionar "Kit 1" por defecto al cargar el componente
  useEffect(() => {
    if (!customization.selectedKit) {
      const defaultKit = kits["Kit 1"];
      setCustomization({
        ...customization,
        selectedKit: "Kit 1",
        width: defaultKit.width,
        height: defaultKit.height,
      });
    }
  }, [customization, setCustomization]);

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

  const selectedKit = customization.selectedKit
    ? kits[customization.selectedKit]
    : kits["Kit 1"];

  const scale = 15; // Escala visual del rectángulo (px por cm)

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Seleccionar tamaño de kit
      </label>

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

      {selectedKit && (
        <>
          <div className="flex gap-6 mt-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Ancho</p>
              <div className="px-3 py-2 bg-gray-100 rounded-md text-sm border">
                {selectedKit.width} cm
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Alto</p>
              <div className="px-3 py-2 bg-gray-100 rounded-md text-sm border">
                {selectedKit.height} cm
              </div>
            </div>
          </div>

          {/* 🟥 Vista previa del tamaño del kit */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Vista previa del área de sello
            </p>
            <div className="flex justify-center items-center">
              <div
                className="border-2 border-gray-400 bg-gray-100 rounded-sm flex items-center justify-center"
                style={{
                  width: `${selectedKit.width * scale}px`,
                  height: `${selectedKit.height * scale}px`,
                }}
              >
                <span className="text-xs text-gray-600">
                  {selectedKit.width}×{selectedKit.height} cm
                </span>
              </div>
            </div>
          </div>
        </>
      )}

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
