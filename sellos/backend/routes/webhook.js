import express from "express";
import { sendWhatsAppMessage } from "../utils/whatsapp.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const payment = req.body; // MercadoPago envía info acá

    if (payment.type === "payment" && payment.data?.id) {
      // ✅ Confirmar en DB o con la API de MP
      console.log("Pago confirmado:", payment);

      // ⚡ Enviar mensaje a WhatsApp
      await sendWhatsAppMessage(
        "54911XXXXXXXX", // tu número (con código país sin +)
        `Nuevo pedido recibido ✅\n\nPago confirmado en MercadoPago.\n\nDetalles: ${JSON.stringify(
          payment,
          null,
          2
        )}`
      );
    }

    res.sendStatus(200);
  } catch (e) {
    console.error("Error en webhook:", e);
    res.sendStatus(500);
  }
});

export default router;
