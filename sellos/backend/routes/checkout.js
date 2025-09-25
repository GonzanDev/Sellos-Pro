/*
import express from "express";
import mercadopago from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Configurar Mercado Pago con el access token desde .env
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});
console.log("🔑 TOKEN MP:", process.env.MERCADOPAGO_ACCESS_TOKEN);
  

// Endpoint de checkout
router.post("/", async (req, res) => {
  try {
    const { items } = req.body; // items viene del frontend

    const preference = {
      items: items.map((item) => ({
        title: item.title,
        unit_price: item.unit_price,
        quantity: item.quantity,
      })),
      back_urls: {
        success: "http://localhost:5173/success", // ajustar según tu frontend
        failure: "http://localhost:5173/failure",
        pending: "http://localhost:5173/pending",
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id }); // devolver el id de la preferencia
  } catch (error) {
    console.error("❌ Error en /checkout:", error);
    res.status(500).json({ error: "Error al crear la preferencia" });
  }
});

export default router;
*/