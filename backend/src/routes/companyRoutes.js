const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware'); 

// --- ROTAS PÚBLICAS --- (Qualquer um pode acessar)
router.get('/', companyController.getAllCompanies);
router.get('/:id', companyController.getCompanyById);

// --- ROTAS PROTEGIDAS --- (Apenas usuários logados podem acessar)
// 2. Adiciona o `protect` ANTES do controller.
router.post('/', protect, companyController.createCompany);
router.put('/:id', protect, companyController.updateCompany);
router.delete('/:id', protect, companyController.deleteCompany);

module.exports = router;