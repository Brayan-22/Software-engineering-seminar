import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3A6F90", // azul por defecto, puedes cambiarlo
    },
    secondary: {
      main: "#9c27b0",
    },
    background: {
      default: "#FBFBFB",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
});
