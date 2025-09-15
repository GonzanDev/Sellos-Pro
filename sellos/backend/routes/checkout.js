import express from "express";
import mercadopago from "mercadopago";

const router = express.Router();

// Configuración MercadoPago
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN, // tu token de MercadoPago
});

router.post("/", async (req, res) => {
  try {
    const { cart } = req.body;

    const preference = {
      items: cart.map((item) => ({
        title: item.name,
        unit_price: item.price,
        quantity: item.qty,
        currency_id: "ARS",
      })),
      back_urls: {
        success: "http://localhost:5173/success",
        failure: "http://localhost:5173/failure",
      },
      auto_return: "approved",
      notification_url: "http://localhost:4000/api/webhook", // webhook backend
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });
  } catch (error) {
    console.error("Error en checkout:", error);
    res.status(500).json({ error: "No se pudo generar la preferencia" });
  }
});

export default router;
