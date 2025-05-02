const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000; // Usa a porta do Render ou 3000 localmente
// No seu `server.js` (Render)
app.use((req, res, next) => {
  // Permite qualquer origem (ajuste se precisar ser mais restritivo)
  res.header('Access-Control-Allow-Origin', '*');
  // Métodos permitidos
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // Cabeçalhos permitidos
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Adiciona cabeçalhos comuns

  // Se for uma requisição OPTIONS (preflight), responda imediatamente com 200 OK
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
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

// Nova rota para deletar produtos_historico
app.delete('/produtos_historico', (req, res) => {
  const { empresa, data } = req.query;

  if (!empresa || !data) {
    return res.status(400).send('Parâmetros "empresa" e "data" são obrigatórios.');
  }

  console.log(`Recebida requisição DELETE para /produtos_historico`);
  console.log(`Empresa: ${empresa}, Data: ${data}`);
  // TODO: Adicionar aqui a lógica para deletar o histórico do banco de dados
  res.status(200).send(`Histórico para ${empresa} na data ${data} marcado para exclusão (lógica não implementada).`);
});

// Inicia o servidor HTTP (Render cuida do HTTPS automaticamente)
app.listen(PORT, () => {
  console.log(`Proxy rodando na porta ${PORT}`);
});