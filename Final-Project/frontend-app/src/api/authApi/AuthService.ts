import axios from "axios";
import { config } from "../../config/env";

const AUTH_API = `${config.authApiUrl}/auth`;

export const login = async (username: string, password: string) => {
  const res = await axios.post(AUTH_API + "/login", { username, password });
  return res.data;
};

