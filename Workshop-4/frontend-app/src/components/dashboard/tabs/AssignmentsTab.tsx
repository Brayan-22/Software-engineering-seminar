import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  MenuItem,
  TextField,
} from "@mui/material";
import type { Assignment } from "../../../models/Assignment";
import type { Course } from "../../../models/Course";
import type { Professor } from "../../../models/Professor";
import { AssignmentCard } from "../AssignmentCard";
import {
  getAssignments,
  createAssignment,
  deleteAssignment,
} from "../../../api/businessApi/AssignmentService";
import { getCourses } from "../../../api/businessApi/CourseService";
import { getProfessors } from "../../../api/businessApi/ProfessorService";
import { useApiErrorHandler } from "../../../util/ApiErrorHandler";

export const AssignmentsTab = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] =
    useState<Assignment | null>(null);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | "">("");
  const [selectedProfessor, setSelectedProfessor] = useState<number | "">("");

  const { handleApiError} = useApiErrorHandler();
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getAssignments();
        setAssignments(data.assignments);
      } catch (err) {
        handleApiError(err, setError, "Error fetching Assignments.");
      }
    };

    const fetchData = async () => {
      try {
        const [courseData, professorData] = await Promise.all([
          getCourses(),
          getProfessors(),
        ]);
        setCourses(courseData.courses);
        setProfessors(professorData.professors);
      } catch (err) {
        handleApiError(err, setError, "Error fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Delete logic
  const handleDeleteClick = (assignment: Assignment) => {
    setAssignmentToDelete(assignment);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!assignmentToDelete) return;

    try {
      await deleteAssignment(assignmentToDelete.id);
      setAssignments((prev) =>
        prev.filter((a) => a.id !== assignmentToDelete.id)
      );
      setOpenDeleteModal(false);
      setAssignmentToDelete(null);
    } catch (err) {
      console.error("Error deleting assignment:", err);
    }
  };

  // Add logic
  const handleAddAssignment = async () => {
    if (!selectedCourse || !selectedProfessor) return;

    try {
      const newAssignment: Assignment = {
        id: 0,
        professor_id: selectedProfessor,
        course_id: selectedCourse,
        professor: professors.find((p) => p.id === selectedProfessor)!,
        course: courses.find((c) => c.id === selectedCourse)!,
        assigned_at: new Date(),
        status: "active",
      };

      console.log("📦 Sending new assignment:", newAssignment);

      const res = await createAssignment(newAssignment);

      setAssignments((prev) => [...prev, res]);
      setOpenAddModal(false);
      setSelectedCourse("");
      setSelectedProfessor("");
    } catch (err) {
      console.error("Error creating assignment:", err);
    }
  };

  if (loading)
    return <Typography sx={{ mt: 2 }}>Loading assignments...</Typography>;

  if (error)
    return (
      <Typography sx={{ mt: 2, color: "red" }} variant="body1">
        {error}
      </Typography>
    );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Assignments 📚</Typography>
        <Button variant="contained" onClick={() => setOpenAddModal(true)}>
          Add Assignment
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              showActions
              onDelete={() => handleDeleteClick(assignment)}
            />
          ))
        ) : (
          <Typography variant="body1">No assignments found.</Typography>
        )}
      </Box>

      {/* Add Assignment Modal */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography variant="h6">Add New Assignment</Typography>

          <TextField
            select
            label="Select Course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(Number(e.target.value))}
            fullWidth
          >
            {courses.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Select Professor"
            value={selectedProfessor}
            onChange={(e) => setSelectedProfessor(Number(e.target.value))}
            fullWidth
          >
            {professors.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={() => setOpenAddModal(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAddAssignment}>
              Add
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="delete-assignment-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography variant="h6">Delete Assignment</Typography>
          <Typography>
            Are you sure you want to delete the assignment for{" "}
            <strong>{assignmentToDelete?.professor.name}</strong> in{" "}
            <strong>{assignmentToDelete?.course.name}</strong>?
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={() => setOpenDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
