const { Pool } = require('pg');

// Configure aqui os dados do seu banco Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // ou substitua diretamente por sua URL do Neon
  ssl: {
    rejectUnauthorized: false
  }
});

app.delete('/produtos_historico', async (req, res) => {
  const { empresa, data } = req.query;

  if (!empresa || !data) {
    return res.status(400).send('Parâmetros "empresa" e "data" são obrigatórios.');
  }

  try {
    const query = `
      DELETE FROM produtos_historico
      WHERE empresa = $1 AND data = $2
    `;
    const values = [empresa, data];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).send('Nenhum registro encontrado para exclusão.');
    }

    res.status(200).send(`Registros excluídos: ${result.rowCount}`);
  } catch (err) {
    console.error('Erro ao excluir do banco:', err);
    res.status(500).send('Erro ao excluir do banco de dados.');
  }
});
