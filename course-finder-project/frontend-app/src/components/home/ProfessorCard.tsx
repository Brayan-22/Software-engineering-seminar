import { Box, Typography } from "@mui/material"
import type { Professor } from "../../models/Professor"

type ProfessorCardProps = {
    professor: Professor
}

export const ProfessorCard = ({ professor} : ProfessorCardProps) => {


    return(
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
            backgroundColor: "#000000"
        }}>
            <Typography variant="h6">Name: {professor.name}</Typography>
            <Typography>Email: {professor.email}</Typography>
            <Typography>Specialty: {professor.specialty}</Typography>

        </Box>
    )
}
