const db = require('../config/database');
const bcrypt = require('bcrypt');

// Função para CRIAR um novo usuário (VERSÃO SEGURA)
const createUser = async (req, res) => {
  const { nome, email, senha, empresa_id } = req.body;

  if (!nome || !email || !senha || !empresa_id) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // --- A MÁGICA DA SEGURANÇA ACONTECE AQUI ---
    // 2. Gerar o "salt" e o "hash" da senha
    const saltRounds = 10; // Fator de custo. 10 é um bom padrão.
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // 3. Salvar o HASH no banco de dados, não a senha original!
    const newUser = await db.query(
      'INSERT INTO usuarios (nome, email, senha, empresa_id) VALUES ($1, $2, $3, $4) RETURNING usuario_id, nome, email, data_criacao, empresa_id',
      [nome, email, senhaHash, empresa_id] // <-- Usamos a senha hasheada aqui!
    );

    res.status(201).json({
      message: "Usuário criado com sucesso!",
      user: newUser.rows[0],
    });
  } catch (error) {
    // ... (código de tratamento de erro existente)
    if (error.code === '23505') { return res.status(409).json({ error: 'O email fornecido já está em uso.' }); }
    if (error.code === '23503') { return res.status(404).json({ error: 'A empresa com o ID fornecido não existe.' }); }
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

// Função para LISTAR TODOS os usuários
const getAllUsers = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT usuario_id, nome, email, data_criacao, empresa_id FROM usuarios ORDER BY usuario_id ASC'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Função para buscar UM usuário pelo seu ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'SELECT usuario_id, nome, email, data_criacao, empresa_id FROM usuarios WHERE usuario_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Erro ao buscar usuário com ID ${id}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// --- NOVA FUNÇÃO DE UPDATE ABAIXO ---
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body; // Por enquanto, só permitimos alterar nome e email

  if (!nome || !email) {
    return res.status(400).json({ error: 'Nome e Email são obrigatórios.' });
  }

  try {
    const result = await db.query(
      'UPDATE usuarios SET nome = $1, email = $2 WHERE usuario_id = $3 RETURNING usuario_id, nome, email, data_criacao, empresa_id',
      [nome, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado para atualização.' });
    }
    res.status(200).json({ message: 'Usuário atualizado com sucesso!', user: result.rows[0] });
  } catch (error) {
     if (error.code === '23505') { // Conflito de email único
        return res.status(409).json({ error: 'O email fornecido já está em uso por outro usuário.' });
    }
    console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// --- NOVA FUNÇÃO DE DELETE ABAIXO ---
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM usuarios WHERE usuario_id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado para deleção.' });
        }
        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
        console.error(`Erro ao deletar usuário com ID ${id}:`, error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};


// Atualiza a exportação para incluir TUDO
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};