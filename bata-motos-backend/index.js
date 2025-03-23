const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mercadopago.configure({
  access_token: "TEST-1590247296827432-011621-3f413f95ab79018eb374df0daee810b4-641038179"
});

app.post('/crear-preferencia', async (req, res) => {
  const { nombre, precio, cantidad } = req.body;

  try {
    const preference = {
      items: [
        {
          title: `Sticker para ${nombre}`,
          unit_price: parseInt(precio),
          quantity: 1
        }
      ],
      back_urls: {
        success: 'https://batamotos-ead12.web.app/success.html',
        failure: 'https://batamotos-ead12.web.app/error.html',
        pending: 'https://batamotos-ead12.web.app/pending.html'
      },
      auto_return: 'approved'
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: 'Error al crear preferencia' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
