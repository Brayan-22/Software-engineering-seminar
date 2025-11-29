import { Box, Typography, Button, Divider } from "@mui/material"
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
            alignItems: "stretch",
            backgroundColor: "#EBF1F4",
            borderRadius: "16px",
            py: "10px",
            px: "30px",
            mt: "15px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}>
            {/* Left box: specialty */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    minWidth: "140px",
                }}
            >
                <Typography variant="h6">Specialty</Typography>
                <Typography> {professor.specialty}</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

            {/* Professor info */}
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
            }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{professor.name}</Typography>
                <Typography>Contact: {professor.email}</Typography>
            </Box>

            {/* Actions */}
            {showActions && (
                <>
                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "10px",
                        minWidth: "200px",
                    }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onEdit?.(professor.id)}
                            sx={{ textTransform: "none" }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => onDelete?.(professor.id)}
                            sx={{ textTransform: "none" }}
                        >
                            Delete
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    )
}
