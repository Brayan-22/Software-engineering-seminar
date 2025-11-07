import { Box, Button, Typography } from "@mui/material"
import type { Course } from "../../models/Course"

type CourseCardProps = {
    course: Course;
    showActions?: boolean;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export const CourseCard = ({ course, showActions = false, onEdit, onDelete }: CourseCardProps) => {

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
                <Typography variant="h6">Name: {course.name}</Typography>
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