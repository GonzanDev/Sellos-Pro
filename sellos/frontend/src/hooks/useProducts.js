/**
 * ==============================================================================
 * 🎣 HOOK PERSONALIZADO: useProducts
 * ==============================================================================
 *
 * Descripción:
 * Este es un hook personalizado (custom hook) de React que encapsula toda la
 * lógica para obtener la lista de productos de la API.
 *
 * Su responsabilidad es manejar el ciclo de vida completo de la petición de datos:
 * 1. Estado de Carga (loading)
 * 2. Estado de Éxito (data/products)
 * 3. Estado de Error (error)
 *
 * Cualquier componente que necesite la lista de productos puede usar este hook
 * para obtener los datos y el estado de la petición de forma limpia.
 */
import { useState, useEffect } from "react";

// Define la URL base de la API.
// 1. Intenta leer la variable de entorno 'VITE_API_URL' (definida en el build/producción).
// 2. Si no la encuentra, usa 'http://localhost:8080/api' como fallback (para desarrollo local).
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

/**
 * Hook para obtener la lista de productos.
 *
 * @returns {object} Un objeto que contiene el estado de la petición.
 * @returns {Array<object>} products - El array de productos (o [] si está cargando/error).
 * @returns {boolean} loading - `true` si la petición de datos está en curso.
 * @returns {string | null} error - Un mensaje de error si la petición falló, o `null` si fue exitosa.
 */
export function useProducts() {
  // --- ESTADOS INTERNOS DEL HOOK ---

  // Estado 1: Almacena la lista de productos obtenida de la API.
  const [products, setProducts] = useState([]);

  // Estado 2: Indica si la petición está actualmente en curso.
  // Inicia en `true` porque la petición comienza tan pronto se usa el hook.
  const [loading, setLoading] = useState(true);

  // Estado 3: Almacena un mensaje de error si la petición falla.
  const [error, setError] = useState(null);

  /**
   * --------------------------------------------------------------------------
   * EFECTO: Carga de Datos (fetch)
   * --------------------------------------------------------------------------
   * Este useEffect se ejecuta *una sola vez* cuando el componente
   * que usa este hook se monta (gracias al array de dependencias vacío `[]`).
   */
  useEffect(() => {
    // --- LÍNEA DE DIAGNÓSTICO ---
    // (Útil para verificar qué URL se está usando en el entorno de producción).
    console.log("Intentando conectar con la API en:", API_URL);

    // Asegura que el estado de carga esté activo al (re)iniciar la petición.
    setLoading(true);

    // 1. Inicia la petición (fetch) a la API para obtener los productos.
    fetch(`${API_URL}/products`)
      // 2. Comprueba si la respuesta HTTP fue exitosa (status 200-299).
      .then((res) => {
        // Si la respuesta no es 'ok' (ej. 404 No Encontrado, 500 Error de Servidor)...
        if (!res.ok) {
          // ...lanza un error que será capturado por el .catch().
          throw new Error(
            `La respuesta de la red no fue exitosa (Status: ${res.status})`
          );
        }
        // 3. Si fue exitosa, parsea la respuesta JSON.
        return res.json();
      })
      // 4.A. ÉXITO (Datos recibidos):
      .then((data) => {
        setProducts(data); // Guarda los productos en el estado.
        setError(null); // Limpia cualquier error de una ejecución anterior.
      })
      // 4.B. ERROR (La petición falló):
      .catch((err) => {
        console.error("Error cargando productos", err);
        setError(err.message); // Guarda el mensaje de error en el estado.
      })
      // 5. FINALMENTE (Se ejecuta siempre, con éxito o error):
      .finally(() => {
        setLoading(false); // Indica que la petición ha terminado.
      });
  }, []); // El array vacío `[]` asegura que esto se ejecute solo una vez.

  // --- VALOR DE RETORNO ---
  // Devuelve el estado actual (los 3 valores) para que
  // el componente que lo usa pueda reaccionar y renderizar
  // un spinner (si loading=true), un mensaje (si error=true),
  // o la lista de productos (si products tiene datos).
  return { products, loading, error };
}
