import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useGlobalAlert } from "../../context/AlertContext";
import { useNavigate } from "react-router-dom";

const inputStyles = {
  justifyContent: "left",
  backgroundColor: "rgba(58,111,144,0.10)",
  borderRadius: "22px",
  height: "56px",
  "& .MuiInputBase-input": {
    color: "#3A6F90",
    fontWeight: 700,
    "&::placeholder": {
      color: "rgba(58,111,144,0.6)",
      opacity: 1,
      fontWeight: 600,
    },
  },
};

interface LoginInputs {
  username: string;
  password: string;
}

export const LoginForm = () => {
  const { register, handleSubmit } = useForm<LoginInputs>();
  const { login } = useAuth();
  const { showAlert } = useGlobalAlert();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      const success = await login(data.username, data.password);
      if (success) {
        navigate("/dashboard");
        showAlert("Login successful", "success");

      } else {
        showAlert("Invalid credentials", "error");

      }
    } catch (error) {
      showAlert("Error al conectar con el servidor", "error");
      console.error(error);
    }
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
        label="Username"
        placeholder="Username"
        {...register("username", { required: true })}
        slotProps={{
          input: { sx: inputStyles },
        }}
      />

      <TextField
        label="Password"
        placeholder="**********"
        type="password"
        variant="outlined"
        {...register("password", { required: true })}
        fullWidth
        slotProps={{
          input: { sx: inputStyles },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          borderRadius: "5px",
          width: "40%",
          margin: "0 auto",
        }}
      >
        Login
      </Button>

      <Link sx={{ margin: "0 auto" }} href="#">
        Forgot your password?
      </Link>
    </Box>
  );
};
