import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development" // use the url localhost... if development mode, else send the dynamic route
      ? "http://localhost:3000/api"
      : "/api",
  withCredentials: true, //send cookies with the request
});
