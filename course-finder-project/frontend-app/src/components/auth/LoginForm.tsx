import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useForm, type SubmitHandler } from "react-hook-form";

const inputStyles = {
  justifyContent: "left",
  backgroundColor: "rgba(58,111,144,0.10)",
  borderRadius: "22px",
  height: "56px",
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

interface LoginInputs {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const { register, handleSubmit } = useForm<LoginInputs>();

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    console.log("Login data:", data);
    // TODO: Handle authentication logic (API call or context update)
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      gap={2}
      sx={{ width: "100%", maxWidth: 400, margin: "0 auto" }}
    >
      <Typography variant="h5" textAlign="center" gutterBottom>
        Login as Admin
      </Typography>

      <TextField
        variant="outlined"
        label="Email"
        placeholder="Email"
        {...register("email")}
        required
        slotProps={{
          input: { sx: inputStyles }
        }}
      />

      <TextField
        label="Password"
        placeholder="**********"
        type="password"
        variant="outlined"
        {...register("password")}
        required
        fullWidth
        slotProps={{
          input: { sx: inputStyles }
        }}
      />

      <Button type="submit" variant="contained" color="primary" sx={{
        borderRadius: "5px",
        width: "40%",
        margin: "0 auto"
      }}>
        Login
      </Button>
      
      <Link sx={{
        margin: "0 auto"
      }} href="#">Forgot your password?</Link>
    </Box>
  );
};
