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
import { Ban } from "lucide-react";

// Id compartido por la leyenda "Sin stock": todos los swatches deshabilitados
// la referencian vía aria-describedby, así el lector de pantalla anuncia el
// motivo sin necesitar un caption individual por swatch (eso rompía el
// alineado de la fila).
const OUT_OF_STOCK_LEGEND_ID = "color-picker-sin-stock";

function Swatch({ color, value, onChange }) {
  return (
    <button
      type="button"
      // Deshabilita el botón si la propiedad 'stock' del color es false.
      disabled={!color.stock}
      // Nombre accesible real: 'title' no lo anuncian de forma confiable
      // los lectores de pantalla.
      aria-label={color.name}
      aria-describedby={!color.stock ? OUT_OF_STOCK_LEGEND_ID : undefined}
      // Al hacer clic, llama a la función 'onChange' (del padre) con el hex de este color.
      onClick={() => onChange(color.hex)}
      className={`
        relative w-10 h-10 rounded-full border-2
        flex-shrink-0
        flex items-center justify-center
        transition-all
        ${
          // Lógica de SELECCIÓN:
          // Si el 'value' (seleccionado) coincide con el 'hex' de este botón,
          // muestra un borde notorio. Si no, un borde gris sutil separa el
          // círculo del fondo (clave para colores claros como el blanco,
          // que se perdían contra la tarjeta sin ningún borde).
          value === color.hex
            ? "border-gray-900 hover:border-gray-500" // Estilo seleccionado
            : "border-gray-400 hover:border-gray-500" // Estilo no seleccionado
        }
        ${
          // Lógica de STOCK:
          // Si no hay stock, aplica estilos de deshabilitado.
          !color.stock ? "opacity-60 cursor-not-allowed" : ""
        }
      `}
      // Aplica el color de fondo dinámicamente.
      style={{ backgroundColor: color.hex }}
      // Muestra el nombre del color en el 'tooltip' del navegador (accesibilidad).
      title={!color.stock ? `${color.name} — sin stock` : color.name}
    >
      {/* Ícono superpuesto en vez de un caption debajo: comunica "sin stock"
          sin alterar la altura del botón ni el ritmo de la fila. */}
      {!color.stock && (
        <Ban
          size={18}
          className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

export default function ColorPicker({ colors = [], value, onChange, error }) {
  // Guard Clause: Si no se proporcionan colores, el componente no se renderiza.
  if (!colors.length) return null;

  const outOfStockNames = colors.filter((c) => !c.stock).map((c) => c.name);

  return (
    <div className="mt-4">
      {/* Título de la sección */}
      <label className="block text-sm font-medium text-gray-700">Color</label>

      {/* Una sola fila con todos los colores, en su orden original. Los
          deshabilitados se distinguen con el ícono de "prohibido" encima,
          no con texto debajo, para no romper el alineado de la fila. */}
      <div className="flex flex-wrap gap-3 mt-2">
        {colors.map((color) => (
          <Swatch key={color.hex} color={color} value={value} onChange={onChange} />
        ))}
      </div>

      {outOfStockNames.length > 0 && (
        <p id={OUT_OF_STOCK_LEGEND_ID} className="mt-2 text-xs text-red-600">
          Sin stock: {outOfStockNames.join(", ")}
        </p>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

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
