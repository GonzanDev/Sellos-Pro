import express from "express";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import sgMail from "@sendgrid/mail";
// --- ¡NUEVO! Importamos Multer ---
import multer from "multer";

// Carga las variables de entorno (tus claves secretas) desde el archivo .env
dotenv.config();

// --- Configuración de Multer ---
// Le decimos que guarde los archivos temporalmente en la memoria del servidor
const upload = multer({ storage: multer.memoryStorage() });

// Define qué sitios web pueden hacerle peticiones a tu backend.
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

// La URL pública de tu backend para las notificaciones (webhooks).
const backendUrl =
  process.env.PUBLIC_BACKEND_URL || // Para ngrok en local
  process.env.RENDER_EXTERNAL_URL || // Para producción en Render
  `http://localhost:${process.env.PORT || 8080}`;

console.log(`✅ Origen de CORS permitido: ${allowedOrigin}`);
console.log(`✅ URL pública del backend configurada para: ${backendUrl}`);

const corsOptions = {
  origin: allowedOrigin,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

// ==============================================================================
// 📧 FUNCIÓN PARA ENVIAR EL CORREO DE CONFIRMACIÓN (CORREGIDA)
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

  // --- ¡CORRECCIÓN! LA LÓGICA DE EMAIL AHORA ESTÁ DENTRO DE LA FUNCIÓN ---

  // Configuramos SendGrid con tu API Key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Construimos la lista de productos para el cuerpo del correo.
  const cartHtml = cart
    .map((item) => {
      const customizationHtml = item.customization
        ? Object.entries(item.customization)
            .map(([key, value]) => {
              if (!value) return ""; // Ignoramos campos vacíos
              if (key === "comentarios") {
                return `<p style="margin: 2px 0; font-size: 11px; color: #555;"><strong>Comentarios:</strong> <em>${value}</em></p>`;
              }
              return `<p style="margin: 2px 0; font-size: 11px; color: #555;"><strong>${key.replace(
                "line",
                "Línea "
              )}:</strong> ${value}</p>`;
            })
            .join("")
        : '<p style="margin: 2px 0; font-size: 11px; color: #888;"><em>Sin personalización</em></p>';

      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <p style="margin: 0; font-weight: bold; color: #333;">${
              item.name || item.title
            } (x${item.qty || item.quantity})</p>
            <div style="padding-left: 10px; margin-top: 5px;">${customizationHtml}</div>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; color: #333;">
            AR$ ${(item.price || item.unit_price).toFixed(2)}
          </td>
        </tr>
      `;
    })
    .join("");

  const deliveryHtml =
    deliveryMethod === "shipping"
      ? `<h4>📦 Dirección de Envío</h4><p style="margin: 5px 0; color: #555;">${address.street}, ${address.city}, CP ${address.postalCode}</p>`
      : `<h4>🏪 Método de Entrega</h4><p style="margin: 5px 0; color: #555;">Retiro en el local (Avenida Luro 3247, Mar del Plata)</p>`;

  const orderStatusLink = `${allowedOrigin}/order/${externalReference}`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        /* ... (tus estilos de email sin cambios) ... */
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>SellosPro</h1></div>
        <div class="content">
          <h2>¡Gracias por tu compra, ${buyer?.name || "Cliente"}!</h2>
          <p>Hemos recibido tu pedido y lo estamos procesando. A continuación, encontrarás los detalles:</p>
          <h3>📄 Datos del Pedido</h3>
          <p style="margin: 5px 0;"><strong>ID del Pedido:</strong> ${externalReference}</p>
          <h3>👤 Datos del Comprador</h3>
          <p style="margin: 5px 0;"><strong>Nombre:</strong> ${
            buyer?.name || "N/D"
          }</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${
            buyer?.email || "N/D"
          }</p>
          <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${
            buyer?.phone || "N/D"
          }</p>
          <h3>🚚 Información de Entrega</h3>
          ${deliveryHtml}
          <h3>🛒 Resumen del Pedido</h3>
          <div class="order-summary">
            <table cellpadding="0" cellspacing="0" style="width: 100%;">
              <thead>
                <tr>
                  <th style="padding-bottom: 8px;">Producto</th>
                  <th style="padding-bottom: 8px; text-align: right;">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${cartHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td style="padding-top: 15px; border-top: 2px solid #eee; text-align: right; font-weight: bold;" colspan="1">Total:</td>
                  <td style="padding-top: 15px; border-top: 2px solid #eee; text-align: right;" class="total-row"><strong>AR$ ${Number(
                    total || 0
                  ).toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="button-container" style="text-align: center; margin-top: 30px;">
            <a href="${orderStatusLink}" style="background-color: #e30613; color: white !important; padding: 12px 25px; text-decoration: none !important; border-radius: 5px; font-weight: bold; display: inline-block;">Ver Estado del Pedido</a>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #888;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SellosPro. Todos los derechos reservados.
        </div>
      </div>
    </body>
    </html>
  `;

  const msg = {
    to: [buyer?.email, process.env.EMAIL_FROM].filter(Boolean),
    from: process.env.EMAIL_FROM,
    subject: `Confirmación de tu pedido en SellosPro (${externalReference})`,
    html: emailHtml,
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
// 💸 ¡NUEVO! FUNCIÓN PARA ENVIAR SOLICITUD DE PRESUPUESTO
// ==============================================================================
// Esta función se llama cuando un usuario pide cotización para un producto con logo
async function sendBudgetRequestEmail({
  product,
  customization,
  quantity,
  buyer,
  logoBuffer,
  logoFileName,
}) {
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
    console.error("❌ Credenciales de SendGrid no configuradas.");
    return;
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Formateamos la personalización para el correo
  const customizationHtml = customization
    ? Object.entries(customization)
        .map(([key, value]) => {
          if (
            !value ||
            key === "logoPreview" ||
            key === "logoFile" ||
            key === "fileName"
          )
            return "";
          return `<p><strong>${key.replace(
            "line",
            "Línea "
          )}:</strong> ${value}</p>`;
        })
        .join("")
    : "Sin detalles.";

  // Formateamos los datos del solicitante
  const buyerHtml = `
    <h3>👤 Datos del Solicitante</h3>
    <p><strong>Nombre:</strong> ${buyer.name}</p>
    <p><strong>Email:</strong> ${buyer.email}</p>
    <p><strong>Teléfono:</strong> ${buyer.phone}</p>
  `;

  // Creamos un adjunto para SendGrid
  let attachments = [];
  if (logoBuffer && logoFileName) {
    attachments.push({
      content: logoBuffer.toString("base64"),
      filename: logoFileName,
      type: "application/octet-stream",
      disposition: "attachment",
    });
  }

  const msg = {
    to: process.env.EMAIL_FROM, // Se envía a tu correo de negocio
    from: process.env.EMAIL_FROM, // Remitente verificado
    subject: `⚠️ Solicitud de Presupuesto: ${product.name}`,
    html: `
      <h2>Nueva Solicitud de Presupuesto</h2>
      <p>Un cliente ha solicitado un presupuesto para un producto con logo.</p>
      <p><strong>El logo del cliente viene adjunto en este correo.</strong></p>
      <hr>
      ${buyerHtml} 
      <hr>
      <h3>Producto</h3>
      <p><strong>Nombre:</strong> ${product.name}</p>
      <p><strong>ID:</strong> ${product.id}</p>
      <p><strong>Cantidad solicitada:</strong> ${quantity}</p>
      <hr>
      <h3>Detalles de Personalización</h3>
      ${customizationHtml}
      <hr>
    `,
    attachments: attachments, // Adjuntamos el logo
  };

  try {
    await sgMail.send(msg);
    console.log(
      `✅ Correo de solicitud de presupuesto enviado para ${product.name}.`
    );
  } catch (error) {
    console.error("❌ Error al enviar correo de presupuesto:", error);
    if (error.response) console.error(error.response.body);
  }
}

// ==============================================================================
// 🚀 CONFIGURACIÓN DEL SERVIDOR EXPRESS
// ==============================================================================
const app = express();
app.use(cors(corsOptions));
// NO usamos express.json() globalmente para que multer funcione
// app.use(express.json());

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

// Ruta para obtener los productos
router.get("/products", (req, res) => {
  res.json(products);
});

// =================================================================
// Ruta para crear una preferencia de pago en MercadoPago
// Usamos express.json() solo para esta ruta
// =================================================================
router.post("/create-preference", express.json(), async (req, res) => {
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
      notification_url: `https://sellos-pro.onrender.com/api/webhook`, // URL hardcodeada
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
// Usamos express.json() solo para esta ruta
// ==============================================================================
router.post("/webhook", express.json(), async (req, res) => {
  console.log("🔔 Webhook de MercadoPago recibido:", req.body);
  const { type, data } = req.body;

  if (type === "payment") {
    try {
      const payment = await new Payment(client).get({ id: data.id });
      console.log(
        `ℹ️ Estado del pago: ${payment?.status}, Metadata: ${
          payment?.metadata ? "Presente" : "Ausente"
        }`
      );

      if (payment.status === "approved" && payment.metadata) {
        const externalReference = payment.external_reference;
        console.log(`🎉 Pago APROBADO para el pedido ${externalReference}.`);

        const orderData = {
          ...payment.metadata,
          externalReference,
          status: "Confirmado",
          createdAt: new Date().toISOString(),
        };

        try {
          const filePath = `./orders/${externalReference}.json`;
          fs.writeFileSync(filePath, JSON.stringify(orderData, null, 2));
          console.log(
            `📄 Pedido ${externalReference} guardado correctamente en ${filePath}.`
          );

          await sendConfirmationEmail(orderData);
        } catch (fileError) {
          console.error(
            `❌ Error al guardar el archivo del pedido ${externalReference}:`,
            fileError
          );
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
  }
  res.status(200).send("OK");
});

// ==============================================================================
// 💸 ¡NUEVA RUTA! PARA MANEJAR SOLICITUDES DE PRESUPUESTO
// Esta ruta usa multer para archivos, NO express.json()
// ==============================================================================
router.post("/request-budget", upload.single("logoFile"), async (req, res) => {
  console.log("📨 Solicitud de presupuesto recibida.");

  try {
    const logoFile = req.file;
    const { product, customization, quantity, buyer } = req.body;

    console.log(
      "  Archivo:",
      logoFile ? logoFile.originalname : "No hay archivo"
    );
    console.log("  Datos (texto):", req.body);

    if (!product || !customization || !buyer || !logoFile) {
      console.warn("Faltan datos en la solicitud de presupuesto.");
      return res
        .status(400)
        .json({ error: "Faltan datos o el archivo del logo." });
    }

    // Parseamos los datos que vienen como texto JSON
    const productData = JSON.parse(product);
    const customizationData = JSON.parse(customization);
    const buyerData = JSON.parse(buyer);

    await sendBudgetRequestEmail({
      product: productData,
      customization: customizationData,
      quantity: Number(quantity),
      buyer: buyerData,
      logoBuffer: logoFile.buffer,
      logoFileName: logoFile.originalname,
    });

    res.status(200).json({ success: true, message: "Solicitud recibida." });
  } catch (error) {
    console.error("❌ Error al procesar solicitud de presupuesto:", error);
    res.status(500).json({ error: "No se pudo procesar la solicitud." });
  }
});

// Ruta para obtener un pedido
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

// Ruta de prueba
router.post("/send-email", express.json(), async (req, res) => {
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
