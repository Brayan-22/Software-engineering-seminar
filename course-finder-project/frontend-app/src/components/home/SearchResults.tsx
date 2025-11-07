import { Box, Typography } from "@mui/material"
import { CourseCard } from "./CourseCard"
import { useState } from "react"
import type { Course } from "../../models/Course"

export const SearchResults = () => {

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
            justifyContent: "center",
            mt: "30px",
            width: "95%",
            heigh: "100hv",
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            boxShadow: "10px 20px 80px rgba(0, 0, 0, 0.25)",
            px: 4,
            py: 2,
        }}>
            <Typography variant="h5">Search results</Typography>

            {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}

        </Box>

    )

}