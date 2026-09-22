/**
 * ==============================================================================
 * 🎨 COMPONENTE: Selector de Color (ColorPicker.jsx)
 * ==============================================================================
 *
 * Descripción: Renderiza una fila de botones circulares (swatches) para
 * seleccionar un color. Es un "componente controlado".
 *
 * Responsabilidades:
 * 1. Muestra un botón por cada color en el array `colors`.
 * 2. Deshabilita y estiliza los colores que están marcados como 'sin stock'.
 * 3. Resalta el color que está actualmente seleccionado (comparando `value` con `color.hex`).
 * 4. Llama a la función `onChange` del padre cuando se selecciona un color.
 * 5. Muestra el nombre del color seleccionado.
 * 6. No renderiza nada si el array `colors` está vacío.
 *
 * @param {object} props
 * @param {Array<object>} [props.colors=[]] - Array de objetos de color.
 * Ej: [{ hex: "#FFFFFF", name: "Blanco", stock: true }]
 * @param {string} props.value - El valor `hex` del color actualmente seleccionado.
 * @param {function} props.onChange - Función (callback) que se ejecuta al hacer clic
 * en un color, pasando el `color.hex` como argumento.
 */
import React from "react";

export default function ColorPicker({ colors = [], value, onChange }) {
  // Guard Clause: Si no se proporcionan colores, el componente no se renderiza.
  if (!colors.length) return null;

  return (
    <div className="mt-4">
      {/* Título de la sección */}
      <label className="block text-sm font-medium text-gray-700">Color</label>

      {/* Contenedor de los botones de color.
        'flex-wrap': Permite que los botones pasen a la siguiente línea
        automáticamente si no hay suficiente espacio horizontal.
      */}
      <div className="flex flex-wrap gap-3 mt-2">
        {/* Itera sobre cada color disponible */}
        {colors.map((color) => (
          // 'relative': Necesario para posicionar el texto "Sin stock" debajo.
          // 'flex-shrink-0': Previene que los botones se encojan si el espacio es reducido.
          <div key={color.hex} className="relative flex-shrink-0">
            <button
              type="button"
              // Deshabilita el botón si la propiedad 'stock' del color es false.
              disabled={!color.stock}
              // Al hacer clic, llama a la función 'onChange' (del padre) con el hex de este color.
              onClick={() => onChange(color.hex)}
              // Accesibilidad: nombre del color + estado seleccionado para lectores de pantalla.
              aria-label={color.name}
              aria-pressed={value === color.hex}
              className={`
                w-10 h-10 rounded-full border-2
                flex items-center justify-center
                transition-all
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900
                ${
                  // Lógica de SELECCIÓN:
                  // Si el 'value' (seleccionado) coincide con el 'hex' de este botón,
                  // muestra un borde notorio. Si no, el borde es transparente.
                  value === color.hex
                    ? "border-gray-900 hover:border-gray-500" // Estilo seleccionado
                    : "border-transparent " // Estilo no seleccionado
                }
                ${
                  // Lógica de STOCK:
                  // Si no hay stock, aplica estilos de deshabilitado.
                  !color.stock ? "opacity-40 cursor-not-allowed" : ""
                }
              `}
              // Aplica el color de fondo dinámicamente.
              style={{ backgroundColor: color.hex }}
              // Tooltip del navegador con el nombre del color.
              title={color.name}
            >
              {value === color.hex && (
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 drop-shadow-[0_0_1px_rgba(0,0,0,0.6)]"
                  fill="none"
                  stroke="white"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </button>

            {/* Lógica de "Sin Stock": Muestra un texto de advertencia si no hay stock */}
            {!color.stock && (
              // (Nota: El usuario ajustó la posición de este span para mejor visibilidad)
              <span className="relative text-xs text-[#e30613] whitespace-nowrap">
                {" "}
                Sin stock
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Muestra el nombre del color seleccionado */}
      {/* (Nota: Margen superior aumentado para dar espacio al texto 'Sin stock' de arriba) */}
      <p className="mt-4 text-sm text-gray-600">
        Seleccionado:{" "}
        <strong>
          {
            // 1. Busca en el array 'colors' el objeto cuyo 'hex' coincida con el 'value'.
            // 2. Usa 'optional chaining' (?.name) por si 'find' no encuentra nada.
            // 3. Si no hay valor o no se encuentra, muestra "Ninguno".
            colors.find((c) => c.hex === value)?.name || "Ninguno"
          }
        </strong>
      </p>
    </div>
  );
}
