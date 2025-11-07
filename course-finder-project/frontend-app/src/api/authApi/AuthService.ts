import axios from "axios";

const AUTH_API = "http://localhost:8000/api";

export const login = async (email: string, password: string) => {
  const res = await axios.post(`${AUTH_API}/login`, { email, password });
  return res.data; 
};

export const logout = () => {
  localStorage.removeItem("token");
};
