import API from "./client";


export const getProductList = async (payload) => {
  try {
    const res = await API.get("/api/products", payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};