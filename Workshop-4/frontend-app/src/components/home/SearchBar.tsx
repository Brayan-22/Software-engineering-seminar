import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

const inputStyles = {
  justifyContent: "left",
  backgroundColor: "rgba(58,111,144,0.10)",
  borderRadius: "22px",
  height: "56px",
  "& .MuiInputBase-input": {
    color: "#3A6F90",
    fontWeight: 700,
    "&::placeholder": {
      color: "rgba(58,111,144,0.6)",
      opacity: 1,
      fontWeight: 600,
    },
  },
};

const buttonStyles = {
  borderRadius: "10px",
  textTransform: "none",
  fontWeight: 700,
  height: "48px",
};

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

export const SearchBar = ({ onSearch, loading }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSearchClick = () => {
    onSearch(query);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        justifyContent: "center",
        alignItems: "center",
        width: "70%",
        height: "160px",
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        boxShadow: "10px 20px 80px rgba(0, 0, 0, 0.25)",
        margin: "0 auto",
        px: 6,
        py: 7,
      }}
    >
      <TextField
        fullWidth
        placeholder="Search by professor or course..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        slotProps={{
          input: { sx: inputStyles },
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearchClick();
        }}
      />

      <Button
        variant="contained"
        sx={buttonStyles}
        onClick={handleSearchClick}
        disabled={loading}
      >
        {loading ? "Searching..." : "Search >"}
      </Button>
    </Box>
  );
};
