import { Box, Typography } from "@mui/material"
import { CourseCard } from "./CourseCard"

export const SearchResults = () => {

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

            <CourseCard></CourseCard>
            <CourseCard></CourseCard>
            <CourseCard></CourseCard>

        </Box>

    )

}