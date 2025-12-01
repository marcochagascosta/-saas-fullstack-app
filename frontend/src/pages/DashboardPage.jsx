import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value }) => (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140, justifyContent: 'space-between' }}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
            {title}
        </Typography>
        <Typography component="p" variant="h4">
            {value}
        </Typography>
    </Paper>
);

const DashboardPage = () => {
    const [stats, setStats] = useState({ companyCount: 0, userCount: 0 });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [companiesRes, usersRes] = await Promise.all([
                    axios.get('http://localhost:3001/api/companies'),
                    axios.get('http://localhost:3001/api/users')
                ]);

                const companies = companiesRes.data;
                const users = usersRes.data;

                setStats({ companyCount: companies.length, userCount: users.length });

                const dataForChart = companies.map(company => ({
                    name: company.nome,
                    Usuários: users.filter(user => user.empresa_id === company.empresa_id).length
                }));
                setChartData(dataForChart);

            } catch (error) {
                console.error("Erro ao carregar dados do dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return ( <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box> );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography component="h1" variant="h4" gutterBottom>Dashboard</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Empresas Cadastradas" value={stats.companyCount} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard title="Usuários no Sistema" value={stats.userCount} />
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
                         <Typography component="h2" variant="h6" color="primary" gutterBottom>
                            Distribuição de Usuários por Empresa
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5, }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Usuários" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default DashboardPage;