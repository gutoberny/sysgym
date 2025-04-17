import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  useTheme,
  FormControl,
  Select,
  MenuItem,
  Button,
  Typography,
  Chip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  FitnessCenter as FitnessCenterIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  Event as EventIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  Language as LanguageIcon,
  ManageAccounts as ManageAccountsIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../utils/AuthContext";

const drawerWidth = 240;

// Verifica se o site está em modo de demonstração
const isDemoMode = () => {
  return (
    window.location.hostname.includes("vercel.app") ||
    process.env.NODE_ENV === "development"
  );
};

function Sidebar({ currentPage, setCurrentPage, language, setLanguage }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { hasRole } = useAuth();

  const menuItems = [
    { id: "dashboard", icon: <DashboardIcon />, text: t("sidebar.dashboard") },
    {
      id: "workouts",
      icon: <FitnessCenterIcon />,
      text: t("sidebar.workouts"),
    },
    { id: "students", icon: <PeopleIcon />, text: t("sidebar.students") },
    { id: "finances", icon: <AttachMoneyIcon />, text: t("sidebar.finances") },
    // { id: "schedule", icon: <EventIcon />, text: t("sidebar.schedule") },
    { id: "reports", icon: <AssessmentIcon />, text: t("sidebar.reports") },
  ];

  // Adicionar item de gerenciamento de usuários apenas para administradores
  if (hasRole("admin")) {
    menuItems.push({
      id: "user-management",
      icon: <ManageAccountsIcon />,
      text: t("users.management"),
    });
  }

  const handleMenuItemClick = (pageId) => {
    setCurrentPage(pageId);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: theme.palette.background.paper,
        },
      }}
      open
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <FitnessCenterIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
        <Box sx={{ typography: "h6", color: theme.palette.primary.main }}>
          {t("header.title")}
        </Box>
      </Box>

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={currentPage === item.id}
              onClick={() => handleMenuItemClick(item.id)}
            >
              <ListItemIcon
                sx={{
                  color:
                    currentPage === item.id
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: currentPage === item.id ? "bold" : "normal",
                  color:
                    currentPage === item.id
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={currentPage === "settings"}
            onClick={() => handleMenuItemClick("settings")}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={t("sidebar.settings")} />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>
          <FormControl fullWidth variant="standard">
            <Select
              value={language}
              onChange={handleLanguageChange}
              displayEmpty
              inputProps={{ "aria-label": "Language" }}
            >
              <MenuItem value="pt">Português</MenuItem>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Español</MenuItem>
            </Select>
          </FormControl>
        </ListItem>
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Chip
          icon={<InfoIcon />}
          label="Modo de Demonstração"
          color="primary"
          variant="outlined"
          sx={{ width: "100%", mb: 1 }}
        />
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          sx={{ display: "block" }}
        >
          Versão de portfólio com acesso livre para demonstração das
          funcionalidades
        </Typography>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
