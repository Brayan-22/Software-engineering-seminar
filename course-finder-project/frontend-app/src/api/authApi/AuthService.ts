import axios from "axios";

const AUTH_API = "/auth-api/auth";

export const login = async (username: string, password: string) => {
 
  const res = await axios.post(AUTH_API+"/login", {username, password});
  return res.data; 
};

