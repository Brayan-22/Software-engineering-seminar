import { Box, Typography } from "@mui/material"
import type { Course } from "../../models/Course"

type CourseCardProps = {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",

        }}>
            <Typography variant="h6">Name: {course.name}</Typography>
            <Typography>Code: {course.code}</Typography>
            <Typography>Schedule: {course.schedule}</Typography>

        </Box>
    )

}