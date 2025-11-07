import { useState } from "react"
import { Box, Typography, Button } from "@mui/material"
import type { Professor } from "../../../models/Professor"
import { ProfessorCard } from "../../home/ProfessorCard"
export const ProfessorTab = () => {

    const [proffesors, setProfessors] = useState<Professor[]>([
        { id: 1, documentId: "CC", name: "Mr. Eduardo 1", email: "edu@ardo.com", specialty: "Phd. Mathematics" },
        { id: 2, documentId: "CC", name: "Mr. Eduardo 2", email: "edu@ardo.com", specialty: "Phd. Mathematics" },
        { id: 3, documentId: "CC", name: "Mr. Eduardo 3", email: "edu@ardo.com", specialty: "Phd. Mathematics" },

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
                <Typography variant="h4">Professors 📚</Typography>
                <Button variant="contained">+</Button>

            </Box>

            <Box sx={{

            }}>
                {proffesors.map((professor) => (
                    <ProfessorCard key={professor.id} professor={professor} showActions />
                ))}
            </Box>

        </Box>

    )
}