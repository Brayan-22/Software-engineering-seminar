import { useEffect, useState } from "react";
import { Box, Typography, Button, Modal } from "@mui/material";
import type { Assignment } from "../../../models/Assignment";
import { AssignmentCard } from "../AssignmentCard";
import { getAssignments, createAssignment, deleteAssignment } from "../../../api/businessApi/AssignmentService";

export const AssignmentsTab = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

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

    const handleDeleteClick = (assignment: Assignment) => {
        setAssignmentToDelete(assignment);
        setOpenDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!assignmentToDelete) return;

        try {
            await deleteAssignment(assignmentToDelete.id);
            setAssignments(assignments.filter(a => a.id !== assignmentToDelete.id));
            setOpenDeleteModal(false);
            setAssignmentToDelete(null);
        } catch (err) {
            console.error("Error deleting assignment:", err);
        }
    };

    return (
        <Box>
            <Typography variant="h4">Assignments 📚</Typography>

            <Box sx={{ mt: 3 }}>
                {assignments.length > 0 ? (
                    assignments.map((assignment) => (
                        <AssignmentCard
                            key={assignment.id}
                            assignment={assignment}
                            onDelete={handleDeleteClick} // pasa la función al card
                        />
                    ))
                ) : (
                    <Typography variant="body1">No assignments found.</Typography>
                )}
            </Box>

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
                    <Typography variant="h6" component="h2">
                        Delete Assignment
                    </Typography>
                    <Typography>
                        Are you sure you want to delete the assignment for{" "}
                        <strong>{assignmentToDelete?.professor.id}</strong> in{" "}
                        <strong>{assignmentToDelete?.course.name}</strong>?
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button variant="outlined" onClick={() => setOpenDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};
