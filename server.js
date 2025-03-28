const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000; // Usa a porta do Render ou 3000 localmente

app.use(express.json());

// Middleware para forçar HTTPS no Render (opcional)
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Rota do proxy
app.get('/proxy', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL não fornecida');
  }

  try {
    const response = await axios.get(url, {
      responseType: 'text',
      maxRedirects: 5
    });
    res.send(response.data);
  } catch (error) {
    console.error('Erro no proxy:', error);
    res.status(500).send('Erro ao buscar dados');
  }
});

// Inicia o servidor HTTP (Render cuida do HTTPS automaticamente)
app.listen(PORT, () => {
  console.log(`Proxy rodando na porta ${PORT}`);
});