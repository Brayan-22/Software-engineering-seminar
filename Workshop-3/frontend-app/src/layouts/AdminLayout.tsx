import { Box, Container } from "@mui/material";
import { AdminNavbar } from "../components/AdminNavbar";
import { Footer } from "../components/Footer";
import { Outlet } from "react-router-dom";

export const AdminLayout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AdminNavbar/>
      <Container sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};
