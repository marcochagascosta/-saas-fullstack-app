require('dotenv').config();
// Arquivo principal do backend
const express = require('express');
// ... resto do código
const cors = require('cors'); 
const db = require('./config/database');

// Importa as rotas
const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes'); 
const authRoutes = require('./routes/authRoutes'); 

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => { /* ... */ });

// Registra as rotas
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/auth', authRoutes); 

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});