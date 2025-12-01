const db = require('../config/database');

// Função para CRIAR uma nova empresa
const createCompany = async (req, res) => {
  const { nome, cnpj } = req.body;
  if (!nome || !cnpj) {
    return res.status(400).json({ error: 'Nome e CNPJ são obrigatórios.' });
  }

  try {
    const result = await db.query(
      'INSERT INTO empresas (nome, cnpj) VALUES ($1, $2) RETURNING *',
      [nome, cnpj]
    );
    res.status(201).json({
      message: 'Empresa criada com sucesso!',
      company: result.rows[0],
    });
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Função para LISTAR TODAS as empresas
const getAllCompanies = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM empresas ORDER BY empresa_id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// --- NOVA FUNÇÃO ABAIXO ---
// Função para buscar UMA empresa pelo seu ID
const getCompanyById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM empresas WHERE empresa_id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Erro ao buscar empresa com ID ${id}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Função para ATUALIZAR uma empresa pelo seu ID
const updateCompany = async (req, res) => {
  const { id } = req.params; // Pega o ID da URL
  const { nome, cnpj } = req.body; // Pega os novos dados do corpo da requisição

  if (!nome || !cnpj) {
    return res.status(400).json({ error: 'Nome e CNPJ são obrigatórios.' });
  }

  try {
    const result = await db.query(
      'UPDATE empresas SET nome = $1, cnpj = $2 WHERE empresa_id = $3 RETURNING *',
      [nome, cnpj, id]
    );

    // Se a consulta não retornou linhas, a empresa não foi encontrada
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada para atualização.' });
    }

    // Retorna os dados da empresa já atualizados
    res.status(200).json({
      message: 'Empresa atualizada com sucesso!',
      company: result.rows[0],
    });
  } catch (error) {
    console.error(`Erro ao atualizar empresa com ID ${id}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Função para DELETAR uma empresa pelo seu ID
const deleteCompany = async (req, res) => {
  const { id } = req.params; // Pega o ID da URL

  try {
    const result = await db.query('DELETE FROM empresas WHERE empresa_id = $1', [id]);

    // O 'result.rowCount' nos diz quantas linhas foram afetadas.
    // Se for 0, significa que nenhuma empresa com aquele ID foi encontrada.
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada para deleção.' });
    }

    // Retorna uma resposta de sucesso, sem conteúdo.
    // Status 204 (No Content) é comum para DELETE, mas 200 com mensagem também é ótimo.
    res.status(200).json({ message: 'Empresa deletada com sucesso!' });

  } catch (error) {
    console.error(`Erro ao deletar empresa com ID ${id}:`, error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};


// Atualize esta linha para exportar tudo
module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};