/**
 * ==============================================================================
 * 📦 SERVIDOR BACKEND DE E-COMMERCE (Sellospro)
 * ==============================================================================
 *
 * Descripción: Este archivo es el servidor principal de la aplicación, construido
 * con Node.js y Express. Se encarga de:
 * 1. Servir productos.
 * 2. Gestionar la creación de pagos con MercadoPago.
 * 3. Recibir notificaciones (webhooks) de MercadoPago.
 * 4. Guardar pedidos confirmados en el sistema de archivos.
 * 5. Enviar correos transaccionales (confirmación, cotización) con SendGrid.
 * 6. Manejar la subida de archivos (logos) para cotizaciones con Multer.
 */

// ==============================================================================
// 📚 IMPORTACIONES DE MÓDULOS
// ==============================================================================
import express from "express"; // Framework web principal para crear el servidor y las rutas API.
import cors from "cors"; // Middleware para habilitar el Cross-Origin Resource Sharing (permite que el frontend se comunique con este backend).
import fs from "fs"; // Módulo nativo de Node.js para interactuar con el sistema de archivos (leer/escribir archivos).
import dotenv from "dotenv"; // Para cargar variables de entorno (claves secretas) desde un archivo .env.
import { MercadoPagoConfig, Preference, Payment } from "mercadopago"; // SDK de MercadoPago para procesar pagos.
import sgMail from "@sendgrid/mail"; // SDK de SendGrid para enviar correos electrónicos transaccionales.
// --- ¡NUEVO! Importamos Multer ---
import multer from "multer"; // Middleware para manejar la subida de archivos (ej. logos de clientes).

// Carga las variables de entorno (tus claves secretas) desde el archivo .env
dotenv.config();

// ==============================================================================
// ⚙️ CONFIGURACIÓN INICIAL
// ==============================================================================

// --- Configuración de Multer ---
// Configura multer para almacenar temporalmente los archivos subidos en la memoria RAM del servidor.
// Esto es eficiente para archivos pequeños (como logos) que se procesarán y enviarán por email,
// sin necesidad de guardarlos permanentemente en el disco del servidor.
const upload = multer({ storage: multer.memoryStorage() });

// --- Configuración de CORS ---
// Define qué sitios web (orígenes) tienen permiso para hacer peticiones a este backend.
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

// --- Configuración de URL Pública ---
// Determina la URL pública de este backend.
// Es crucial para que servicios externos (como MercadoPago) puedan enviar notificaciones (webhooks).
// Intenta usar variables de entorno de Ngrok (local), Render (producción), o un valor por defecto.
const backendUrl =
  process.env.PUBLIC_BACKEND_URL || // Para ngrok en local
  process.env.RENDER_EXTERNAL_URL || // Para producción en Render
  `http://localhost:${process.env.PORT || 8080}`;

console.log(`✅ Origen de CORS permitido: ${allowedOrigin}`);
console.log(`✅ URL pública del backend configurada para: ${backendUrl}`);

// Opciones de configuración detalladas para CORS.
const corsOptions = {
  origin: allowedOrigin, // Solo permite peticiones del origen definido.
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Métodos HTTP permitidos.
  credentials: true, // Permite el envío de cookies o cabeceras de autorización.
  optionsSuccessStatus: 204, // Responde con 204 (No Content) a las peticiones OPTIONS (pre-flight).
};

// ==============================================================================
// 📧 FUNCIÓN PARA ENVIAR EL CORREO DE CONFIRMACIÓN (CORREGIDA)
// ==============================================================================
/**
 * Envía un correo de confirmación de pedido tanto al cliente como al email del negocio.
 * Utiliza SendGrid y una plantilla HTML compleja para formatear los detalles del pedido.
 *
 * @param {object} params - Objeto con los datos del pedido.
 * @param {object} params.buyer - Información del comprador (email, nombre, teléfono).
 * @param {Array<object>} params.cart - Array de productos en el carrito.
 * @param {number} params.total - Monto total de la compra.
 * @param {string} params.deliveryMethod - "shipping" (envío) o "pickup" (retiro).
 * @param {object} params.address - Dirección de envío (si aplica).
 * @param {string} params.externalReference - ID único del pedido (ej. SP-123456789).
 */
async function sendConfirmationEmail({
  buyer,
  cart,
  total,
  deliveryMethod,
  address,
  externalReference,
}) {
  // Verificación de seguridad: comprueba que las claves de SendGrid estén cargadas.
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
    console.error(
      "❌ Credenciales de SendGrid (SENDGRID_API_KEY o EMAIL_FROM) no configuradas en el archivo .env"
    );
    return; // Detiene la ejecución si faltan claves.
  }

  // --- ¡CORRECCIÓN! LA LÓGICA DE EMAIL AHORA ESTÁ DENTRO DE LA FUNCIÓN ---

  // Inicializa la API de SendGrid con la clave.
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Genera el HTML para la lista de productos en el carrito.
  const cartHtml = cart
    .map((item) => {
      // Mapea las personalizaciones (color, líneas, comentarios) a HTML legible.
      const customizationHtml = item.customization
        ? Object.entries(item.customization)
            .map(([key, value]) => {
              if (!value) return ""; // Ignoramos campos vacíos

              // 🎨 Caso especial: Si la clave es "color", muestra el nombre y un cuadro de muestra.
              if (key.toLowerCase() === "color") {
                let colorName = value;
                // Intenta buscar el nombre del color basado en el hex
                if (item.colors && Array.isArray(item.colors)) {
                  const foundColor = item.colors.find(
                    (c) =>
                      c.hex.toLowerCase() === String(value).trim().toLowerCase()
                  );
                  if (foundColor) colorName = foundColor.name;
                }

                return `
                  <p style="margin: 2px 0; font-size: 11px; color: #555;">
                    <strong>Color:</strong>
                    <span style="
                      display: inline-block;
                      width: 10px;
                      height: 10px;
                      border: 1px solid #ccc;
                      border-radius: 2px;
                      background-color: ${String(value).trim()};
                      vertical-align: middle;
                      margin-right: 4px;
                    "></span>
                    ${colorName}
                  </p>
                `;
              }

              // 🎨 Caso especial: Si el valor es un código HEX, muestra solo un cuadro de muestra.
              const isHex = /^#([0-9A-F]{3}){1,2}$/i.test(String(value).trim());
              if (isHex) {
                return `
                  <p style="margin: 2px 0; font-size: 11px; color: #555;">
                    <strong>${key.replace("line", "Línea ")}:</strong>
                    <span style="
                      display: inline-block;
                      width: 10px;
                      height: 10px;
                      border: 1px solid #ccc;
                      border-radius: 2px;
                      background-color: ${String(value).trim()};
                      vertical-align: middle;
                      margin-left: 4px;
                    "></span>
                  </p>
                `;
              }

              // 📝 Caso especial: Formato para comentarios.
              if (key === "comentarios") {
                return `<p style="margin: 2px 0; font-size: 11px; color: #555;"><strong>Comentarios:</strong> <em>${value}</em></p>`;
              }

              // 🔤 Caso general: Muestra "Clave: Valor" (ej. "Línea 1: Texto de prueba").
              return `<p style="margin: 2px 0; font-size: 11px; color: #555;"><strong>${key.replace(
                "line",
                "Línea "
              )}:</strong> ${value}</p>`;
            })
            .join("")
        : '<p style="margin: 2px 0; font-size: 11px; color: #888;"><em>Sin personalización</em></p>';

      // HTML para cada fila de producto en la tabla del resumen.
      return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <p style="margin: 0; font-weight: bold; color: #333;">${
            item.name || item.title
          } (x${item.qty || item.quantity})</p>
          <div style="padding-left: 10px; margin-top: 5px;">${customizationHtml}</div>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; color: #333; font-weight: bold;">
          AR$ ${(item.price || item.unit_price).toFixed(2)}
        </td>
      </tr>
    `;
    })
    .join("");

  // --- DIRECCIÓN ACTUALIZADA ---
  // Genera el bloque HTML para la información de entrega (envío o retiro).
  const deliveryHtml =
    deliveryMethod === "shipping"
      ? `<h4>📦 Dirección de Envío</h4><p style="margin: 5px 0; color: #555;">${address.street}, ${address.city}, CP ${address.postalCode}</p>`
      : `<h4>🏪 Método de Entrega</h4><p style="margin: 5px 0; color: #555;">Retiro en el local (Bermejo 477, Mar del Plata)</p>`;

  // Enlace para que el cliente pueda ver el estado de su pedido en el frontend.
  const orderStatusLink = `${allowedOrigin}/order/${externalReference}`;

  // --- NUEVA PLANTILLA HTML PROFESIONAL ---
  // Plantilla principal del correo, usando CSS inline para máxima compatibilidad con clientes de email.
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background-color: #e30613; color: white; padding: 25px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 30px; color: #333; line-height: 1.6; }
        .content h2 { color: #e30613; margin-top: 0; font-size: 22px; }
        .content h3 { color: #333; margin-top: 25px; border-bottom: 1px solid #eee; padding-bottom: 8px; font-size: 18px; }
        .info-box { background-color: #f9f9f9; border-radius: 5px; padding: 15px; margin-top: 10px; }
        .order-summary table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .order-summary th { text-align: left; color: #888; font-size: 12px; padding-bottom: 8px; border-bottom: 2px solid #eee; text-transform: uppercase; }
        .total-row strong { font-size: 18px; color: #e30613; }
        .button-container { text-align: center; margin-top: 30px; }
        .button { background-color: #e30613; color: white !important; padding: 14px 28px; text-decoration: none !important; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px; border: none; cursor: pointer; }
        .footer { background-color: #f9f9f9; color: #888; text-align: center; padding: 20px; font-size: 12px; border-top: 1px solid #e0e0e0; }
        a { color: #e30613; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Sellospro</h1>
        </div>
        <div class="content">
          <h2>¡Gracias por tu compra, ${buyer?.name || "Cliente"}!</h2>
          <p>Hemos recibido tu pedido y lo estamos procesando. A continuación, encontrarás los detalles:</p>
          
          <div class="info-box">
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
          </div>
          
          <h3>🚚 Información de Entrega</h3>
          ${deliveryHtml}

          <h3>🛒 Resumen del Pedido</h3>
          <div class="order-summary">
            <table cellpadding="0" cellspacing="0" style="width: 100%;">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th style="text-align: right;">Precio</th>
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

          <div class="button-container">
            <a href="${orderStatusLink}" class="button" style="color: white !important;">Ver Estado del Pedido</a>
          </div>
          
          <p style="margin-top: 30px; font-size: 12px; color: #888;">Si tienes alguna pregunta, no dudes en <a href="mailto:${
            process.env.EMAIL_FROM
          }">contactarnos</a>.</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Sellospro. Todos los derechos reservados.
        </div>
      </div>
    </body>
    </html>
  `;

  // Construye el objeto de mensaje para la API de SendGrid.
  const msg = {
    to: [buyer?.email, process.env.EMAIL_FROM].filter(Boolean), // Envía al cliente Y al admin (filtrando valores nulos si el email del comprador no existe).
    from: {
      email: process.env.EMAIL_FROM,
      name: "Sellospro", // Nombre que aparece en el "De:".
    },
    subject: `Confirmación de tu pedido en Sellospro (${externalReference})`,
    html: emailHtml,
  };

  // Bloque try/catch para el envío real del correo.
  try {
    await sgMail.send(msg);
    console.log(
      `✅ Correo de confirmación enviado via SendGrid para el pedido ${externalReference}.`
    );
  } catch (error) {
    console.error("❌ Error al enviar correo con SendGrid:", error);
    if (error.response) {
      // Si SendGrid devuelve un error detallado, lo mostramos.
      console.error(error.response.body);
    }
  }
}

// ==============================================================================
// 💸 ¡NUEVO! FUNCIÓN PARA ENVIAR SOLICITUD DE PRESUPUESTO
// ==============================================================================
/**
 * Envía un correo INTERNO (al admin/email del negocio) con una solicitud de cotización.
 * Este correo incluye los datos del cliente, los detalles del producto y,
 * crucialmente, adjunta el archivo del logo subido por el cliente.
 *
 * @param {object} params
 * @param {object} params.product - Información del producto a cotizar.
 * @param {object} params.customization - Detalles de personalización (líneas, etc.).
 * @param {number} params.quantity - Cantidad solicitada.
 * @param {object} params.buyer - Datos de contacto del solicitante (nombre, email, tel).
 * @param {Buffer} params.logoBuffer - El archivo del logo en formato Buffer (directo desde multer).
 * @param {string} params.logoFileName - El nombre original del archivo del logo.
 */
async function sendBudgetRequestEmail({
  product,
  customization,
  quantity,
  buyer,
  logoBuffer,
  logoFileName,
}) {
  // Verificación de credenciales.
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
    console.error("❌ Credenciales de SendGrid no configuradas.");
    return;
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // Formatea los detalles de personalización para el cuerpo del correo.
  const customizationHtml = customization
    ? Object.entries(customization)
        .map(([key, value]) => {
          // Filtra campos irrelevantes o vacíos (ej. el preview de la imagen o el nombre del archivo).
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

  // Formatea los datos del solicitante.
  const buyerHtml = `
    <h3>👤 Datos del Solicitante</h3>
    <p><strong>Nombre:</strong> ${buyer.name}</p>
    <p><strong>Email:</strong> ${buyer.email}</p>
    <p><strong>Teléfono:</strong> ${buyer.phone}</p>
  `;

  // Prepara el archivo adjunto para SendGrid.
  let attachments = [];
  if (logoBuffer && logoFileName) {
    attachments.push({
      content: logoBuffer.toString("base64"), // El contenido del archivo debe ir en formato Base64.
      filename: logoFileName, // El nombre original del archivo.
      type: "application/octet-stream", // Tipo MIME genérico para adjuntos.
      disposition: "attachment", // Indica que es un adjunto.
    });
  }

  // Construye el mensaje para SendGrid.
  const msg = {
    to: process.env.EMAIL_FROM, // Se envía solo al correo del negocio.
    from: {
      email: process.env.EMAIL_FROM,
      name: "Sellospro (Cotización)", // Nombre descriptivo para la alerta.
    },
    subject: `⚠️ Solicitud de Presupuesto: ${product.name}`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
        .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; color: #333; line-height: 1.6; }
        .content h3 { color: #333; margin-top: 25px; border-bottom: 1px solid #eee; padding-bottom: 8px; font-size: 18px; }
        .footer { background-color: #f9f9f9; color: #888; text-align: center; padding: 20px; font-size: 12px; border-top: 1px solid #e0e0e0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header" style="background-color: #059e05;">
          <h1>Solicitud de Presupuesto</h1>
        </div>
        <div class="content">
          <p>Se ha recibido una nueva solicitud de presupuesto para un producto con logo.</p>
          <p><strong>El logo del cliente viene adjunto en este correo.</strong></p>
          <hr>
          ${buyerHtml} 
          <hr>
          <h3>Producto Solicitado</h3>
          <p><strong>Nombre:</strong> ${product.name}</p>
          <p><strong>ID:</strong> ${product.id}</p>
          <p><strong>Cantidad solicitada:</strong> ${quantity}</p>
          <hr>
          <h3>Detalles de Personalización</h3>
          ${customizationHtml}
          <hr>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Sellospro.
        </div>
      </div>
    </body>
    </html>
  `,
    attachments: attachments, // ¡Importante! Adjuntamos el logo.
  };

  // Envío del correo.
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
const app = express(); // Instancia principal de Express.

// Aplica la configuración de CORS a todas las rutas.
app.use(cors(corsOptions));

// IMPORTANTE: No usamos express.json() de forma global.
// Esto se debe a que `multer` (para subida de archivos "multipart/form-data")
// y `express.json()` (para "application/json") son middlewares de parseo de
// cuerpo (body) y no pueden operar simultáneamente en la misma ruta fácilmente.
//
// En su lugar, aplicaremos `express.json()` (o `multer`) solo a las rutas
// específicas que lo necesiten.
// app.use(express.json());

// ==============================================================================
// ⚙️ CONFIGURACIÓN DE CLIENTES Y DATOS
// ==============================================================================

// Configura el cliente de MercadoPago con el Access Token secreto.
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// Verificación de inicio: Asegura que el directorio para guardar pedidos exista.
if (!fs.existsSync("./orders")) {
  fs.mkdirSync("./orders");
  console.log("📁 Directorio 'orders' creado.");
}

// Carga la lista de productos desde un archivo JSON local.
// Esto actúa como una base de datos simple para los productos.
let products = [];
try {
  products = JSON.parse(fs.readFileSync("./products.json", "utf-8"));
} catch (error) {
  console.error("🔴 Error leyendo products.json:", error.message);
}

// Creamos un enrutador de Express para organizar las rutas bajo el prefijo /api.
const router = express.Router();

// ==============================================================================
// ↔️ RUTAS DE LA API
// ==============================================================================

/**
 * @route   GET /api/products
 * @desc    Obtiene la lista completa de productos desde el archivo local.
 * @access  Público
 * @returns {Array<object>} Un array con todos los productos.
 */
router.get("/products", (req, res) => {
  res.json(products);
});

/**
 * @route   POST /api/create-preference
 * @desc    Crea una preferencia de pago en MercadoPago.
 * @access  Público
 * @middleware express.json() - Esta ruta SÍ usa el parser de JSON para el body.
 * @body    {Array} cart - Carrito de compras.
 * @body    {object} buyer - Datos del comprador.
 * @body    {string} deliveryMethod - Método de entrega ("shipping" o "pickup").
 * @body    {object} address - Dirección de envío (si aplica).
 * @body    {number} total - Total de la compra.
 * @returns {object} { preferenceId, init_point } - ID de la preferencia y URL de pago.
 */
router.post("/create-preference", express.json(), async (req, res) => {
  try {
    const { cart, buyer, deliveryMethod, address, total } = req.body || {};
    // Genera un ID único para este pedido, basado en la fecha actual (timestamp).
    const externalReference = `SP-${Date.now()}`;

    // Construye el cuerpo de la preferencia según la API de MercadoPago.
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
      // Metadata: ¡Crucial! Guardamos los datos de la orden (carrito, envío, etc.)
      // para recuperarlos en el webhook cuando el pago sea aprobado.
      metadata: { buyer, cart, total, deliveryMethod, address },
      // URL a la que MercadoPago enviará la notificación de pago (webhook).
      notification_url: `https://sellos-pro.onrender.com/api/webhook`, // TODO: Usar la variable `backendUrl`
      external_reference: externalReference, // Nuestro ID de pedido.
      back_urls: {
        // URLs a las que el cliente es redirigido tras el pago.
        success: `${allowedOrigin}/success`,
        failure: `${allowedOrigin}/failure`,
        pending: `${allowedOrigin}/pending`,
      },
      auto_return: "approved", // Redirige automáticamente si el pago es aprobado.
    };

    // Crea la preferencia usando el SDK de MP.
    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceBody });

    // Devuelve al frontend la URL de pago (init_point) y el ID.
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

/**
 * @route   POST /api/webhook
 * @desc    Recibe notificaciones de pago (webhooks) desde MercadoPago.
 * @access  Público (Llamado por MercadoPago)
 * @middleware express.json() - Esta ruta también usa el parser de JSON.
 */
router.post("/webhook", express.json(), async (req, res) => {
  console.log("🔔 Webhook de MercadoPago recibido:", req.body);
  const { type, data } = req.body;

  // Nos interesa solo el evento de tipo 'payment'.
  if (type === "payment") {
    try {
      // Obtenemos los detalles completos del pago usando el ID proporcionado por el webhook.
      const payment = await new Payment(client).get({ id: data.id });
      console.log(
        `ℹ️ Estado del pago: ${payment?.status}, Metadata: ${
          payment?.metadata ? "Presente" : "Ausente"
        }`
      );

      // ¡El paso más importante!
      // Verificamos que el pago esté 'approved' (aprobado) y
      // que contenga la 'metadata' que enviamos al crear la preferencia.
      if (payment.status === "approved" && payment.metadata) {
        const externalReference = payment.external_reference;
        console.log(`🎉 Pago APROBADO para el pedido ${externalReference}.`);

        // Combinamos la metadata (carrito, cliente, etc.) con los datos del pago.
        const orderData = {
          ...payment.metadata, // Contiene cart, buyer, total, deliveryMethod, address
          externalReference,
          status: "Confirmado", // Marcamos el pedido como confirmado.
          createdAt: new Date().toISOString(),
        };

        // Bloque try/catch para guardar la orden y enviar el email.
        try {
          // 1. Guardar la orden como un archivo JSON en el servidor.
          const filePath = `./orders/${externalReference}.json`;
          fs.writeFileSync(filePath, JSON.stringify(orderData, null, 2));
          console.log(
            `📄 Pedido ${externalReference} guardado correctamente en ${filePath}.`
          );

          // 2. Enviar el email de confirmación al cliente y al admin.
          await sendConfirmationEmail(orderData);
        } catch (fileError) {
          console.error(
            `❌ Error al guardar el archivo o enviar email para ${externalReference}:`,
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

  // Respondemos 200 OK a MercadoPago para confirmar que recibimos el webhook.
  // Si no respondemos 200, MP seguirá intentando enviarlo.
  res.status(200).send("OK");
});

/**
 * @route   POST /api/request-budget
 * @desc    (¡NUEVA!) Recibe una solicitud de presupuesto con un logo adjunto.
 * @access  Público
 * @middleware upload.single('logoFile') - ¡Esta ruta usa Multer! NO usa express.json().
 * @form-data {string} product - Datos del producto (en formato JSON string).
 * @form-data {string} customization - Detalles (en formato JSON string).
 * @form-data {string} quantity - Cantidad (en formato JSON string).
 * @form-data {string} buyer - Datos del cliente (en formato JSON string).
 * @form-data {File}   logoFile - El archivo del logo adjunto (campo "logoFile").
 */
router.post("/request-budget", upload.single("logoFile"), async (req, res) => {
  console.log("📨 Solicitud de presupuesto recibida.");

  try {
    // El archivo (logo) se encuentra en req.file gracias a multer.
    const logoFile = req.file; // Puede ser undefined si no se sube un archivo.
    
    // Los demás campos de texto (que vienen del form-data) están en req.body.
    const { product, customization, quantity, buyer } = req.body;

    console.log(
      "  Archivo:",
      logoFile ? logoFile.originalname : "No hay archivo"
    );

    // Validación de entrada (mantenemos la misma, el archivo ya no es obligatorio aquí).
    if (!product || !customization || !buyer) {
      console.warn("Faltan datos en la solicitud de presupuesto.");
      return res
        .status(400)
        .json({ error: "Faltan datos en el formulario." });
    }

    // 1. Parseo de datos (IMPRESCINDIBLE)
    const productData = JSON.parse(product);
    const customizationData = JSON.parse(customization);
    const buyerData = JSON.parse(buyer);

    // 2. Definición condicional de los datos del archivo
    const fileData = {
        logoBuffer: logoFile ? logoFile.buffer : null, // Es null si no hay archivo
        logoFileName: logoFile ? logoFile.originalname : null, // Es null si no hay archivo
    };

    // 3. Llamamos a la función de email, pasando los datos del archivo solo si existen.
    await sendBudgetRequestEmail({
      product: productData,
      customization: customizationData,
      quantity: Number(quantity),
      buyer: buyerData,
      ...fileData, // Usamos el objeto condicional
    });

    res.status(200).json({ success: true, message: "Solicitud recibida." });
  } catch (error) {
    console.error("❌ Error al procesar solicitud de presupuesto:", error);
    // Puedes mejorar este mensaje para el frontend
    res.status(500).json({ error: "No se pudo procesar la solicitud." });
  }
});

/**
 * @route   GET /api/order/:orderId
 * @desc    Obtiene los datos de un pedido específico guardado localmente (JSON).
 * @access  Público
 * @param   {string} orderId - El ID del pedido (ej. SP-123456789).
 * @returns {object} Los datos del pedido si se encuentra.
 * @returns {404} { error: "Pedido no encontrado." } si no existe.
 */
router.get("/order/:orderId", (req, res) => {
  const { orderId } = req.params;
  const filePath = `./orders/${orderId}.json`;

  // Verifica si el archivo JSON de la orden existe.
  if (fs.existsSync(filePath)) {
    // Si existe, lo lee y lo devuelve.
    const orderData = fs.readFileSync(filePath, "utf-8");
    res.status(200).json(JSON.parse(orderData));
  } else {
    // Si no existe, devuelve un error 404.
    res.status(404).json({ error: "Pedido no encontrado." });
  }
});

/**
 * @route   POST /api/send-email
 * @desc    Ruta de prueba (testing/debug) para forzar el envío de un correo de confirmación.
 * @access  Desarrollo
 * @middleware express.json()
 * @body    {object} Payload simulado de una orden (requiere cart, buyer, total, etc.).
 */
router.post("/send-email", express.json(), async (req, res) => {
  try {
    const payload = { ...req.body };
    // Aseguramos que tenga un ID de referencia para la prueba
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

// ==============================================================================
// 🚀 INICIO DEL SERVIDOR
// ==============================================================================

// Aplica el enrutador a la app principal bajo el prefijo /api.
// Todas las rutas definidas en `router` serán accesibles (ej. /api/products, /api/webhook).
app.use("/api", router);

// Define el puerto del servidor, tomando el valor de .env o usando 8080 por defecto.
const PORT = process.env.PORT || 8080;

// Inicia el servidor y escucha en el puerto definido.
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en el puerto ${PORT}`);
});


// Ruta simple para mantener el servidor despierto
app.get('/ping', (req, res) => {
  console.log("Ping recibido a las: " + new Date().toLocaleString());
  res.status(200).send('¡Estoy despierto!');
});
