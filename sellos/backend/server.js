import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// Leer productos desde JSON (simulación DB)
const products = JSON.parse(fs.readFileSync("./products.json", "utf-8"));

// Endpoint para productos
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Endpoint "checkout" demo
app.post("/api/checkout", (req, res) => {
  const { cart } = req.body;
  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: "Carrito vacío" });
  }
  // Aquí se integraría MercadoPago
  res.json({
    success: true,
    message: "Checkout simulado. Aquí iría la integración con MercadoPago.",
    cart,
  });
});

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`)
);
