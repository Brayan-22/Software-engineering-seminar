import { Box, Typography, CircularProgress } from "@mui/material";
import { CourseCard } from "./CourseCard";
import { ProfessorCard } from "./ProfessorCard";
import type { Course } from "../../models/Course";
import type { Professor } from "../../models/Professor";

interface Assignment {
  professor: Professor;
  course: Course;
}

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

  // separa profesores únicos y cursos únicos
  const uniqueProfessors = Array.from(
    new Map(assignments.map((a) => [a.professor.id, a.professor])).values()
  );

  const uniqueCourses = Array.from(
    new Map(assignments.map((a) => [a.course.id, a.course])).values()
  );

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
              {uniqueCourses.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Courses
                  </Typography>
                  {uniqueCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </>
              )}

              {uniqueProfessors.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mt: 3 }}>
                    Professors
                  </Typography>
                  {uniqueProfessors.map((prof) => (
                    <ProfessorCard key={prof.id} professor={prof} />
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
