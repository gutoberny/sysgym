import { createTheme } from "@mui/material/styles";

// Tema claro
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#795548", // Cor de madeira (inspirado na imagem)
      light: "#a98274",
      dark: "#4b2c20",
    },
    secondary: {
      main: "#607d8b", // Azul cinzento complementar
      light: "#8eacbb",
      dark: "#34515e",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      fontSize: "2rem",
    },
    h2: {
      fontWeight: 500,
      fontSize: "1.5rem",
    },
    h3: {
      fontWeight: 500,
      fontSize: "1.2rem",
    },
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#795548",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
          "&.Mui-selected": {
            color: "#795548",
          },
        },
      },
    },
  },
});

// Tema escuro
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#a98274", // Versão mais clara da cor de madeira
      light: "#dbb0a0",
      dark: "#78584a",
    },
    secondary: {
      main: "#8eacbb", // Versão mais clara do azul cinzento
      light: "#c0dbe9",
      dark: "#5d7e8f",
    },
    background: {
      default: "#303030",
      paper: "#424242",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      fontSize: "2rem",
    },
    h2: {
      fontWeight: 500,
      fontSize: "1.5rem",
    },
    h3: {
      fontWeight: 500,
      fontSize: "1.2rem",
    },
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#a98274",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
          "&.Mui-selected": {
            color: "#a98274",
          },
        },
      },
    },
  },
});
