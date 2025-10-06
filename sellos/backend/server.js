import express from "express";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from "mercadopago";
import nodemailer from "nodemailer";

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





/// MAIL SENDING
// ===============================
// 📧 ENDPOINT PARA ENVIAR EMAIL
// ===============================
app.post("/send-email", async (req, res) => {
  try {
    const { buyer, cart, total } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Sellos Sarlanga" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // te lo envías a vos mismo por ahora
      subject: `🧾 Nuevo pedido de ${buyer.name}`,
      html: `
        <h2>Nuevo pedido recibido</h2>
        <p><strong>Cliente:</strong> ${buyer.name}</p>
        <p><strong>Teléfono:</strong> ${buyer.phone}</p>
        <h3>Detalles del carrito:</h3>
        <ul>
          ${cart
            .map(
              (item) =>
                `<li>${item.name} - Cantidad: ${item.qty || 1} - AR$ ${
                  item.price * (item.qty || 1)
                }</li>`
            )
            .join("")}
        </ul>
        <p><strong>Total:</strong> AR$ ${total}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("📩 Email enviado correctamente.");
    res.status(200).json({ success: true, message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =======================================================
// 🚀 INICIAR SERVIDOR (siempre al final)
// =======================================================
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
