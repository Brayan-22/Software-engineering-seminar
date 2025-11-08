import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:8000/api/v1",
  //baseURL: "https://coursefinderbs.glud.org/api/v1",
  baseURL: "/course-api/",

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const item = localStorage.getItem("token")
  if (item) {
    const tokenData = JSON.parse(item);
    console.log(tokenData.token)
    if (tokenData.token) {
      config.headers.Authorization = `Bearer ${tokenData.token}`;
      console.log("Bearer " + tokenData.token);
    }
  }
  return config;

}, (error) => {
  return Promise.reject(error);
});
export default api;
