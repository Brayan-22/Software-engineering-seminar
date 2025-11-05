import { Box, Typography } from "@mui/material"


export const CourseCard = () => {

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",

        }}>
            <Typography variant="h6">Name: ---</Typography>
            <Typography>Group: ---</Typography>
            <Typography>Schedule: ---</Typography>

        </Box>
    )

}