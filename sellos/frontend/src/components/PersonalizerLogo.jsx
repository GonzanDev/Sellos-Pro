/**
 * ==============================================================================
 * 🖼️ COMPONENTE: Personalizador de Logo y Kit (PersonalizerLogo.jsx)
 * ==============================================================================
 *
 * Descripción: Renderiza las opciones de personalización para productos que
 * requieren la subida de un logo y la selección de un tamaño de "Kit" predefinido.
 *
 * Este es un "componente controlado" (como Personalizer.jsx). Recibe el estado
 * `customization` y la función `setCustomization` desde su padre.
 *
 * Funcionalidades:
 * 1. Muestra botones para seleccionar un Kit (tamaño).
 * 2. Establece el "Kit 1" por defecto al cargar.
 * 3. Muestra una vista previa visual (escalada) del tamaño del kit seleccionado.
 * 4. Maneja la lógica de subida de archivos (logo) usando un input oculto.
 * 5. Guarda la previsualización del logo, el nombre del archivo y el
 * objeto `File` real en el estado `customization`.
 */
import React, { useRef, useEffect } from "react";

// ------------------------------------------------------------------------------
// DATOS: Define los tamaños (en cm) para cada "Kit".
// Esta es la fuente de verdad para los tamaños de los sellos con logo.
// ------------------------------------------------------------------------------
const kits = {
  "Kit 1": { width: 4, height: 4 },
  "Kit 2": { width: 10, height: 6 },
  "Kit 3": { width: 12, height: 8 },
  "Kit 4": { width: 10, height: 15 },
  "Kit 5": { width: 15, height: 9 },
  "Kit 6": { width: 20, height: 13 },
};

export default function PersonalizerLogo({ customization, setCustomization }) {
  /**
   * --------------------------------------------------------------------------
   * REFERENCIAS (useRef)
   * --------------------------------------------------------------------------
   * Se usa para "apuntar" al input de archivo, que está oculto.
   * El botón "Elegir archivo" que ve el usuario, en realidad
   * hace clic en este input invisible mediante `fileInputRef.current.click()`.
   */
  const fileInputRef = useRef(null);

  /**
   * --------------------------------------------------------------------------
   * EFECTO: Establecer Kit por Defecto
   * --------------------------------------------------------------------------
   * Este `useEffect` se ejecuta solo una vez (o si el estado de
   * personalización se resetea).
   *
   * ✅ Propósito: Asegura que "Kit 1" esté seleccionado por defecto
   * si el usuario aún no ha elegido uno. Mejora la experiencia de usuario.
   */
  useEffect(() => {
    // Si no hay ningún 'selectedKit' en el estado...
    if (!customization.selectedKit) {
      const defaultKit = kits["Kit 1"]; // Obtiene los datos del Kit 1
      // Actualiza el estado en el componente padre con los valores por defecto.
      setCustomization((prev) => ({
        ...prev,
        selectedKit: "Kit 1",
        width: defaultKit.width,
        height: defaultKit.height,
      }));
    }
    // La dependencia [customization, setCustomization] es correcta, aunque
    // la lógica interna previene bucles infinitos.
  }, [customization, setCustomization]);

  /**
   * --------------------------------------------------------------------------
   * MANEJADORES
   * --------------------------------------------------------------------------
   */

  /**
   * Manejador genérico para actualizar el estado `customization`.
   * @param {string} field - La clave del estado a actualizar (ej. 'comentarios', 'width').
   * @param {*} value - El nuevo valor.
   */
  const handleChange = (field, value) => {
    setCustomization((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Manejador para el input de archivo (logo).
   * Se dispara cuando el usuario selecciona un archivo.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del input de archivo.
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Obtiene el primer (y único) archivo.
    if (file) {
      // 1. Crea una URL local para la previsualización de la imagen.
      //    (Esto *no* sube el archivo, solo lo muestra localmente).
      const fileUrl = URL.createObjectURL(file);

      // 2. Actualiza el estado `customization` con TRES datos clave:
      handleChange("logoPreview", fileUrl); // La URL local para el <img>.
      handleChange("logoFile", file); // El objeto `File` real (para enviar al backend).
      handleChange("fileName", file.name); // El nombre del archivo (para mostrar en el botón).
    }
  };

  /**
   * Manejador para los botones de selección de Kit.
   * @param {string} kitName - El nombre del kit (ej. "Kit 1", "Kit 2").
   */
  const handleKitClick = (kitName) => {
    const kit = kits[kitName]; // Obtiene los datos del kit (ancho/alto)
    if (kit) {
      // Actualiza el estado con el kit seleccionado y sus dimensiones.
      handleChange("width", kit.width);
      handleChange("height", kit.height);
      handleChange("selectedKit", kitName);
    }
  };

  /**
   * --------------------------------------------------------------------------
   * RENDERIZACIÓN
   * --------------------------------------------------------------------------
   */

  // Obtiene los datos del kit seleccionado, o usa "Kit 1" como fallback seguro.
  const selectedKit = customization.selectedKit
    ? kits[customization.selectedKit]
    : kits["Kit 1"];

  // Constante de escala: cuántos píxeles usaremos para representar 1 cm
  // en la vista previa visual. (15px = 1cm)
  const scale = 15;

  return (
    <div className="space-y-4">
      {/* --- 1. Selector de Kit --- */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Seleccionar tamaño de kit
      </label>
      <div className="flex flex-wrap gap-2">
        {/* Itera sobre los nombres de los kits (Kit 1, Kit 2...) y crea un botón */}
        {Object.keys(kits).map((kitName) => (
          <button
            key={kitName}
            onClick={() => handleKitClick(kitName)}
            // Estilo condicional para el botón activo (seleccionado).
            className={`px-3 py-1 rounded transition text-sm ${
              customization.selectedKit === kitName
                ? "bg-red-600 text-white" // Activo
                : "bg-white border hover:bg-gray-200" // Inactivo
            }`}
          >
            {kitName}
          </button>
        ))}
      </div>

      {/* --- 2. Muestra de Dimensiones y Vista Previa --- */}
      {selectedKit && (
        <>
          {/* Muestra las dimensiones (en cm) del kit seleccionado */}
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

          {/* --- 🟥 Vista previa del tamaño del kit (Visual) --- */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Vista previa del área de sello (medida maxima del Kit
              seleccionado)
            </p>
            <div className="flex justify-center items-center">
              {/*
               * Este div simula el tamaño del sello.
               * Multiplica los 'cm' del kit por la 'scale' (15)
               * para obtener un tamaño en píxeles.
               * Ej: Kit 1 (4x4 cm) -> 60x60 px.
               */}
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

      {/* --- 3. Subida de Logo (Patrón de Input Oculto) --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subir Logo
        </label>
        {/* Este es el botón "falso" que ve el usuario. */}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()} // Al hacer clic, dispara el input real.
          className="w-full text-sm py-2 px-4 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          {/* Muestra el nombre del archivo o el texto por defecto. */}
          {customization.fileName ? customization.fileName : "Elegir archivo"}
        </button>
        {/* Este es el input "real" que está oculto. */}
        <input
          type="file"
          accept="image/*" // Acepta solo imágenes.
          ref={fileInputRef} // Vinculado a la referencia.
          onChange={handleFileChange} // Maneja la selección del archivo.
          className="hidden" // ¡Clave! Lo oculta de la vista.
        />
      </div>

      {/* --- 4. Comentarios Adicionales --- */}
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
