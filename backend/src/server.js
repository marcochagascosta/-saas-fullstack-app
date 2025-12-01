// Importando as ferramentas necessárias
const express = require('express');
const { PrismaClient } = require('@prisma/client');

// --- A CORREÇÃO PARA O PRISMA 7 ESTÁ AQUI ---
// Iniciamos o Prisma Client passando a URL do banco de dados explicitamente.
// Ele vai ler a variável 'DATABASE_URL' do nosso arquivo .env
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Criando a aplicação web com o Express
const app = express();
const port = 3001; // A porta onde nosso backend vai rodar

// Uma rota de teste para sabermos que o servidor está no ar
app.get('/', (req, res) => {
  res.send('Nosso backend está funcionando!');
});

// Uma rota de exemplo para buscar todos os usuários (para testar o Prisma)
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});