import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export const Navbar = () => {
  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Academic Course Finder
        </Typography>
        <Box>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Login as Admin</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
