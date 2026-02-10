import API from "./client";

export const getTodayOrders = async (params = {}) => {
  const res = await API.get("/api/managerreport/daily-orders", {
    params,
  });
  return res.data;
};

export const getLowStock = async () => {
  const res = await API.get("/api/managerreport/low-stock");
  return res.data;
};

export const getPendingQR = async () => {
  const res = await API.get("/api/managerreport/reports/pending-qr");
  return res.data;
};
