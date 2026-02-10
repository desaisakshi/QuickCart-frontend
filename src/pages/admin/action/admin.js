import API from "./client";

// Generate QR
export const generateQrCode = async (payload) => {
  try {
    const res = await API.post("/api/products/generate-qr", payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  } 
};

// Save Product
export const saveProduct = async (payload) => {
  try {
    const res = await API.post("/api/products", payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Fetch Single Product
export const getProductById = async (id) => {
  try {
    const res = await API.get(`/products/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getProduct = async (id) => {
  try {
    const res = await API.get(`/products/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};