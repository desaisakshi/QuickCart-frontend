import API from "./client";

// ADD product to cart
export const addToCartAPI = async (payload) => {
  try {
    const res = await API.post("/api/cart/add", payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// GET user cart
export const getCartAPI = async () => {
  try {
    const res = await API.get("/api/cart");
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// UPDATE quantity
export const updateQtyAPI = async (productId, qty) => {
  try {
    const res = await API.put("/api/cart/update", { productId, qty });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// REMOVE item
export const removeCartItemAPI = async (productId) => {
  try {
    const res = await API.delete("/api/cart/remove", {
      data: { productId },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
