import axios from "axios";

const axiosClient = axios.create({
  //  || "http://localhost:3000"
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
