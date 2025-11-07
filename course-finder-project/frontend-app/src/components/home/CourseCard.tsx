import { Box, Typography } from "@mui/material"
import type { Course } from "../../models/Course"

type CourseCardProps = {
  course: Course;
}

export const CourseCard = ( {course }: CourseCardProps) => {

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
            backgroundColor: "#EBF1F4",
            borderRadius: "16px",
            py: "10px",
            px: "20px",
            mt: "15px"
        }}>
            <Typography variant="h6">Name: {course.name}</Typography>
            <Typography>Code: {course.code}</Typography>
            <Typography>Schedule: {course.schedule}</Typography>

        </Box>
    )

}