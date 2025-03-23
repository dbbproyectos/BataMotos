import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mercadopago.configure({
  access_token: "TEST-1590247296827432-011621-3f413f95ab79018eb374df0daee810b4-641038179", // Este token debe estar en Railway como variable
});

app.post("/crear-preferencia", async (req, res) => {
  try {
    const { title, unit_price } = req.body;

    const preference = {
      items: [{
        title,
        quantity: 1,
        unit_price: Number(unit_price),
        currency_id: "COP"
      }],
      back_urls: {
        success: "https://batamotos-ead12.web.app/success.html",
        failure: "https://batamotos-ead12.web.app/error.html"
      },
      auto_return: "approved"
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });

  } catch (err) {
    console.error("❌ Error en el backend:", err);
    res.status(500).json({ error: "No se pudo crear la preferencia" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
