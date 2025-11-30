// Importa o pacote 'dotenv' para carregar as variáveis de ambiente
require('dotenv').config();

// Importa a classe Pool do pacote 'pg'
const { Pool } = require('pg');

// Cria uma nova instância do Pool de conexões
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // Opcional: Adiciona SSL para conexões em produção
  // ssl: {
  //   rejectUnauthorized: false 
  // }
});

// Testa a conexão com o banco de dados
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erro ao conectar com o banco de dados PostgreSQL:', err.stack);
  } else {
    console.log('✅ Conexão com o banco de dados PostgreSQL estabelecida com sucesso.');
    console.log('   Data e hora do servidor de banco de dados:', res.rows[0].now);
  }
});

// Exporta o pool de conexões para ser usado em outras partes da aplicação
module.exports = {
  query: (text, params) => pool.query(text, params),
};