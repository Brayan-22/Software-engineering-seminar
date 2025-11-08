import { useEffect, useState } from "react"
import { Box, Typography, Button } from "@mui/material"
import type { Assignment } from "../../../models/Assignment";
import { AssignmentCard } from "../AssignmentCard";
import { getAssignments } from "../../../api/businessApi/AssignmentService";

export const AssignmentsTab = () => {

    const [assignments, setAssignments] = useState<Assignment[]>([]);

    useEffect(() => {
        const fectchAssignmnets = async () => {
            try {
                const data = await getAssignments();
                setAssignments(data.assignments);
            } catch (err) {
                console.error(err);
                //setError("Error loading professors");
                //showAlert("Error loading professors", "error");
            } finally {
                //setLoading(false);
            }
        }

        fectchAssignmnets();
    }, []);

    return (
        <Box>
            {/* Tab title*/}
            <Box sx={{ display: "flex", justifyContent: "left", gap: "40px" }}>
                <Typography variant="h4">Assignments 📚</Typography>
                <Button variant="contained">
                    Add +
                </Button>
            </Box>

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
        </Box>

    )
}