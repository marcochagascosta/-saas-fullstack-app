import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    AppBar, Toolbar, Typography, Drawer, List, ListItem,
    ListItemButton, ListItemIcon, ListItemText, Box, CssBaseline
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240; // Define a largura do nosso menu lateral

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* BARRA SUPERIOR (APP BAR) */}
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Meu Painel SaaS
          </Typography>
        </Toolbar>
      </AppBar>

      {/* MENU LATERAL (DRAWER) */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar /> {/* Espaçador */}
        <List>
          {/* NOVO LINK PARA O DASHBOARD */}
          <ListItem key="Dashboard" disablePadding>
            <ListItemButton onClick={() => navigate("/dashboard")}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          {/* Item de menu para "Empresas" */}
          <ListItem key="Empresas" disablePadding>
            <ListItemButton onClick={() => navigate("/dashboard/empresas")}>
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Empresas" />
            </ListItemButton>
          </ListItem>

          <ListItem key="Usuários" disablePadding>
            <ListItemButton onClick={() => navigate("/dashboard/usuarios")}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Usuários" />
            </ListItemButton>
          </ListItem>

          {/* Adicione mais itens de menu aqui no futuro */}
        </List>
        {/* Item de menu para "Sair" no final da lista */}
        <Box sx={{ flexGrow: 1 }} />
        <List>
          <ListItem key="Logout" disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar /> {/* Espaçador para o conteúdo não ficar atrás da AppBar */}
        <Outlet />{" "}
        {/* O React Router renderizará a página da rota atual aqui */}
      </Box>
    </Box>
  );
};

export default Layout;
