import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CompaniesPage from './pages/CompaniesPage';
import UsersPage from './pages/UsersPage';
import Layout from './components/Layout'; 
import { NotificationProvider } from './context/NotificationContext'; 
import DashboardPage from './pages/DashboardPage';

// Este componente verifica o login e renderiza o Layout que, por sua vez,
// renderizará a página filha correta (CompaniesPage, etc.)
const ProtectedLayout = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <Layout />;
};

function App() {
  return (
    // Envolvemos tudo com o Provedor de Notificações
       <NotificationProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" />} /> {/* <-- MUDANÇA */}
          <Route path="/dashboard" element={<ProtectedLayout />}>
            <Route index element={<DashboardPage />} /> {/* <-- ROTA NOVA */}
            <Route path="empresas" element={<CompaniesPage />} />
            <Route path="usuarios" element={<UsersPage />} />
          </Route>
        </Routes>
    </NotificationProvider>
  );
}

export default App;