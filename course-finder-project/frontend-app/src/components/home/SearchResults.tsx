import { Box, Typography } from "@mui/material"
import { CourseCard } from "./CourseCard"
import { useState } from "react"
import type { Course } from "../../models/Course"
import type { Professor } from "../../models/Professor"
import { ProfessorCard } from "./ProfessorCard"
export const SearchResults = () => {

    const [courses, setCourses] = useState<Course[]>([
        { id: 1, code: "100", name: "calculus", description: "Si", schedule: "no" },
        { id: 2, code: "200", name: "calculus", description: "Si", schedule: "no" },
        { id: 3, code: "300", name: "calculus", description: "Si", schedule: "no" },
        { id: 4, code: "400", name: "calculus", description: "Si", schedule: "no" }

    ])

    const [proffesors, setProfessors] = useState<Professor[]>([
        { id: 1, documentId: "CC", name: "Mr. Eduardo 1", email: "edu@ardo.com", specialty: "Phd. Mathematics" },
        { id: 2, documentId: "CC", name: "Mr. Eduardo 2", email: "edu@ardo.com", specialty: "Phd. Mathematics" },
        { id: 3, documentId: "CC", name: "Mr. Eduardo 3", email: "edu@ardo.com", specialty: "Phd. Mathematics" },

    ])

    return (

        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
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

            {proffesors.map((proffesor) => (
                <ProfessorCard key={proffesor.id} professor={proffesor}/>
            ))}

        </Box>

    )

}