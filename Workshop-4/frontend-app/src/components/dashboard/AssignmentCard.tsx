import { Box, Typography, Button, Divider } from "@mui/material"
import type { Assignment } from "../../models/Assignment"

type AssignmentCardProps = {
    assignment: Assignment;
    showActions?: boolean;
    onDelete?: (assignment_id: number) => void;
}

export const AssignmentCard = ({ assignment, showActions, onDelete }: AssignmentCardProps) => {

    return (
        <Box
            data-testid={`assignment-card-${assignment.id}`}
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                flexGrow: "revert-layer",
                backgroundColor: "#EBF1F4",
                borderRadius: "16px",
                py: "10px",
                px: "30px",
                mt: "15px"
            }}>
            {/* Left box: professor info*/}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    minWidth: "120px",
                    flexGrow: 1,

                }}
            >
                <Typography variant="h6">{assignment.professor.name}</Typography>
                <Typography>{assignment.professor.email}</Typography>
                <Typography>{assignment.professor.specialty}</Typography>

            </Box>
            <Divider orientation="vertical" flexItem />

            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
            }}
            >
                <Typography variant="h6"> {assignment.course.name}</Typography>
                <Typography>{assignment.course.schedule}</Typography>
            </Box>

            {showActions && (
                <>
                    <Divider orientation="vertical" flexItem />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            gap: "10px",
                            minWidth: "110px",
                        }}
                    >
                        <Button
                            data-testid={`delete-assignment-${assignment.id}`}
                            variant="contained"
                            color="error"
                            onClick={() => onDelete?.(assignment.id)}
                        >
                            Delete
                        </Button>

                    </Box>
                </>
            )}

        </Box>
    )


}