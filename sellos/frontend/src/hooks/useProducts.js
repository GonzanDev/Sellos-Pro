import { useState, useEffect } from "react";

// Usamos una variable de entorno para la URL de la API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("La respuesta de la red no fue exitosa");
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
  }, []); // El array vacío asegura que esto se ejecute solo una vez

  return { products, loading, error };
}
