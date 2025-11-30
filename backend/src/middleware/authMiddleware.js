const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // 1. Procurar pelo token no cabeçalho 'Authorization'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrai o token do cabeçalho (formato: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verifica se o token é válido e não expirou
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Se for válido, anexa os dados do usuário à requisição para uso futuro
      // (Não estamos buscando no banco aqui para ser mais rápido, mas poderíamos)
      req.user = decoded; 

      // 4. Libera a passagem para o próximo passo (o controller)
      next();

    } catch (error) {
      console.error('Erro na autenticação do token:', error);
      res.status(401).json({ error: 'Não autorizado, token falhou.' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Não autorizado, sem token.' });
  }
};

module.exports = { protect };