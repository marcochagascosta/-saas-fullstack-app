import React, { createContext, useState, useContext } from 'react';
import { Snackbar, Alert } from '@mui/material';

// 1. Cria o Contexto
const NotificationContext = createContext();

// 2. Cria o Provedor, que irá gerenciar o estado e a lógica
export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success' // pode ser 'success', 'error', 'warning', 'info'
    });

    const showNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification(prev => ({ ...prev, open: false }));
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000} // A notificação some após 6 segundos
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

// 3. Cria um "Hook" customizado para facilitar o uso do contexto
export const useNotification = () => {
    return useContext(NotificationContext);
};