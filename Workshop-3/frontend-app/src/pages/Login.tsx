import { Box, Paper } from "@mui/material";
import { LoginForm } from "../components/auth/LoginForm";

export const Login = () => {
    return (
        <Box
            display="flex"
            justifyContent="center"  
            alignItems="center"      
            flexGrow={1}              
            minHeight="70vh"          
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: "20px",
                    width: "100%",
                    maxWidth: "420px",        
                    mx: 2,
                    boxShadow: "10px 20px 80px rgba(0, 0, 0, 0.25)",
                }}
            >
                <LoginForm />
            </Paper>
        </Box>
    );
};
