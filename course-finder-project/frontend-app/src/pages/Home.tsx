import { Box, Typography } from "@mui/material";
import { SearchBar } from "../components/home/SearchBar";
import { SearchResults } from "../components/home/SearchResults";

export const Home = () => {
  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }}
    >
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
        gap: "5px"
      }}>
        <Typography variant="h4">
          Welcome to Academic Course Finder 🔍
        </Typography>
        <Typography variant="body1">
          Explore courses, proffesors and more academic information.
        </Typography>
      </Box>
      <SearchBar></SearchBar>
      <SearchResults></SearchResults>
    </Box>
  );
};
