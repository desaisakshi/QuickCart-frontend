import API from "./client";

export const createPaymentOrderAPI = async (payload) => {
  try {
    const res = await API.post("/api/payment/create-order", payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
