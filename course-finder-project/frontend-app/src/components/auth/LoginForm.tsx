import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm, type SubmitHandler } from "react-hook-form";

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
      gap={2}
      sx={{ width: "100%", maxWidth: 400, margin: "0 auto" }}
    >
      <Typography variant="h5" textAlign="center" gutterBottom>
        Sign In
      </Typography>

      <TextField
        label="Email"
        variant="outlined"
        {...register("email")}
        required
        fullWidth
      />

      <TextField
        label="Password"
        type="password"
        variant="outlined"
        {...register("password")}
        required
        fullWidth
      />

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Log In
      </Button>
    </Box>
  );
};
