import express from "express";
import mercadopago from "mercadopago";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

app.post("/create_preference", async (req, res) => {
  try {
    const { items } = req.body;
    const preference = {
      items: items.map((p) => ({
        title: p.name,
        unit_price: p.price,
        quantity: p.qty,
      })),
      back_urls: {
        success: "http://localhost:5173/success",
        failure: "http://localhost:5173/failure",
      },
      auto_return: "approved",
    };
    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () =>
  console.log("Backend corriendo en http://localhost:3001")
);
