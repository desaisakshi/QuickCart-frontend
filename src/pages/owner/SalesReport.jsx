"use client";
import { useEffect, useState } from "react";
import StatCard from "../../components/charts/StatCard";
import Table from "../../components/common/Table";
import PageWrapper from "../../components/layout/PageWrapper";
import FilterBar from "../../components/common/FilterBar";
import { getSalesSummary } from "../../api/owner.reports.api";

export default function SalesReport() {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Fetch Summary (Reusable)
  // -----------------------------
  const fetchSummary = async (params = {}) => {
    try {
      setLoading(true);
      const res = await getSalesSummary(params);
      setSummary(res || {});
    } catch (err) {
      console.error("Failed to fetch sales summary", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSummary();
  }, []);

  // -----------------------------
  // Filter handler
  // -----------------------------
  const handleFilter = ({ fromDate, toDate }) => {
    fetchSummary({
      from: fromDate,
      to: toDate,
    });
  };

  return (
    <PageWrapper title="Sales Report">
      <FilterBar onFilter={handleFilter} />

      {/* ---------------- STATS ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard
          title="Total Revenue"
          value={`₹${summary.totalRevenue || 0}`}
          loading={loading}
        />
        <StatCard
          title="Total Orders"
          value={summary.totalOrders || 0}
          loading={loading}
        />
        <StatCard
          title="Average Order"
          value={`₹${Math.round(summary.avgOrderValue || 0)}`}
          loading={loading}
        />
      </div>

      {/* ---------------- TABLE ---------------- */}
      <Table
        columns={["Metric", "Value"]}
        data={[
          {
            Metric: "Total Revenue",
            Value: `₹${summary.totalRevenue || 0}`,
          },
          {
            Metric: "Total Orders",
            Value: summary.totalOrders || 0,
          },
          {
            Metric: "Average Order Value",
            Value: `₹${Math.round(summary.avgOrderValue || 0)}`,
          },
        ]}
        loading={loading}
      />
    </PageWrapper>
  );
}
