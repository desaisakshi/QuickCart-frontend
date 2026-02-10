import API from "./client";

// Generate QR
export const registerUser = async (payload) => {
  try {
    const res = await API.post("/api/auth/register", payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const loginUser = async (payload) => {
  try {
    const res = await API.post("/api/auth/login", payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};