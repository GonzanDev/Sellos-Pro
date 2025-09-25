import express from "express";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from "mercadopago";

dotenv.config();

// =======================================================
// ✅ CONFIGURACIÓN EXPLÍCITA DE CORS
// =======================================================
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

const app = express();
app.use(cors(corsOptions)); // Usa la configuración explícita
app.use(express.json());

// SDK de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN, // tu token privado en .env
});

// Manejo robusto de la lectura del archivo (sin cambios)
let products = [];
try {
  products = JSON.parse(fs.readFileSync("./products.json", "utf-8"));
} catch (error) {
  console.error(
    "🔴 Error leyendo products.json: Asegúrate de que el archivo exista y sea JSON válido.",
    error.message
  );
}

// Endpoint para productos
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Endpoint de prueba
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.post("/create-preference", async (req, res) => {
  try {
    const { items, buyer } = req.body;
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: items.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          unit_price: Number(item.unit_price),
          currency_id: "ARS",
        })),
        payer: {
          name: buyer?.name || "Comprador",
          phone: {
            area_code: "",
            number: buyer?.phone || "",
          },
          email: "test_user@mercadopago.com",
        },

        back_urls: {
          success: "http://localhost:5173/success",
          failure: "http://localhost:5173/failure",
          pending: "http://localhost:5173/pending",
        },
      },
    }); // CAMBIO IMPORTANTE: Ahora también enviamos el init_point

    res.status(200).json({
      preferenceId: result.id,
      init_point: result.init_point, // <--- ¡Añade esta línea!
    });
  } catch (error) {
    console.error("❌ Error al crear preferencia:", error);
    res.status(500).json({
      error: "Error al crear la preferencia",
      details: error.message,
    });
  }
});

// Solo un listen
const PORT = 8080;
app.listen(PORT, () =>
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`)
);
