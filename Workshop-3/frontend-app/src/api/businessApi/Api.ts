import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8000/api/v1",
  // baseURL: "https://coursefinderbs.glud.org/api/v1",
  baseURL: "/course-api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const item = localStorage.getItem("token");
    if (item) {
      const tokenData = JSON.parse(item);
      if (tokenData?.token) {
        config.headers.Authorization = `Bearer ${tokenData.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "An unexpected error occurred.";

    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 400:
          message = "Bad request. Check your input data.";
          break;
        case 401:
          message = "Unauthorized. Please log in again.";
          break;
        case 403:
          message = "Forbidden. You don't have access to this resource.";
          break;
        case 404:
          message = "Resource not found.";
          break;
        case 409:
          message = "Conflict. The resource already exists or is duplicated.";
          break;
        case 500:
          message = "Operation not allowed.";
          break;
        default:
          message = `Unexpected error (${status}).`;
      }
    } else if (error.request) {
      message = "No response received from the server.";
    } else {
      message = `Request setup error: ${error.message}`;
    }

    // Pass the error message to the catch block
    return Promise.reject(new Error(message));
  }
);

export default api;
