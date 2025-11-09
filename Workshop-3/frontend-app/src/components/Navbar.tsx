import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {

  const navigate = useNavigate();
  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Academic Course Finder
        </Typography>
        <Box>
          <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
          <Button color="inherit" onClick={() => navigate("/login")}>Login as Admin</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
