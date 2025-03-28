const express = require('express');
const https = require('https');
const axios = require('axios');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/proxy', async (req, res) => {
  const { url } = req.query;
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

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(port, () => {
  console.log(`Proxy HTTPS rodando em https://localhost:${port}`);
});