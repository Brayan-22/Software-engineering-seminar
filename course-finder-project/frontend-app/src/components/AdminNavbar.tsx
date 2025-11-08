import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const AdminNavbar = () => {

  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
   // navigate("/home")
  }

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ACF - Admin Dashboard
        </Typography>
        <Box>
          <Button color="inherit" onClick={handleLogout}>Log Out</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
