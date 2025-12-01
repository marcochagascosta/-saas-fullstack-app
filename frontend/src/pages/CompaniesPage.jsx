// ARQUIVO FINAL, CORRIGIDO E PROFISSIONAL: frontend/src/pages/CompaniesPage.jsx

import React, { useState, useEffect, useCallback } from 'react'; // 1. Adicionado useCallback
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';
// 2. A importação de 'Container' foi removida para limpar o aviso
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Paper, Modal, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const modalStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, };

const CompaniesPage = () => {
    const { showNotification } = useNotification();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [formData, setFormData] = useState({ nome: '', cnpj: '' });

    // 3. A função fetchCompanies agora está "memorizada" pelo useCallback.
    // Ela só será recriada se 'showNotification' mudar (o que nunca acontece).
    const fetchCompanies = useCallback(async () => { 
        try { 
            const res = await axios.get('http://localhost:3001/api/companies'); 
            setCompanies(res.data); 
        } catch (e) { 
            console.error("Falha ao buscar empresas:", e); 
            showNotification('Falha ao carregar a lista de empresas.', 'error');
        } finally { 
            setLoading(false); 
        } 
    }, [showNotification]);

    // 4. Agora podemos adicionar 'fetchCompanies' com segurança ao array de dependências.
    useEffect(() => { 
        fetchCompanies(); 
    }, [fetchCompanies]);
    
    // O resto das funções continua igual...
    const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const handleModalFormChange = (e) => { const { name, value } = e.target; setEditingCompany(prev => ({ ...prev, [name]: value })); };
    const handleEditClick = (company) => { setEditingCompany(company); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setEditingCompany(null); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/companies', formData);
            setCompanies(prev => [...prev, response.data.company]);
            setFormData({ nome: '', cnpj: '' });
            showNotification('Empresa criada com sucesso!', 'success');
        } catch (error) { showNotification(error.response?.data?.error || 'Erro ao criar empresa.', 'error'); }
    };
    
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:3001/api/companies/${editingCompany.empresa_id}`, editingCompany);
            setCompanies(prev => prev.map(c => (c.empresa_id === editingCompany.empresa_id ? response.data.company : c)));
            handleCloseModal();
            showNotification('Empresa atualizada com sucesso!', 'success');
        } catch (error) { showNotification(error.response?.data?.error || 'Erro ao atualizar empresa.', 'error'); }
    };

    const handleDelete = async (companyId) => {
        if (window.confirm("Tem certeza?")) {
            try {
                await axios.delete(`http://localhost:3001/api/companies/${companyId}`);
                setCompanies(prev => prev.filter(c => c.empresa_id !== companyId));
                showNotification('Empresa deletada.', 'info');
            } catch (error) { showNotification(error.response?.data?.error || 'Erro ao deletar empresa.', 'error'); }
        }
    };

    if (loading) return ( <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box> );

    return (
        <>
            <Typography component="h1" variant="h4" gutterBottom>Gerenciamento de Empresas</Typography>
            <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                <Typography component="h2" variant="h6" gutterBottom>Cadastrar Nova Empresa</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField fullWidth name="nome" label="Nome da Empresa" value={formData.nome} onChange={handleInputChange} required />
                    <TextField fullWidth name="cnpj" label="CNPJ" value={formData.cnpj} onChange={handleInputChange} required />
                    <Button type="submit" variant="contained" sx={{ height: '56px' }}>Criar</Button>
                </Box>
            </Paper>
            <Paper elevation={3}>
                <List>
                    {companies.map((company) => (
                        <ListItem key={company.empresa_id} divider secondaryAction={ <Box> <IconButton onClick={() => handleEditClick(company)}><EditIcon /></IconButton> <IconButton onClick={() => handleDelete(company.empresa_id)}><DeleteIcon /></IconButton> </Box> }>
                            <ListItemText primary={company.nome} secondary={`CNPJ: ${company.cnpj}`} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">Editar Empresa</Typography>
                    {editingCompany && (
                        <Box component="form" onSubmit={handleUpdateSubmit} sx={{ mt: 2 }}>
                            <TextField fullWidth margin="normal" name="nome" label="Nome da Empresa" value={editingCompany.nome} onChange={handleModalFormChange} required />
                            <TextField fullWidth margin="normal" name="cnpj" label="CNPJ" value={editingCompany.cnpj} onChange={handleModalFormChange} required />
                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button onClick={handleCloseModal}>Cancelar</Button>
                                <Button type="submit" variant="contained">Salvar Alterações</Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default CompaniesPage;