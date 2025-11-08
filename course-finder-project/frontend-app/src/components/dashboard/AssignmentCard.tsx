import { Box, Typography, Button, Divider } from "@mui/material"
import type { Assignment } from "../../models/Assignment"

type AssignmentCardProps = {
    assignment: Assignment;
    onDelete?: (id: number) => void;
}

export const AssignmentCard = ({ assignment, onDelete }: AssignmentCardProps) => {

    return (
        <Box sx={{
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
                }}
            >
                <Typography variant="h6">Code</Typography>
                <Typography>{assignment.professor.name}</Typography>
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
                <Typography variant="h6">ID: {assignment.id}</Typography>
                <Typography>Course: {assignment.course.name}</Typography>
                <Typography>Professor: {assignment.professor.name}</Typography>
            </Box>

            <Divider orientation="vertical" flexItem />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: "10px",
                    minWidth: "200px",
                }}
            >
                <Button
                    variant="contained"
                    color="error"
                >
                    Delete
                </Button>

            </Box>

        </Box>
    )


}