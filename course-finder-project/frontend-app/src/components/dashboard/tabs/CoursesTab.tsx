import { useState } from "react"
import { Box, Typography, Button } from "@mui/material"
import type { Course } from "../../../models/Course"
import { CourseCard } from "../../home/CourseCard"
export const CoursesTab = () => {

    const [courses, setCourses] = useState<Course[]>([
        { id: 1, code: "100", name: "calculus", description: "Si", schedule: "no" },
        { id: 2, code: "200", name: "calculus", description: "Si", schedule: "no" },
        { id: 3, code: "300", name: "calculus", description: "Si", schedule: "no" },
        { id: 4, code: "400", name: "calculus", description: "Si", schedule: "no" }

    ])

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
        }}>

            <Box sx={{
                display: "flex",
                justifyContent: "left",
                gap: "40px"
            }}>
                <Typography variant="h4">Courses</Typography>
                <Button variant="contained">+</Button>

            </Box>

            <Box sx={{

            }}>
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} showActions/>
                ))}
            </Box>

        </Box>

    )

}