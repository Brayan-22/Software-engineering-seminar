import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export const AdminNavbar = () => {
  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ACF - Admin Dashboard
        </Typography>
        <Box>
          <Button color="inherit">Log Out</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
