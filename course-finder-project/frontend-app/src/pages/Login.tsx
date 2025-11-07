import { Box, Paper } from "@mui/material";
import { LoginForm } from "../components/auth/LoginForm";

export const Login = () => {
    return (
        <Box
            display="flex"
            justifyContent="center"   // centra horizontalmente
            alignItems="center"       // centra verticalmente
            flexGrow={1}              // ocupa todo el espacio disponible dentro del Container
            minHeight="70vh"          // opcional, por si no alcanza a expandirse
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: "20px",
                    width: "100%",
                    maxWidth: "420px",         // controla el ancho del formulario
                    mx: 2,
                    boxShadow: "10px 20px 80px rgba(0, 0, 0, 0.25)",
                    // separación lateral
                }}
            >
                <LoginForm />
            </Paper>
        </Box>
    );
};
