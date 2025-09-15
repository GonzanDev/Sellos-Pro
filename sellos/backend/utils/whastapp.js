import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const { Client, LocalAuth } = pkg;

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ WhatsApp conectado y listo para enviar mensajes.");
});

client.initialize();

export const sendWhatsAppMessage = async (to, message) => {
  try {
    await client.sendMessage(`${to}@c.us`, message);
    console.log("📩 Mensaje enviado a WhatsApp:", to);
  } catch (error) {
    console.error("❌ Error enviando mensaje:", error);
  }
};
