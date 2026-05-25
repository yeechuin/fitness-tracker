import axios from "axios";

const API = "http://localhost:5000";

export const loginUser = async (email, password) => {
  const res = await axios.post(`${API}/auth/login`, {
    email,
    password,
  });

  return res.data;
};