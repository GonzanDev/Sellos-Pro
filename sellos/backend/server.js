import express from "express";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from "mercadopago";
import nodemailer from "nodemailer";

// Carga las variables de entorno del archivo .env
dotenv.config();

// --- SOLUCIÓN AL PROBLEMA DE CORS Y DEPLOY ---
// Leemos el origen permitido desde una variable de entorno.
// Si no existe, usamos la de localhost como fallback para desarrollo.
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

const corsOptions = {
  origin: allowedOrigin,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

console.log(`✅ Origen de CORS permitido: ${allowedOrigin}`);

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

// Verificación de Access Token de MercadoPago
if (!process.env.MP_ACCESS_TOKEN) {
  console.error(
    "🔴 ¡Error Crítico! No se encontró la variable MP_ACCESS_TOKEN en el archivo .env del backend."
  );
  process.exit(1);
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

let products = [];
try {
  products = JSON.parse(fs.readFileSync("./products.json", "utf-8"));
} catch (error) {
  console.error("🔴 Error leyendo products.json:", error.message);
}

const router = express.Router();

router.get("/products", (req, res) => {
  res.json(products);
});

router.post("/create-preference", async (req, res) => {
  try {
    const { items, buyer, shipping_cost, address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "El campo 'items' es inválido o está vacío." });
    }

    const preferenceItems = items.map((item) => {
      const unit_price = Number(item.unit_price);
      const quantity = Number(item.quantity) || 1;
      if (isNaN(unit_price) || isNaN(quantity)) {
        throw new Error("Precio o cantidad inválida en uno de los items.");
      }
      return {
        title: item.title,
        quantity: quantity,
        unit_price: unit_price,
        currency_id: "ARS",
      };
    });

    if (shipping_cost && shipping_cost > 0) {
      const shippingPrice = Number(shipping_cost);
      if (isNaN(shippingPrice)) {
        throw new Error("Costo de envío inválido.");
      }
      preferenceItems.push({
        title: "Costo de Envío",
        quantity: 1,
        unit_price: shippingPrice,
        currency_id: "ARS",
      });
    }

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: preferenceItems,
        payer: {
          name: buyer?.name || "Comprador",
          email: buyer?.email || "test_user@mercadopago.com",
          phone: { number: buyer?.phone || "" },
          ...(address && {
            address: {
              street_name: address.street,
              zip_code: address.postalCode,
            },
          }),
        },
        // --- URLS DE RETORNO DINÁMICAS ---
        back_urls: {
          success: `${allowedOrigin}/success`,
          failure: `${allowedOrigin}/failure`,
          pending: `${allowedOrigin}/pending`,
        },
      },
    });

    res.status(200).json({
      preferenceId: result.id,
      init_point: result.init_point,
    });
  } catch (error) {
    console.error(
      "❌ Error detallado al crear preferencia:",
      JSON.stringify(error, null, 2)
    );
    res.status(500).json({
      error: "Error al crear la preferencia de pago.",
      details:
        error.cause?.message ||
        error.message ||
        "Error desconocido del servidor.",
    });
  }
});

router.post("/send-email", async (req, res) => {
  try {
    const { buyer, cart, total, deliveryMethod, address } = req.body;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error(
        "Credenciales de email no configuradas en el archivo .env"
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

const cartHtml = cart
  .map((item) => {
const customizationHtml = item.customization
  ? Object.entries(item.customization)
      .map(([key, value]) => {
        if (!value) return "";

        // 🔹 Si es color, mostramos el cuadrito + nombre del color
        if (key.toLowerCase() === "color") {
          let colorName = value; // fallback: mostrar el hex si no hay nombre

          if (item.colors && Array.isArray(item.colors)) {
            const foundColor = item.colors.find(
              (c) => c.hex.toLowerCase() === value.toLowerCase()
            );
            if (foundColor) colorName = foundColor.name;
          }

          return `<p><strong>Color:</strong> 
            <span style="display:inline-block;width:14px;height:14px;border:1px solid #ccc;background:${value};margin-left:5px;"></span> 
            ${colorName}
          </p>`;
        }

        // 🔹 Si es logo
        if (key === "logoPreview") {
          return `<p><strong>Logo:</strong><br><img src="${value}" alt="Logo personalizado" style="max-height:80px;border:1px solid #ddd;border-radius:4px;"></p>`;
        }

        // 🔹 Si es comentario adicional
        if (key.toLowerCase() === "comentarios" || key.toLowerCase() === "comentario") {
          return `<p><strong>🗒️ Comentarios adicionales:</strong> ${value}</p>`;
        }

        // 🔹 Resto de campos
        return `<p><strong>${key}:</strong> ${value}</p>`;
      })
      .join("")
  : "<p><em>Sin personalización</em></p>";

    return `
      <li style="margin-bottom:15px;border-bottom:1px solid #eee;padding-bottom:10px;">
        <p><strong>Producto:</strong> ${item.name} (x${item.qty || 1})</p>
        <p><strong>Precio unitario:</strong> AR$ ${item.price.toFixed(2)}</p>
        ${customizationHtml}
      </li>`;
  })
  .join("");


    const deliveryHtml =
      deliveryMethod === "shipping"
        ? `<h3>📦 Dirección de Envío</h3><p>${address.street}, ${address.city}, CP ${address.postalCode}</p>`
        : `<h3>🏪 Método de Entrega</h3><p>Retiro en el local.</p>`;

    const mailOptions = {
      from: `"SellosPro" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `🧾 Nuevo pedido de ${buyer.name}`,
      html: `
        <h2>Nuevo pedido recibido</h2>
        <p><strong>Cliente:</strong> ${buyer.name}</p>
        <p><strong>Email:</strong> ${buyer.email}</p>
        <p><strong>Teléfono:</strong> ${buyer.phone}</p>
        <hr>
        ${deliveryHtml}
        <hr>
        <h3>🛒 Detalles del pedido:</h3>
        <ul style="list-style:none;padding:0;margin:0;">${cartHtml}</ul>
        <h3>Total: AR$ ${total.toFixed(2)}</h3>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Correo enviado" });
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.use("/api", router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en el puerto ${PORT}`);
});
