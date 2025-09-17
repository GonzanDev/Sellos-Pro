import React, { useEffect, useState, useRef } from "react";

const LOGO_PERSONALIZER_LS_KEY = "sellospro_logo_personalizer_v1";

// conversión de cm a px (aprox. 37.8 px = 1 cm en pantallas comunes)
const cmToPx = (cm) => cm * 37.8;

export default function PersonalizerLogo() {
  const [options, setOptions] = useState({
    file: null,
    fileUrl: null,
    fileName: "",
    width: 3, // ancho en cm
    height: 3, // alto en cm
  });

  const fileInputRef = useRef(null);

  // cargar opciones guardadas
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOGO_PERSONALIZER_LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setOptions((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.warn("No se pudo cargar personalizador de logo", e);
    }
  }, []);

  // guardar en localStorage
  useEffect(() => {
    try {
      const { fileUrl, fileName, width, height } = options;
      localStorage.setItem(
        LOGO_PERSONALIZER_LS_KEY,
        JSON.stringify({ fileUrl, fileName, width, height })
      );
    } catch (e) {
      console.warn("No se pudo guardar personalizador de logo", e);
    }
  }, [options]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setOptions((prev) => ({
        ...prev,
        file,
        fileUrl,
        fileName: file.name,
      }));
    }
  };

  const handleSizeChange = (field, value) => {
    setOptions((prev) => ({ ...prev, [field]: Number(value) }));
  };

  return (
    <section id="personalizer-logo" className="py-16 bg-gray-100">
      <div className="bg-white shadow rounded p-6 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          Personaliza tu sello con logo
        </h2>

        <div className="space-y-4">
          {/* Subir logo */}
          <div>
            <label className="block text-sm font-medium mb-1">Subir Logo</label>
            <div className="flex items-center gap-3">
              {/* Botón custom que dispara el input */}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="px-4 py-2 bg-[#e30613] text-white rounded hover:bg-black transition"
              >
                Elegir archivo
              </button>

              {/* Nombre del archivo cargado */}
              {options.fileName && (
                <span className="text-sm text-gray-600 truncate max-w-[200px]">
                  {options.fileName}
                </span>
              )}

              {/* Input oculto */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Ancho */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Ancho (cm)
            </label>
            <input
              type="number"
              value={options.width}
              onChange={(e) => handleSizeChange("width", e.target.value)}
              className="w-full border rounded px-3 py-2"
              min={1}
              step={1}
            />
          </div>

          {/* Alto */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Alto (cm)
            </label>
            <input
              type="number"
              value={options.height}
              onChange={(e) => handleSizeChange("height", e.target.value)}
              className="w-full border rounded px-3 py-2"
              min={1}
              step={1}
            />
          </div>
        </div>

        {/* Vista previa */}
        <div className="mt-6 p-4 border rounded bg-gray-50 text-center">
          <p className="font-medium mb-2">Vista previa (aprox.):</p>
          {options.fileUrl ? (
            <img
              src={options.fileUrl}
              alt="Vista previa del logo"
              style={{
                width: `${cmToPx(options.width)}px`,
                height: `${cmToPx(options.height)}px`,
                objectFit: "contain",
                border: "1px solid #ddd",
              }}
              className="mx-auto"
            />
          ) : (
            <p className="text-gray-500">Sube un logo para ver la vista previa</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Tamaño real: {options.width} cm x {options.height} cm (aprox.)
          </p>
        </div>
      </div>
    </section>
  );
}
