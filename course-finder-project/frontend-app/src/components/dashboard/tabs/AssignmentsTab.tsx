import { useEffect, useState } from "react"
import { Box, Typography, Button, Modal, TextField, MenuItem } from "@mui/material"
import type { Assignment } from "../../../models/Assignment";
import type { Professor } from "../../../models/Professor";
import type { Course } from "../../../models/Course";
import { AssignmentCard } from "../AssignmentCard";
import { getAssignments, createAssignment } from "../../../api/businessApi/AssignmentService";
import { getProfessors } from "../../../api/businessApi/ProfessorService";
import { getCourses } from "../../../api/businessApi/CourseService";

export const AssignmentsTab = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const fetchAssignments = async () => {
        try {
            const data = await getAssignments();
            setAssignments(data.assignments);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const openAddModal = async () => {
        try {
            const [profList, courseList] = await Promise.all([
                getProfessors(),
                getCourses()
            ]);
            setProfessors(profList.professors || profList);
            setCourses(courseList.courses || courseList);
            setOpenModal(true);
        } catch (err) {
            console.error("Error loading data for modal:", err);
        }
    };

    const handleCreateAssignment = async () => {
        if (!selectedProfessor || !selectedCourse) {
            alert("Selecciona un profesor y un curso");
            return;
        }

        // Creamos el objeto completo de Assignment
        const assignmentData: Assignment = {
            id: 0,
            professor_id: 0,
            course_id: 0,
            status: "active",
            assigned_at: new Date(),
            professor: selectedProfessor,
            course: selectedCourse,
        };

        try {
            await createAssignment(assignmentData);
            setOpenModal(false);
            setSelectedProfessor(null);
            setSelectedCourse(null);
            fetchAssignments();
        } catch (err) {
            console.error("Error creating assignment:", err);
        }
    };

    return (
        <Box>
            {/* Tab title */}
            <Box sx={{ display: "flex", justifyContent: "left", gap: "40px" }}>
                <Typography variant="h4">Assignments 📚</Typography>
                <Button variant="contained" onClick={openAddModal}>
                    Add +
                </Button>
            </Box>

            {/* Cards */}
            <Box sx={{ mt: 3 }}>
                {assignments.length > 0 ? (
                    assignments.map((assignment) => (
                        <AssignmentCard
                            key={assignment.id}
                            assignment={assignment}
                        />
                    ))
                ) : (
                    <Typography variant="body1">No assignments found.</Typography>
                )}
            </Box>

            {/* Modal */}
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="add-assignment-modal"
            >
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
                    <Typography variant="h6" component="h2">
                        Add Assignment
                    </Typography>

                    <TextField
                        select
                        label="Professor"
                        value={selectedProfessor?.id ?? ""}
                        onChange={(e) => {
                            const prof = professors.find(p => p.id === Number(e.target.value));
                            setSelectedProfessor(prof || null);
                        }}
                        fullWidth
                    >
                        {professors.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Course"
                        value={selectedCourse?.id ?? ""}
                        onChange={(e) => {
                            const course = courses.find(c => c.id === Number(e.target.value));
                            setSelectedCourse(course || null);
                        }}
                        fullWidth
                    >
                        {courses.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                                {c.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button
                        variant="contained"
                        onClick={handleCreateAssignment}
                        disabled={!selectedProfessor || !selectedCourse}
                    >
                        Save
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};
