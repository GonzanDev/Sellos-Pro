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

// Caché a nivel de módulo: Header, Home y CatalogPage usan este hook al mismo
// tiempo y sin esto cada uno dispara su propio fetch a /api/products (se veía
// duplicado en la red). Se comparte la misma promesa/resultado entre todas
// las instancias del hook durante la vida de la pestaña.
let productsCache = null; // Array de productos ya resueltos.
let productsRequest = null; // Promise en curso, para no duplicar el fetch.

function fetchProducts() {
  if (productsCache) return Promise.resolve(productsCache);
  if (!productsRequest) {
    productsRequest = fetch(`${API_URL}/products`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `La respuesta de la red no fue exitosa (Status: ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        productsCache = data;
        return data;
      })
      .catch((err) => {
        // No cachear errores: la próxima instancia puede reintentar.
        productsRequest = null;
        throw err;
      });
  }
  return productsRequest;
}

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
    // Si ya hay datos cacheados de otra instancia del hook, evitamos el
    // parpadeo de loading y mostramos de una.
    if (productsCache) {
      setProducts(productsCache);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchProducts()
      .then((data) => {
        if (cancelled) return;
        setProducts(data);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Error cargando productos", err);
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Evita actualizar estado de un componente ya desmontado si la
    // respuesta llega después (ej. navegación rápida entre páginas).
    return () => {
      cancelled = true;
    };
  }, []); // El array vacío `[]` asegura que esto se ejecute solo una vez por instancia.

  // --- VALOR DE RETORNO ---
  // Devuelve el estado actual (los 3 valores) para que
  // el componente que lo usa pueda reaccionar y renderizar
  // un spinner (si loading=true), un mensaje (si error=true),
  // o la lista de productos (si products tiene datos).
  return { products, loading, error };
}
