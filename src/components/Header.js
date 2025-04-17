import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
  Avatar,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Translate as TranslateIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAuth } from "../utils/AuthContext";

function Header({ toggleTheme, currentTheme }) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { currentUser } = useAuth();

  const [languageAnchorEl, setLanguageAnchorEl] = React.useState(null);

  const handleLanguageMenuOpen = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleLanguageMenuClose();
  };

  // Função para obter a primeira letra do nome para o avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  // Função para traduzir o papel do usuário
  const translateRole = (role) => {
    return t(`users.${role}`);
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} />

        {/* Informações do Usuário Logado */}
        {currentUser && (
          <Tooltip title={translateRole(currentUser.role)}>
            <Chip
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  {getInitial(currentUser.name)}
                </Avatar>
              }
              label={currentUser.name}
              variant="outlined"
              sx={{ mr: 2 }}
            />
          </Tooltip>
        )}

        {/* Seletor de Idioma */}
        <Box>
          <IconButton
            size="large"
            aria-label="language selector"
            aria-controls="language-menu"
            aria-haspopup="true"
            onClick={handleLanguageMenuOpen}
            color="inherit"
          >
            <TranslateIcon />
          </IconButton>
          <Menu
            id="language-menu"
            anchorEl={languageAnchorEl}
            keepMounted
            open={Boolean(languageAnchorEl)}
            onClose={handleLanguageMenuClose}
          >
            <MenuItem onClick={() => changeLanguage("pt")}>
              {t("language.pt")}
            </MenuItem>
            <MenuItem onClick={() => changeLanguage("en")}>
              {t("language.en")}
            </MenuItem>
            <MenuItem onClick={() => changeLanguage("es")}>
              {t("language.es")}
            </MenuItem>
          </Menu>
        </Box>

        {/* Alternância de Tema */}
        <IconButton
          size="large"
          aria-label="toggle theme"
          onClick={toggleTheme}
          color="inherit"
          sx={{ ml: 1 }}
        >
          {currentTheme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
