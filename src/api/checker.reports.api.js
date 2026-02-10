import API from "./client";

export const verifyOrderQR = async (payload) => {
  const res = await API.post("/api/checker/reports/verify-qr", payload);
  return res.data;
};

export const getCheckerHistory = async () => {
  const res = await API.get("/api/checker/reports/history");
  return res.data;
};
