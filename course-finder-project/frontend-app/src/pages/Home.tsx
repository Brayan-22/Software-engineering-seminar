import { Box, Typography } from "@mui/material";
import { SearchBar } from "../components/home/SearchBar";
import { SearchResults } from "../components/home/SearchResults";

export const Home = () => {
  return (
    <Box sx={{
        display:"flex",
        flexDirection:"column",
    
    }}
    >
      <Typography variant="h4" gutterBottom>
        Bienvenido a Academic Course Finder 🔍
      </Typography>
      <Typography variant="body1">
        Explora cursos, profesores y más información académica.
      </Typography>
      <SearchBar></SearchBar>
    </Box>
  );
};
