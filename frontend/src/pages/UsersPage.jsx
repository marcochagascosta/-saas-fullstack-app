// ARQUIVO FINAL E CORRIGIDO: frontend/src/pages/UsersPage.jsx

import React, { useState, useEffect, useCallback } from 'react'; // 1. Adicionado useCallback
import axios from 'axios';
import {
    Container, Box, Typography, Button, List, ListItem, ListItemText,
    IconButton, Paper, Modal, TextField, CircularProgress
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const modalStyle = {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: 500, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,
};

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        usuario_id: null, nome: '', email: '', senha: '', empresa_id: ''
    });

    // 2. A função fetchData agora está "memorizada" pelo useCallback.
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [usersRes, companiesRes] = await Promise.all([
                axios.get('http://localhost:3001/api/users'),
                axios.get('http://localhost:3001/api/companies')
            ]);
            setUsers(usersRes.data);
            setCompanies(companiesRes.data);
        } catch (error) {
            console.error("Erro fatal ao buscar dados:", error);
        } finally {
            setLoading(false);
        }
    }, []); // O array vazio diz para o useCallback nunca recriar a função.

    // 3. Agora, o useEffect depende de uma função estável. O loop está quebrado.
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const handleOpenModal = (user = null) => {
        if (user) {
            setFormData({ usuario_id: user.usuario_id, nome: user.nome, email: user.email, senha: '', empresa_id: user.empresa_id || '' });
        } else {
            setFormData({ usuario_id: null, nome: '', email: '', senha: '', empresa_id: '' });
        }
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);
    const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = formData.usuario_id ? 'put' : 'post';
        const url = formData.usuario_id ? `http://localhost:3001/api/users/${formData.usuario_id}` : 'http://localhost:3001/api/users';
        const dataToSend = formData.usuario_id ? { nome: formData.nome, email: formData.email, empresa_id: formData.empresa_id } : formData;

        try {
            await axios[method](url, dataToSend);
            await fetchData(); // Re-busca os dados para garantir consistência
            handleCloseModal();
        } catch (error) { console.error("Erro ao salvar usuário:", error); }
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
            try {
                await axios.delete(`http://localhost:3001/api/users/${userId}`);
                setUsers(prev => prev.filter(u => u.usuario_id !== userId));
            } catch (error) { console.error("Erro ao deletar usuário:", error); }
        }
    };
    
    if (loading) return ( <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box> );

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography component="h1" variant="h4">Gerenciamento de Usuários</Typography>
                <Button variant="contained" startIcon={<AddCircleIcon />} onClick={() => handleOpenModal()}>Novo Usuário</Button>
            </Box>
            <Paper elevation={3}>
                <List>
                    {users.map(user => (
                        <ListItem key={user.usuario_id} divider secondaryAction={ <Box> <IconButton onClick={() => handleOpenModal(user)}><EditIcon /></IconButton> <IconButton onClick={() => handleDelete(user.usuario_id)}><DeleteIcon /></IconButton> </Box> }>
                            <ListItemText primary={user.nome} secondary={user.email} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6">{formData.usuario_id ? 'Editar Usuário' : 'Criar Novo Usuário'}</Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <TextField fullWidth margin="normal" name="nome" label="Nome Completo" value={formData.nome} onChange={handleInputChange} required />
                        <TextField fullWidth margin="normal" name="email" label="Email" type="email" value={formData.email} onChange={handleInputChange} required />
                        {!formData.usuario_id && ( <TextField fullWidth margin="normal" name="senha" label="Senha" type="password" value={formData.senha} onChange={handleInputChange} required /> )}
                        <TextField select fullWidth margin="normal" name="empresa_id" label="Empresa" value={formData.empresa_id} onChange={handleInputChange} required SelectProps={{ native: true }}>
                            <option value=""></option>
                            {companies.map(c => <option key={c.empresa_id} value={c.empresa_id}>{c.nome}</option>)}
                        </TextField>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button onClick={handleCloseModal}>Cancelar</Button>
                            <Button type="submit" variant="contained">Salvar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
};

export default UsersPage;