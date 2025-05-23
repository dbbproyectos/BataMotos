const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// 🔒 Reemplaza por tu contraseña de aplicación de Gmail
const GMAIL_USER = "motospruebabata@gmail.com";
const GMAIL_PASS = "iptg fdnd exfd xxck";

app.use(cors({ origin: "https://batamotos-ead12.web.app" }));
app.use(express.json());

// ✅ Mercado Pago config
mercadopago.configure({
  access_token: "TEST-1590247296827432-011621-3f413f95ab79018eb374df0daee810b4-641038179",
});

// ✅ Función para enviar correo
async function enviarCorreoConfirmacion(datos, numerosGenerados) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });

  const html = `
    <h2>¡Gracias por tu compra, ${datos.nombre}!</h2>
    <p>Se registraron <strong>${datos.sticker}</strong> stickers correctamente.</p>
    <p><strong>Números asignados:</strong></p>
    <ul>
      ${numerosGenerados.map((n) => `<li>${n.toString().padStart(4, '0')}</li>`).join("")}
    </ul>
  `;

  const mailOptions = {
    from: `"Bata Motos" <${GMAIL_USER}>`,
    to: datos.correo,
    subject: "Confirmación de compra - Bata Motos",
    html,
  };

  await transporter.sendMail(mailOptions);
}

// 🧾 Ruta para crear preferencia de pago
app.post("/crear-preferencia", async (req, res) => {
  try {
    let { title, unit_price, quantity } = req.body;

    console.log("🔹 Datos recibidos:", { title, unit_price, quantity });

    unit_price = parseFloat(unit_price);
    quantity = parseInt(quantity);

    if (!title || isNaN(unit_price)) {
      return res.status(400).json({ error: "Faltan datos o el precio no es un número válido." });
    }

    const preference = {
      items: [
        {
          title,
          quantity: quantity || 1,
          unit_price,
          currency_id: "COP",
        },
      ],
      back_urls: {
        success: "https://batamotos-ead12.web.app/success.html",
        failure: "https://batamotos-ead12.web.app/error.html",
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    return res.json({ init_point: response.body.init_point });

  } catch (error) {
    console.error("❌ Error al crear preferencia:", error);
    return res.status(500).json({ error: "Error al generar el pago" });
  }
});

// ✅ Ruta para confirmar compra y enviar correo
app.post("/confirmar-compra", async (req, res) => {
  const { datos, numerosGenerados } = req.body;

  try {
    await enviarCorreoConfirmacion(datos, numerosGenerados);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error al enviar correo:", error.message);
    res.status(500).json({ success: false, error: "Error enviando correo" });
  }
});

// ✅ Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
