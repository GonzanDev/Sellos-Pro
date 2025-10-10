import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // --- LÍNEA DE DIAGNÓSTICO ---
    // Esto nos dirá la URL exacta que se está usando en producción.
    console.log("Intentando conectar con la API en:", API_URL);

    setLoading(true);
    fetch(`${API_URL}/products`)
      .then((res) => {
        if (!res.ok) {
          // Si la respuesta es 404, el error se lanzará aquí.
          throw new Error(
            `La respuesta de la red no fue exitosa (Status: ${res.status})`
          );
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error cargando productos", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
}
