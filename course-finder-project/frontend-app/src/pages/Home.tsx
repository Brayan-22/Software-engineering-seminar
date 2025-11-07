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
        Welcome to Academic Course Finder 🔍
      </Typography>
      <Typography variant="body1">
        Explore courses, proffesors and more academic information.
      </Typography>
      <SearchBar></SearchBar>
      <SearchResults></SearchResults>
    </Box>
  );
};
