import API from "./client";

export const getSalesSummary = async (params) => {
  const res = await API.get("/api/ownerreport/sales-summary", { params });
  return res.data;
};

export const getProductSales = async () => {
  const res = await API.get("/api/ownerreport/product-sales");
  return res.data;
};

export const getCustomerReport = async () => {
  const res = await API.get("/api/ownerreport/customers");
  return res.data;
};

export const getCartAbandonment = async () => {
  const res = await API.get("/api/owner/reports/cart-abandonment");
  return res.data;
};
