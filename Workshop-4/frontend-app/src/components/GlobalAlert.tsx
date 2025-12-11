import { Snackbar, Alert } from "@mui/material";
import { useGlobalAlert } from "../context/AlertContext";

export default function GlobalAlert() {
  const { alert, closeAlert } = useGlobalAlert();

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={3000}
      onClose={closeAlert}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Alert
        severity={alert.severity}
        onClose={closeAlert}
        data-testid={
          alert.severity === "success"
            ? "success-message"
            : alert.severity === "error"
              ? "error-message"
              : undefined
        } sx={{
          backgroundColor:
            alert.severity === "warning"
              ? "#FFBE02"
              : alert.severity === "error"
                ? "#FF6300"
                : alert.severity === "success"
                  ? "#4caf50"
                  : "#FAFAFA",
          color: "#212121",
          fontWeight: "bold",
          borderRadius: 2,
        }}
      >
        {alert.message}
      </Alert>
    </Snackbar>
  );
}
