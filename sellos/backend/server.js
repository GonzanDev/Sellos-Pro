import express from "express";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import nodemailer from "nodemailer";

dotenv.config();

const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
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

// --- FUNCIÓN REUTILIZABLE PARA ENVIAR CORREO ---
// La hemos mejorado para que acepte el 'externalReference' (nuestro ID de pedido)
// y lo incluya en el correo de confirmación.
async function sendConfirmationEmail({
  buyer,
  cart,
  total,
  deliveryMethod,
  address,
  externalReference, // <-- Nuevo parámetro para el ID del pedido
}) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Credenciales de email no configuradas en el archivo .env");
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
              // ... (resto de tu lógica para mostrar la personalización)
              return `<p><strong>${key}:</strong> ${value}</p>`;
            })
            .join("")
        : "<p><em>Sin personalización</em></p>";

      return `
    <li style="margin-bottom:15px;border-bottom:1px solid #eee;padding-bottom:10px;">
      <p><strong>Producto:</strong> ${item.name || item.title} (x${
        item.qty || item.quantity
      })</p>
      <p><strong>Precio unitario:</strong> AR$ ${(
        item.price || item.unit_price
      ).toFixed(2)}</p>
      ${customizationHtml}
    </li>`;
    })
    .join("");

  const deliveryHtml =
    deliveryMethod === "shipping"
      ? `<h3>📦 Dirección de Envío</h3><p>${address.street}, ${address.city}, CP ${address.postalCode}</p>`
      : `<h3>🏪 Método de Entrega</h3><p>Retiro en el local.</p>`;

  // --- ¡NUEVO! ---
  // Construimos el enlace a la página de estado del pedido usando el ID único.
  const orderStatusLink = `${allowedOrigin}/order/${externalReference}`;

  const mailOptions = {
    from: `"SellosPro" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // Se envía a tu propio correo para notificación
    subject: `🧾 Nuevo pedido de ${buyer.name} (${externalReference})`,
    html: `
      <h2>Nuevo pedido recibido</h2>
      <p><strong>ID del Pedido:</strong> ${externalReference}</p>
      <p><strong>Cliente:</strong> ${buyer.name}</p>
      <p><strong>Email:</strong> ${buyer.email}</p>
      <p><strong>Teléfono:</strong> ${buyer.phone}</p>
      <hr>
      ${deliveryHtml}
      <hr>
      <h3>🛒 Detalles del pedido:</h3>
      <ul style="list-style:none;padding:0;margin:0;">${cartHtml}</ul>
      <h3>Total: AR$ ${total.toFixed(2)}</h3>
      <hr>
      <p style="margin-top: 20px;">
        <a href="${orderStatusLink}" style="background-color: #e30613; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Ver Estado del Pedido
        </a>
      </p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(
    `✅ Correo de confirmación enviado para el pedido ${externalReference}.`
  );
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

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
    const { items, buyer, deliveryMethod, address, total } = req.body;

    const preferenceItems = items.map((item) => ({
      title: item.title,
      quantity: Number(item.quantity) || 1,
      unit_price: Number(item.unit_price),
      currency_id: "ARS",
    }));

    const externalReference = `SP-${Date.now()}`;

    const preferenceBody = {
      items: preferenceItems,
      payer: {
        email: buyer?.email,
        name: buyer?.name,
      },
      metadata: {
        buyer,
        // Almacenamos los items del carrito con todos sus detalles (incluida la personalización)
        // para poder usarlos en el correo.
        cart: items,
        total,
        deliveryMethod,
        address,
      },
      notification_url: `${backendUrl}/api/webhook`,
      external_reference: externalReference,
      auto_return: "approved",
      back_urls: {
        success: `${allowedOrigin}/success`,
        failure: `${allowedOrigin}/checkout`,
        pending: `${allowedOrigin}/checkout`,
      },
    };

    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceBody });

    res.status(200).json({
      preferenceId: result.id,
      init_point: result.init_point,
    });
  } catch (error) {
    console.error("❌ Error detallado al crear preferencia:", error);
    res.status(500).json({
      error: "Error al crear la preferencia de pago.",
      details:
        error.cause?.message ||
        error.message ||
        "Error desconocido del servidor.",
    });
  }
});

router.post("/webhook", async (req, res) => {
  console.log("🔔 Webhook de MercadoPago recibido:", req.body);
  const { type, data } = req.body;

  if (type === "payment") {
    try {
      const payment = await new Payment(client).get({ id: data.id });
      console.log("✅ Información del pago:", JSON.stringify(payment, null, 2));

      if (payment.status === "approved" && payment.metadata) {
        console.log(
          `🎉 Pago APROBADO para el pedido ${payment.external_reference}.`
        );

        // --- ¡NUEVO! ---
        // Obtenemos los datos del metadata y el ID del pedido (external_reference)
        const { buyer, cart, total, deliveryMethod, address } =
          payment.metadata;

        // Llamamos a la función de email, pasándole todos los datos necesarios,
        // incluyendo el ID para construir el enlace.
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

// Ruta de prueba (opcional)
router.post("/send-email", async (req, res) => {
  try {
    await sendConfirmationEmail(req.body);
    res
      .status(200)
      .json({ success: true, message: "Correo de prueba enviado." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.use("/api", router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en el puerto ${PORT}`);
});
