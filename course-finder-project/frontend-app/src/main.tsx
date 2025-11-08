import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AppRouter } from "./routes/AppRouter";
import { theme } from "./theme/theme";
import { AlertProvider } from "./context/AlertContext";
import GlobalAlert from "./components/GlobalAlert";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertProvider>
        <AppRouter />
        <GlobalAlert />
      </AlertProvider>
    </ThemeProvider>
  </React.StrictMode>
);
