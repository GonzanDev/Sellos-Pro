/**
 * ==============================================================================
 * 🛠️ COMPONENTE: Personalizador de Producto (Personalizer.jsx)
 * ==============================================================================
 *
 * Descripción: Renderiza el formulario de opciones para personalizar un producto.
 * Este es un "componente controlado" puro: no tiene estado propio, sino que
 * recibe el estado de personalización y la función para actualizarlo
 * directamente desde su componente padre (probablemente la página del producto).
 *
 * Responsabilidades:
 * 1. Renderizar dinámicamente campos de texto basados en `product.maxLines`.
 * 2. Renderizar un selector de fuentes (A-Z).
 * 3. Delegar la selección de color al componente <ColorPicker>.
 * 4. Renderizar condicionalmente opciones específicas (ej. "zurdo" para "Portátiles").
 * 5. Renderizar un campo de comentarios.
 * 6. Llamar a `setCustomization` (del padre) en cada cambio.
 *
 * @param {object} props
 * @param {object} props.customization - El objeto de estado actual que contiene
 * todas las selecciones (ej. { line1: '...', color: '...', Fuente: 'A' }).
 * @param {function} props.setCustomization - La función `setState` del componente
 * padre para actualizar el objeto `customization`.
 * @param {object} [props.product={}] - El objeto del producto que se está
 * personalizando. Define las reglas (colores disponibles, max. líneas, etc.).
 */
import React from "react";
import ColorPicker from "./ColorPicker"; // Importa el subcomponente para el selector de color.

export default function Personalizer({
  customization,
  setCustomization,
  product = {}, // Valor por defecto para evitar errores si `product` es undefined.
}) {
  /**
   * --------------------------------------------------------------------------
   * MANEJADOR GENÉRICO DE CAMBIOS
   * --------------------------------------------------------------------------
   * Esta es la función principal que actualiza el estado en el componente padre.
   *
   * @param {string} field - El nombre de la propiedad a actualizar en el
   * objeto `customization` (ej. 'line1', 'color', 'Fuente', 'zurdo').
   * @param {*} value - El nuevo valor para ese campo.
   */
  const handleChange = (field, value) => {
    // Llama a la función `setCustomization` del padre.
    // Utiliza el "updater function" `(prev => ...)` para asegurar que se
    // basa en el estado más reciente, y preserva los valores antiguos.
    setCustomization((prev) => ({ ...prev, [field]: value }));
  };

  // --- 1. Extracción de reglas del producto (con valores por defecto) ---
  // Extrae los colores disponibles del producto, o un array vacío si no hay.
  const colors = product.colors || [];
  // Extrae el máximo de líneas, o usa 4 como valor por defecto.
  const maxLines = product.maxLines || 4;

  // --- 2. Generación de datos para UI ---
  // Genera un array de letras (A-Z) para el selector de fuentes.
  const letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  // --- 3. Lógica Condicional Específica ---
  // Verifica si el producto es de la categoría "Portátiles".
  // (Maneja el caso de que `product.category` sea un string o un array).
  const isPortable = Array.isArray(product.category)
    ? product.category.includes("Portátiles")
    : product.category === "Portátiles";

  // --- RENDERIZACIÓN ---
  return (
    <div>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Texto del Sello (Máx. {maxLines} líneas)
        </p>

        {/* --- Inputs de Líneas (Dinámico) --- */}
        {/*
         * Crea un array vacío del tamaño de `maxLines` (ej. 4)
         * y lo mapea para renderizar un <input> por cada línea.
         */}
        {Array.from({ length: maxLines }).map((_, i) => (
          <div key={i}>
            <input
              type="text"
              // El valor se lee del estado: customization.line1, customization.line2, etc.
              value={customization[`line${i + 1}`] || ""}
              // Al cambiar, llama al handler genérico con el nombre del campo (ej. 'line1').
              onChange={(e) => handleChange(`line${i + 1}`, e.target.value)}
              className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500"
              placeholder={`Línea ${i + 1}`}
            />
          </div>
        ))}

        {/* --- 🔤 Selector de tipo de letra (A–Z) --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de letra (A–Z) (Ver en imagen)
          </label>
          <div className="grid grid-cols-7 sm:grid-cols-9 gap-2">
            {/* Itera sobre el array de letras 'A' a 'Z' */}
            {letters.map((letter) => (
              <button
                key={letter}
                type="button"
                // Llama al handler para actualizar el campo 'Fuente'.
                onClick={() => handleChange("Fuente", letter)}
                // Aplica estilos condicionales:
                // Si la 'Fuente' en el estado es esta 'letter', aplica el estilo activo (rojo).
                className={`flex items-center justify-center w-9 h-9 text-sm font-semibold rounded border transition 
                  ${
                    customization.Fuente === letter
                      ? "bg-red-600 text-white border-red-600" // Estilo Activo
                      : "bg-white border-gray-300 hover:bg-gray-100" // Estilo Inactivo
                  }`}
              >
                {letter}
              </button>
            ))}
          </div>
          {/* Botón para limpiar la selección de fuente */}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => handleChange("Fuente", "")} // Setea 'Fuente' a un string vacío.
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              Borrar selección
            </button>
          </div>
        </div>

        {/* --- 🎨 Selector de color --- */}
        {/*
         * Delega toda la lógica de renderizado de colores al componente <ColorPicker>.
         * Le pasa los colores disponibles, el valor actual y el handler.
         */}
        <ColorPicker
          colors={colors}
          value={customization.color} // Valor actual (ej. '#FF0000')
          onChange={(hex) => handleChange("color", hex)} // Handler (actualiza 'color' en el estado)
        />

        {/* --- 🖐 Opción de zurdo (Condicional) --- */}
        {/* Este bloque (checkbox + texto) SOLO se renderiza si 'isPortable' es true. */}
        {isPortable && (
          <div className="pt-4 flex items-center">
            <input
              type="checkbox"
              id="zurdo-checkbox"
              // Controlado por el estado: customization.zurdo
              checked={customization.zurdo || false}
              // Al cambiar, invierte el valor booleano de 'zurdo' en el estado.
              onChange={() => handleChange("zurdo", !customization.zurdo)}
              className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
            />
            <label
              htmlFor="zurdo-checkbox"
              className="ml-2 text-base font-semibold text-gray-800 cursor-pointer"
            >
              Soy zurdo
            </label>
          </div>
        )}
        {/* Texto descriptivo para la opción de zurdo (también condicional) */}
        {isPortable && (
          <p className="text-sm text-gray-600 mt-1 ml-7">
            Activá esta opción si usás el sello con la mano izquierda.
          </p>
        )}
      </div>

      {/* --- 🗒 Comentarios adicionales --- */}
      <div className="pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comentarios adicionales
        </label>
        <textarea
          // Controlado por el estado: customization.Comentarios
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
