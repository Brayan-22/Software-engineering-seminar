import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin } from "../api/authApi/AuthService";
import { useGlobalAlert } from "./AlertContext";

interface AuthContextType {
  isAuth: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { showAlert } = useGlobalAlert();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [isAuth, setIsAuth] = useState<boolean>(() => !!localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", JSON.stringify(token));
      setIsAuth(true);
    } else {
      localStorage.removeItem("token");
      setIsAuth(false);
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      const token = await apiLogin(username, password);
      if (token) {
        setToken(token);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      showAlert("Failed to login", "error");
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    showAlert("Logged out successfully", "info");
  };

  return (
    <AuthContext.Provider value={{ isAuth, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
