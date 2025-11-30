const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota para CRIAR um novo usuário (POST /api/users)
router.post('/', userController.createUser);

// READ ALL (GET /api/users)
router.get('/', userController.getAllUsers);

// READ ONE (GET /api/users/:id)
router.get('/:id', userController.getUserById);

// UPDATE
router.put('/:id', userController.updateUser);

// DELETE
router.delete('/:id', userController.deleteUser);


module.exports = router;