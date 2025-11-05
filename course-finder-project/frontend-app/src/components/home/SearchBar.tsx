import { Box, Button, TextField } from "@mui/material"

const inputStyles = {
    justifyContent: "left",
    backgroundColor: "rgba(58,111,144,0.10)",
    borderRadius: "22px",
    height: "56px",
    px: "10px",
    "& .MuiInputBase-input": {
        color: "#3A6F90",
        fontWeight: 700,
        "&::placeholder": {
            color: "rgba(58,111,144,0.6)", // placeholder más suave
            opacity: 1,
            fontWeight: 600,
        },
    },


};

const buttonStyles = {
    mt: 2, // separación del input
    borderRadius: "10px",
    textTransform: "none",
    px: 4,
    fontWeight: 700,
}


export const SearchBar = () => {

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center", // centra vertical
                alignItems: "center",     // centra horizontal
                width: "80%",
                height: "160px",
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                boxShadow: "10px 20px 80px rgba(0, 0, 0, 0.25)",
                margin: "0 auto", // centra horizontalmente si el padre no es flex
                px: 6,
                py: 7,
            }}
        >
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by professor or course..."
                slotProps={{
                    input: { sx: inputStyles }
                }}
            />


            <Button
                variant="contained"
                sx={buttonStyles}
            >{`Search >`}</Button>
        </Box>

    )

}