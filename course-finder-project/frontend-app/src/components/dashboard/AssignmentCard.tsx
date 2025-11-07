import { Box, Typography } from "@mui/material"
import type { ProfessorCourse } from "../../models/ProfessorCourse"

type AssignmentCardProps = {
    proffesorCourse: ProfessorCourse;
    onDelete?: (id: number) => void;
}

export const AssignmentCard = ({ proffesorCourse, onDelete }: AssignmentCardProps) => {

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
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            }}>
                <Typography variant="h6">Name: {proffesorCourse.name}</Typography>
                <Typography>Code: {course.code}</Typography>
                <Typography>Schedule: {course.schedule}</Typography>
            </Box>

            {showActions && <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
            }}>
                <Button variant="contained">Edit</Button>
                <Button variant="contained">Delete</Button>

            </Box>}

        </Box>
    )


}