const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");
require("dotenv").config(); // ✅ Carga variables del archivo .env

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

app.post("/crear-preferencia", async (req, res) => {
  try {
    const { nombre, precio, cantidad } = req.body;

    const preference = {
      items: [
        {
          title: `Sticker - ${nombre}`,
          quantity: cantidad || 1,
          unit_price: precio,
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

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
