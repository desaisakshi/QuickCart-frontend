import API from "./client";

export const generateQrAPI = async (payload) => {
  try {
    const res = await API.post("/api/orders/generate-qr", payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const completeOrderAPI = async (payload) => {
  try {
    const res = await API.post("/api/orders/complete", payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
