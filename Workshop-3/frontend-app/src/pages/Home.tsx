import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { SearchBar } from "../components/home/SearchBar";
import { SearchResults } from "../components/home/SearchResults";
import { advancedSearch } from "../api/businessApi/SearchService";
import type { Assignment } from "../models/Assignment";

export const Home = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setAssignments([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    try {
      const data = await advancedSearch(query, query);
      setAssignments(data.assignments || []);
      setSearched(true);
    } catch (error) {
      console.error("Error searching:", error);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h4">
          Welcome to Academic Course Finder 🔍
        </Typography>
        <Typography variant="body1">
          Explore courses, professors and more academic information.
        </Typography>
      </Box>

      <SearchBar onSearch={handleSearch} loading={loading} />
      <SearchResults
        assignments={assignments}
        searched={searched}
        loading={loading}
      />
    </Box>
  );
};
