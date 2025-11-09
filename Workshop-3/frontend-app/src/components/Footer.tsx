import { Box, Typography } from "@mui/material";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        textAlign: "center",
        bgcolor: "primary.main",
        color: "white",
        mt: "auto",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Academic Course Finder. All rights reserved ®.
      </Typography>
    </Box>
  );
};
