const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// Habilitar CORS solo desde tu frontend
app.use(cors({
  origin: "https://batamotos-ead12.web.app"
}));
app.use(express.json());

// Configurar Mercado Pago con tu token privado
mercadopago.configure({
  access_token: "TEST-1590247296827432-011621-3f413f95ab79018eb374df0daee810b4-641038179",
});

// Ruta para crear preferencia
app.post("/crear-preferencia", async (req, res) => {
  try {
    console.log(req.body);
    const { nombre, precio, cantidad } = req.body;
    const preference = {
      items: [
        {
          title: `Sticker - ${nombre}`,
          quantity: cantidad || 1,
          unit_price: precio,
          currency_id: "COP"
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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
