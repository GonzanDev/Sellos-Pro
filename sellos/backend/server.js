import express from "express";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Leer productos desde JSON (simulación DB)
const products = JSON.parse(fs.readFileSync("./products.json", "utf-8"));

// Endpoint para productos
app.get("/api/products", (req, res) => {
  res.json(products);
});

/*
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

*/

// Ruta de checkout real con Mercado Pago
app.get("ping", (req, res) => {
  res.send("pong");
}); 

app.post("/create-preference", async (req, res) => {
  const preference = new Preference(client);

  preference.create({
    body: {
      items: [
        {
          title: "Mi producto",
          quantity: 1,
          unit_price: 2000,
        },
      ],
    },
  })
  .then((data) => {
    console.log(data);

    res.status(200).json({
      preferenceId: data.id,
      preference_url: data.init_point,
    });
  })
  .catch(() => {
    res.status(500).json({ error: "Error al crear la preferencia" });
  });
});


app.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
} );
