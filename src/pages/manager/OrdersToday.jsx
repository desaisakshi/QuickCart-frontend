"use client";
import { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import StatusBadge from "../../components/common/StatusBadge";
import FilterBar from "../../components/common/FilterBar";
import { getTodayOrders } from "../../api/manager.reports.api";
import PageWrapper from "../../components/layout/PageWrapper.jsx";

export default function OrdersToday() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Fetch Orders (Reusable)
  // -----------------------------
  const fetchOrders = async (params = {}) => {
    try {
      setLoading(true);
      const res = await getTodayOrders(params);
      setOrders(res?.data || res || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load → today
  useEffect(() => {
    fetchOrders();
  }, []);

  // -----------------------------
  // Filter handler
  // -----------------------------
  const handleFilter = ({ fromDate, toDate }) => {
    fetchOrders({
      startDate: fromDate,
      endDate: toDate,
    });
  };

  return (
    <PageWrapper title="Orders">
      <FilterBar onFilter={handleFilter} />

      <Table
        loading={loading}
        columns={["Order ID", "Status", "Time"]}
        data={orders.map((o) => ({
          orderId: o.orderId,
          status: <StatusBadge status={o.status} />,
          time: new Date(o.createdAt).toLocaleString(),
        }))}
      />
    </PageWrapper>
  );
}
