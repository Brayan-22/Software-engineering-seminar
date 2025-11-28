import { createContext, useContext, useState, type ReactNode } from "react";

type AlertSeverity = "info" | "success" | "warning" | "error";

interface AlertState {
  open: boolean;
  message: string;
  severity: AlertSeverity;
}

interface AlertContextType {
  alert: AlertState;
  showAlert: (message: string, severity?: AlertSeverity) => void;
  closeAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = (message: string, severity: AlertSeverity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert, closeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useGlobalAlert must be used within an AlertProvider");
  }
  return context;
};
