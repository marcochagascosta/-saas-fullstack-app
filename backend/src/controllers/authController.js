const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    // 1. Encontrar o usuário pelo email
    const userQuery = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (userQuery.rows.length === 0) {
      // Usamos uma mensagem genérica para não informar se o email existe ou não
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const user = userQuery.rows[0];

    // 2. Comparar a senha fornecida com o hash do banco
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 3. Gerar o "passaporte" (JWT)
    const tokenPayload = {
        id: user.usuario_id,
        email: user.email,
        nome: user.nome,
    };
    
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '8h', // O passaporte expira em 8 horas
    });

    // 4. Enviar o token de volta para o cliente
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = {
  login,
};