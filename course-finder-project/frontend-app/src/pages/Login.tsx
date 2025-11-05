import { Box, Paper } from "@mui/material";
import { LoginForm } from "../components/auth/LoginForm";

export const Login = () => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
        >
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <LoginForm />
            </Paper>
        </Box>
    );
};

