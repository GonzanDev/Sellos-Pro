/**
 * ==============================================================================
 * 🍪 COMPONENTE: Personalizador de Kit Empanadas (PersonalizerEmpanadas.jsx)
 * ==============================================================================
 *
 * Descripción: Renderiza las opciones de personalización para el Kit Empanadas.
 *
 * Funcionalidades:
 * 1. Fija el tamaño a "Kit Empanadas" por defecto (no permite cambiarlo).
 * 2. Muestra las dimensiones y la vista previa del sello de empanadas.
 * 3. Captura los sabores de empanadas deseados en lugar de subir un logo.
 */
import React, { useEffect } from "react";

// ------------------------------------------------------------------------------
// DATOS: Define los tamaños (en cm) para el Kit de Empanadas.
// ------------------------------------------------------------------------------
const kits = {
  // Solo necesitamos la definición del Kit Empanadas para este componente.
  "Kit Empanadas": { width: 4, height: 1 },
};

// Define el nombre del kit a usar siempre.
const EMPANADA_KIT_NAME = "Kit Empanadas";

export default function PersonalizerEmpanadas({ customization, setCustomization }) {
  
  /**
   * --------------------------------------------------------------------------
   * EFECTO: Establecer Kit por Defecto (Fijo)
   * --------------------------------------------------------------------------
   * Asegura que el estado siempre refleje el kit de empanadas.
   */
  useEffect(() => {
    // Si el kit seleccionado no es el de Empanadas, lo forzamos.
    if (customization.selectedKit !== EMPANADA_KIT_NAME) {
      const defaultKit = kits[EMPANADA_KIT_NAME]; // Obtiene los datos.
      
      // Actualiza el estado en el componente padre con los valores fijos.
      setCustomization((prev) => ({
        ...prev,
        selectedKit: EMPANADA_KIT_NAME,
        width: defaultKit.width,
        height: defaultKit.height,
        // Opcional: Limpiar datos irrelevantes del kit anterior
        logoFile: null,
        fileName: "",
        logoPreview: "",
      }));
    }
  // Se ejecuta si el estado de personalización se resetea o si el kit no está fijado.
  }, [customization.selectedKit, setCustomization]);

  /**
   * --------------------------------------------------------------------------
   * MANEJADORES
   * --------------------------------------------------------------------------
   */

  /**
   * Manejador genérico para actualizar el estado `customization`.
   * @param {string} field - La clave del estado a actualizar (ej. 'sabores', 'comentarios').
   * @param {*} value - El nuevo valor.
   */
  const handleChange = (field, value) => {
    setCustomization((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * --------------------------------------------------------------------------
   * RENDERIZACIÓN
   * --------------------------------------------------------------------------
   */

  // Los datos del kit ahora son fijos.
  const selectedKit = kits[EMPANADA_KIT_NAME];

  // Constante de escala: cuántos píxeles usaremos para representar 1 cm (15px = 1cm)
  const scale = 15;

  return (
    <div className="space-y-4">
      
      {/* --- 1. Kit Fijo (Título y Dimensiones) --- */}
      <h3 className="block text-sm font-bold text-gray-700">
        Kit seleccionado: {EMPANADA_KIT_NAME}
      </h3>

      {/* --- Muestra de Dimensiones y Vista Previa --- */}
      {selectedKit && (
        <>
          {/* Muestra las dimensiones (en cm) del kit */}
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

          {/* --- 🟥 Vista previa del tamaño del sello (Visual) --- */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Vista previa del área de sello (medida máxima)
            </p>
            <div className="flex justify-center items-center">
              <div
                className="border-2 border-gray-400 bg-gray-100 rounded-sm flex items-center justify-center"
                style={{
                  // Multiplica cm por scale (15) para obtener el tamaño en píxeles.
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

      {/* --- 2. Input de Sabores (Reemplaza Subida de Logo) --- */}
      <div className="pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Escriba los sabores de empanadas
        </label>
        <textarea
          // Asume que el estado 'sabores' se usará para guardar esta información
          value={customization.sabores || ""}
          onChange={(e) => handleChange("sabores", e.target.value)}
          rows="3"
          className="w-full bg-white border-gray-300 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 resize-none"
          placeholder="Ej: Carne suave, Pollo, Jamón y Queso, Verdura, etc."
        />
        <p className="text-xs text-gray-500 mt-1">
          Separe los sabores con comas.
        </p>
      </div>
      
      {/* --- 3. Comentarios Adicionales (Se mantiene) --- */}
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