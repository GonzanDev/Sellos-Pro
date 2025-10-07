import express from "express";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from "mercadopago";
import nodemailer from "nodemailer";

dotenv.config();

// =======================================================
// ✅ CONFIGURACIÓN DE CORS
// =======================================================
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

// =======================================================
// 💳 MERCADO PAGO SDK
// =======================================================
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// =======================================================
// 📦 LECTURA DE PRODUCTOS
// =======================================================
let products = [];
try {
  products = JSON.parse(fs.readFileSync("./products.json", "utf-8"));
} catch (error) {
  console.error(
    "🔴 Error leyendo products.json:",
    error.message
  );
}

// =======================================================
// 🛍️ ENDPOINTS DE PRODUCTOS Y TEST
// =======================================================
app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/ping", (req, res) => res.send("pong"));

// =======================================================
// 💰 CREAR PREFERENCIA DE PAGO
// =======================================================
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
          phone: { number: buyer?.phone || "" },
          email: "test_user@mercadopago.com",
        },
        back_urls: {
          success: "http://localhost:5173/success",
          failure: "http://localhost:5173/failure",
          pending: "http://localhost:5173/pending",
        },
      },
    });

    res.status(200).json({
      preferenceId: result.id,
      init_point: result.init_point,
    });
  } catch (error) {
    console.error("❌ Error al crear preferencia:", error);
    res.status(500).json({
      error: "Error al crear la preferencia",
      details: error.message,
    });
  }
});

// =======================================================
// 📧 ENVIAR CORREO CON DETALLE DE PEDIDO
// =======================================================
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

    // Generar el HTML del carrito con personalización
    const cartHtml = cart
      .map((item) => {
        const personalizacionHtml = item.personalizacion
          ? Object.entries(item.personalizacion)
              .map(([key, value]) => {
                if (!value) return "";

                // Color como cuadro
                if (key.toLowerCase() === "color") {
                  return `
                    <p><strong>${key}:</strong>
                      <span style="display:inline-block;width:16px;height:16px;border:1px solid #ccc;background:${value};margin-left:5px;"></span>
                      (${value})
                    </p>`;
                }

                // Logo
                if (key === "logoPreview") {
                  return `<p><strong>Logo:</strong><br><img src="${value}" alt="Logo personalizado" style="max-height:80px;border:1px solid #ddd;border-radius:4px;"></p>`;
                }

                // Otros campos
                return `<p><strong>${key}:</strong> ${value}</p>`;
              })
              .join("")
          : "<p><em>Sin personalización</em></p>";

        return `
          <li style="margin-bottom:15px;border-bottom:1px solid #eee;padding-bottom:10px;">
            <p><strong>Producto:</strong> ${item.name}</p>
            <p><strong>Cantidad:</strong> ${item.qty || 1}</p>
            <p><strong>Precio unitario:</strong> AR$ ${item.price}</p>
            ${personalizacionHtml}
          </li>`;
      })
      .join("");

    const mailOptions = {
      from: `"Sellos Sarlanga" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `🧾 Nuevo pedido de ${buyer.name}`,
      html: `
        <h2>Nuevo pedido recibido</h2>
        <p><strong>Cliente:</strong> ${buyer.name}</p>
        <p><strong>Teléfono:</strong> ${buyer.phone}</p>

        <h3>🛒 Detalles del pedido:</h3>
        <ul style="list-style:none;padding:0;margin:0;">
          ${cartHtml}
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
// 🚀 INICIAR SERVIDOR
// =======================================================
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
