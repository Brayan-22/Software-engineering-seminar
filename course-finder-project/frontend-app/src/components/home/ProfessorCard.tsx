import { Box, Typography, Button } from "@mui/material"
import type { Professor } from "../../models/Professor"

type ProfessorCardProps = {
    professor: Professor;
    showActions?: boolean;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export const ProfessorCard = ({ professor, showActions, onEdit, onDelete }: ProfessorCardProps) => {

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
                <Typography variant="h6">Name: {professor.name}</Typography>
                <Typography>Email: {professor.email}</Typography>
                <Typography>Specialty: {professor.specialty}</Typography>
            </Box>

            {showActions && <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px"
            }}>
                <Button variant="contained" onClick={() => onEdit?.(professor.id)}>Edit</Button>
                <Button variant="contained" onClick={() => onDelete?.(professor.id)}>Delete</Button>

            </Box>}

        </Box>
    )
}
