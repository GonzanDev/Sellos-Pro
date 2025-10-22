import express from "express";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import sgMail from "@sendgrid/mail";

// Carga las variables de entorno (tus claves secretas) desde el archivo .env
dotenv.config();

// Define qué sitios web pueden hacerle peticiones a tu backend.
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

// La URL pública de tu backend para las notificaciones (webhooks).
const backendUrl =
  process.env.RENDER_EXTERNAL_URL ||
  `http://localhost:${process.env.PORT || 8080}`;

console.log("Backend URL:", backendUrl);
const corsOptions = {
  origin: allowedOrigin,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

// ==============================================================================
// 📧 FUNCIÓN PARA ENVIAR EL CORREO DE CONFIRMACIÓN
// ==============================================================================
async function sendConfirmationEmail({
  buyer,
  cart,
  total,
  deliveryMethod,
  address,
  externalReference,
}) {
  // Verificamos que las credenciales de SendGrid existan
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
    console.error(
      "❌ Credenciales de SendGrid (SENDGRID_API_KEY o EMAIL_FROM) no configuradas en el archivo .env"
    );
    return;
  }

  // --- ¡NUEVO! FUNCIÓN PARA ENVIAR ACTUALIZACIONES DE ESTADO ---
  async function sendStatusUpdateEmail({ order }) {
    if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
      console.error("❌ Credenciales de SendGrid no configuradas.");
      return;
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: order.buyer.email,
      from: process.env.EMAIL_FROM,
      subject: `Tu pedido ${order.externalReference} ha sido actualizado`,
      html: `
            <h2>Hola, ${order.buyer.name},</h2>
            <p>El estado de tu pedido ha cambiado a: <strong>${order.status}</strong>.</p>
            <p>Puedes ver los detalles de tu pedido en cualquier momento a través del siguiente enlace:</p>
            <a href="${allowedOrigin}/order/${order.externalReference}">Ver mi pedido</a>
        `,
    };

    try {
      await sgMail.send(msg);
      console.log(
        `✅ Correo de actualización de estado enviado para el pedido ${order.externalReference}.`
      );
    } catch (error) {
      console.error("❌ Error al enviar correo de actualización:", error);
    }
  }

  // Configuramos SendGrid con tu API Key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Construimos la lista de productos para el cuerpo del correo.
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

  const orderStatusLink = `${allowedOrigin}/order/${externalReference}`;

  // Creamos el objeto del mensaje para SendGrid
  const msg = {
    to: [buyer?.email, process.env.EMAIL_FROM].filter(Boolean),
    from: process.env.EMAIL_FROM,
    subject: `🧾 Confirmación de tu pedido en SellosPro (${externalReference})`,
    html: `
      <h2>¡Gracias por tu compra, ${buyer?.name || "Cliente"}!</h2>
      <p><strong>ID del Pedido:</strong> ${externalReference}</p>
      <hr>
      ${deliveryHtml}
      <hr>
      <h3>🛒 Resumen de tu pedido:</h3>
      <ul style="list-style:none;padding:0;margin:0;">${cartHtml}</ul>
      <h3>Total: AR$ ${Number(total || 0).toFixed(2)}</h3>
      <hr>
      <p style="margin-top: 20px;">
        <a href="${orderStatusLink}" style="background-color: #e30613; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
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

// Al iniciar, nos aseguramos de que la carpeta 'orders' exista.
if (!fs.existsSync("./orders")) {
  fs.mkdirSync("./orders");
  console.log("📁 Directorio 'orders' creado.");
}

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
      notification_url: `https://sellos-pro.onrender.com/api/webhook`,
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

router.post("/webhook", async (req, res) => {
  console.log(
    `‼️ Webhook recibido en ${req.originalUrl} con método: ${req.method}`
  );
  console.log("   Cabeceras:", JSON.stringify(req.headers, null, 2));
  console.log("   Cuerpo:", JSON.stringify(req.body, null, 2));
  console.log(
    "🔔 Webhook de MercadoPago recibido:",
    JSON.stringify(req.body, null, 2)
  ); // Logueamos todo el body
  const { type, data } = req.body;

  // Solo procesamos notificaciones de tipo 'payment'
  if (type === "payment") {
    try {
      console.log(`⏳ Obteniendo detalles del pago con ID: ${data?.id}`);
      const payment = await new Payment(client).get({ id: data?.id });

      // --- LOG DE DIAGNÓSTICO IMPORTANTE ---
      // Logueamos el estado del pago y si existe metadata ANTES de la condición.
      console.log(
        `ℹ️ Estado del pago: ${payment?.status}, Metadata: ${
          payment?.metadata ? "Presente" : "Ausente"
        }`
      );

      // Verificamos si el pago está aprobado Y si tenemos los datos necesarios en metadata.
      if (payment?.status === "approved" && payment?.metadata) {
        const externalReference = payment.external_reference;
        console.log(`🎉 Pago APROBADO para el pedido ${externalReference}.`);

        // Extraemos los datos del pedido desde metadata.
        const orderData = {
          ...payment.metadata,
          externalReference,
          status: "Confirmado", // Estado inicial
          createdAt: new Date().toISOString(),
        };

        // --- MANEJO DE ERRORES AL GUARDAR ARCHIVO ---
        try {
          const filePath = `./orders/${externalReference}.json`;
          fs.writeFileSync(filePath, JSON.stringify(orderData, null, 2));
          console.log(
            `📄 Pedido ${externalReference} guardado correctamente en ${filePath}.`
          );

          // Solo intentamos enviar el correo si el archivo se guardó bien.
          await sendConfirmationEmail(orderData);
        } catch (fileError) {
          console.error(
            `❌ Error al guardar el archivo del pedido ${externalReference}:`,
            fileError
          );
          // Considera notificar este error de alguna manera (ej. a ti mismo por correo)
        }
      } else {
        console.log(
          `⚠️ El pago ${data?.id} no está aprobado o no tiene metadata. Estado: ${payment?.status}. No se procesará.`
        );
      }
    } catch (error) {
      console.error(
        `❌ Error al procesar el webhook para el pago ${data?.id}:`,
        error
      );
    }
  } else {
    console.log(`ℹ️ Notificación de tipo '${type}' recibida, ignorando.`);
  }

  // Siempre respondemos 200 OK a MercadoPago para que no siga reintentando.
  res.status(200).send("OK");
});

// --- ¡NUEVA RUTA! PARA OBTENER EL ESTADO DE UN PEDIDO ---
router.get("/order/:orderId", (req, res) => {
  const { orderId } = req.params;
  const filePath = `./orders/${orderId}.json`;

  if (fs.existsSync(filePath)) {
    const orderData = fs.readFileSync(filePath, "utf-8");
    res.status(200).json(JSON.parse(orderData));
  } else {
    res.status(404).json({ error: "Pedido no encontrado." });
  }
});

// ==============================================================================
// 🧪 RUTA DE PRUEBA SIMPLE PARA WEBHOOKS
// ==============================================================================
// Esta ruta solo recibe CUALQUIER método y loguea un mensaje.
// Úsala temporalmente en el panel de MP para ver si llega algo.
router.all("/test-webhook", (req, res) => {
  console.log(
    `✅ ¡Petición recibida en /api/test-webhook! Método: ${req.method}`
  );
  console.log("   Cuerpo:", JSON.stringify(req.body, null, 2));
  res.status(200).send("OK - Test Received");
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
