import { Box, Typography, CircularProgress } from "@mui/material";
import { AssignmentCard } from "../dashboard/AssignmentCard";
import type { Assignment } from "../../models/Assignment";
import { useEffect } from "react";
interface SearchResultsProps {
  assignments: Assignment[];
  loading: boolean;
  searched: boolean;
}

export const SearchResults = ({
  assignments,
  loading,
  searched,
}: SearchResultsProps) => {
  const hasResults = assignments && assignments.length > 0;

  useEffect(() => {
    console.log(assignments);
    assignments.map((a) => {
      console.log(a);
    })
  }, [assignments]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "95%",
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        boxShadow: "10px 20px 80px rgba(0, 0, 0, 0.25)",
        px: 4,
        py: 2,
      }}
    >
      <Typography variant="h5">Search results</Typography>

      {loading && <CircularProgress sx={{ mt: 2, alignSelf: "center" }} />}

      {!loading && searched && (
        <>
          {!hasResults ? (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              No results found.
            </Typography>
          ) : (
            <>
              {assignments.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Assignments
                  </Typography>
                  {assignments.map((a) => (
                    <>
                      <AssignmentCard key={a.id} assignment={a}></AssignmentCard>
                    </>
                  ))}
                </>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};
