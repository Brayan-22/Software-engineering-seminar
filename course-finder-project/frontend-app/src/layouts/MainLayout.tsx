import { Box, Container } from "@mui/material";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#FBFBFB" }}>
      <Navbar />
      <Container sx={{ flex: 1, py: 7 }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};
