import axios from "axios";

const API = "http://localhost:5000";

const instance = axios.create({
  baseURL: API,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;