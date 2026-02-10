import API from "./client";

export const verifyOrderAPI = async (orderId) => {
  try {
    const res = await API.post("/api/checker/verify-order", { orderId });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
