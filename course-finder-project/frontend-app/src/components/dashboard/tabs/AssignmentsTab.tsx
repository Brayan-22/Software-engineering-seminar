import { Box, Typography, Button } from "@mui/material"

export const AssignmentsTab = () => {


    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "left", gap: "40px" }}>
                <Typography variant="h4">Professors 📚</Typography>
                <Button variant="contained">
                    Add +
                </Button>
            </Box>
        </Box>

    )
}