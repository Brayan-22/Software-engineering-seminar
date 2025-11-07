import { Box, Typography } from "@mui/material"
import type { ProfessorCourse } from "../../models/ProfessorCourse"

type AssignmentCardProps = {
    proffesorCourse: ProfessorCourse;
    showActions?: boolean;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export const AssignmentCard = () => {

    return (

        <Box>

        </Box>

    )

}