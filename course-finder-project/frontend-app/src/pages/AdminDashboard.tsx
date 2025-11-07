import { Box, Typography } from "@mui/material"
import { CenteredTabs } from "../components/dashboard/CenteredTabs"

export const AdminDashboard = () => {

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            margin: "30px ",
            backgroundColor: "#FFFFFF",
            boxShadow: "10px 20px 80px rgba(0, 0, 0, 0.25)",
            borderRadius: "16px"
        }}>
        <CenteredTabs></CenteredTabs>

        </Box>
    )
}