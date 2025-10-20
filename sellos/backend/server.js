import express from "express";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import sgMail from "@sendgrid/mail";

// Carga las variables de entorno (tus claves secretas) desde el archivo .env
dotenv.config();

// Define qué sitios web pueden hacerle peticiones a tu backend.
// En producción, será tu URL de Vercel. En local, será localhost.
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

// La URL pública de tu backend. Es crucial para que MercadoPago sepa a dónde enviar las notificaciones (webhooks).
// En local, usaremos la URL que nos da ngrok. En producción, Render la provee automáticamente.
const backendUrl =
  process.env.PUBLIC_BACKEND_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  `http://localhost:${process.env.PORT || 8080}`;

const corsOptions = {
  origin: allowedOrigin,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

// ==============================================================================
// 📧 FUNCIÓN PARA ENVIAR EL CORREO DE CONFIRMACIÓN
// ==============================================================================
// Esta función es ahora más completa. Recibe el ID del pedido ('externalReference')
// para incluirlo en el correo y en el enlace para ver el estado.
async function sendConfirmationEmail({
  buyer,
  cart,
  total,
  deliveryMethod,
  address,
  externalReference,
}) {
  // Verificamos que la API Key de SendGrid exista en el .env
  if (!process.env.SENDGRID_API_KEY) {
    console.error("❌ SENDGRID_API_KEY no configurada en el archivo .env");
    return;
  }
  // Configuramos SendGrid con tu API Key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Verificamos que el email del remitente (verificado en SendGrid) exista
  if (!process.env.EMAIL_FROM) {
    console.error("❌ EMAIL_FROM no configurado en el archivo .env");
    return;
  }
}

// Construimos la lista de productos para el cuerpo del correo, incluyendo la personalización.
const cartHtml = cart
  .map((item) => {
    const customizationHtml = item.customization
      ? Object.entries(item.customization)
          .map(([key, value]) => {
            if (!value) return "";
            return `<p style="margin: 2px 0; font-size: 12px;"><strong>${key}:</strong> ${value}</p>`;
          })
          .join("")
      : "";

    return `
    <li style="margin-bottom:15px;border-bottom:1px solid #eee;padding-bottom:10px;">
      <p><strong>Producto:</strong> ${item.name} (x${item.qty || 1})</p>
      <div style="padding-left: 15px;">${customizationHtml}</div>
    </li>`;
  })
  .join("");

const deliveryHtml =
  deliveryMethod === "shipping"
    ? `<h3>📦 Dirección de Envío</h3><p>${address.street}, ${address.city}, CP ${address.postalCode}</p>`
    : `<h3>🏪 Método de Entrega</h3><p>Retiro en el local.</p>`;

// Si no se pasa externalReference (correo de prueba), generamos uno temporal
const extRef = externalReference || `TEST-${Date.now()}`;

// Creamos el enlace a la página de estado del pedido.
const orderStatusLink = `${allowedOrigin}/order/${extRef}`;

const msg = {
  to: [buyer?.email, process.env.EMAIL_FROM].filter(Boolean), // Envía al cliente y a ti
  from: process.env.EMAIL_FROM, // Debe ser un email verificado en SendGrid
  subject: `🧾 Confirmación de tu pedido en SellosPro (${externalReference})`,
  html: `
      <h2>¡Gracias por tu compra, ${buyer?.name || "Cliente"}!</h2>
      <p>Hemos recibido tu pedido y lo estamos procesando.</p>
      <p><strong>ID del Pedido:</strong> ${externalReference}</p>
      <hr>
      ${deliveryHtml}
      <hr>
      <h3>🛒 Resumen de tu pedido:</h3>
      <ul style="list-style:none;padding:0;margin:0;">${cartHtml}</ul>
      <h3>Total: AR$ ${Number(total || 0).toFixed(2)}</h3>
      <hr>
      <p style="margin-top: 20px;">
        <a href="${orderStatusLink}" style="background-color: #e30613; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Ver Estado del Pedido
        </a>
      </p>
    `,
};

try {
  await sgMail.send(msg);
  console.log(
    `✅ Correo de confirmación enviado via SendGrid para el pedido ${externalReference}.`
  );
} catch (error) {
  console.error("❌ Error al enviar correo con SendGrid:", error);
  if (error.response) {
    console.error(error.response.body);
  }
}
// ==============================================================================
// 🚀 CONFIGURACIÓN DEL SERVIDOR EXPRESS
// ==============================================================================
const app = express();
app.use(cors(corsOptions));
app.use(express.json());

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

// Ruta para obtener los productos
router.get("/products", (req, res) => {
  res.json(products);
});

// =================================================================
// Ruta para crear una preferencia de pago en MercadoPago
router.post("/create-preference", async (req, res) => {
  try {
    const { cart, buyer, deliveryMethod, address, total } = req.body || {};
    const externalReference = `SP-${Date.now()}`;

    const preferenceBody = {
      items: (cart || []).map((item) => ({
        title: item.name,
        quantity: Number(item.qty) || 1,
        unit_price: Number(item.price),
        currency_id: "ARS",
      })),
      payer: {
        email: buyer?.email,
        name: buyer?.name,
      },
      metadata: { buyer, cart, total, deliveryMethod, address },
      notification_url: `${backendUrl}/api/webhook`,
      external_reference: externalReference,
      back_urls: {
        success: `${allowedOrigin}/success`,
        failure: `${allowedOrigin}/failure`,
        pending: `${allowedOrigin}/pending`,
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceBody });

    res.status(200).json({
      preferenceId: result.id ?? result.body?.id,
      init_point: result.init_point ?? result.body?.init_point,
    });
  } catch (error) {
    console.error("❌ Error detallado al crear preferencia:", error);
    res.status(500).json({
      error: "Error al crear la preferencia de pago.",
      details:
        error?.cause?.message ||
        error?.message ||
        "Error desconocido del servidor.",
    });
  }
});

// ==============================================================================
// 🔔 RUTA WEBHOOK PARA RECIBIR NOTIFICACIONES DE MP
// ==============================================================================
router.post("/webhook", async (req, res) => {
  console.log("🔔 Webhook de MercadoPago recibido:", req.body);
  const { type, data } = req.body;

  if (type === "payment") {
    try {
      const payment = await new Payment(client).get({ id: data.id });

      if (payment.status === "approved" && payment.metadata) {
        console.log(
          `🎉 Pago APROBADO para el pedido ${payment.external_reference}.`
        );
        const { buyer, cart, total, deliveryMethod, address } =
          payment.metadata;
        await sendConfirmationEmail({
          buyer,
          cart,
          total,
          deliveryMethod,
          address,
          externalReference: payment.external_reference,
        });
      }
    } catch (error) {
      console.error("❌ Error al procesar el webhook:", error);
    }
  }
  res.status(200).send("OK");
});

// Ruta de prueba
router.post("/send-email", async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.externalReference) {
      payload.externalReference = `TEST-${Date.now()}`;
    }
    await sendConfirmationEmail(payload);
    res
      .status(200)
      .json({ success: true, message: "Correo de prueba enviado." });
  } catch (error) {
    console.error("Error enviando correo de prueba:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.use("/api", router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en el puerto ${PORT}`);
});
