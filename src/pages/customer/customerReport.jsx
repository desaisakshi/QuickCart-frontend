"use client";
import { useEffect, useState } from "react";
import PageWrapper from "../../components/layout/PageWrapper";
import FilterBar from "../../components/common/FilterBar";
import Table from "../../components/common/Table";
import { getCustomerReport } from "../../api/owner.reports.api";

export default function CustomerReport() {
  const [list, setList] = useState([]); // list of customers
  const [loading, setLoading] = useState(false);

  // fetch customer list
  const fetchReport = async (params = {}) => {
    try {
      setLoading(true);
      const res = await getCustomerReport(params);
      setList(res || []);
    } catch (err) {
      console.error("Failed to fetch customer report", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleFilter = ({ fromDate, toDate }) => {
    fetchReport({
      from: fromDate,
      to: toDate,
    });
  };

  return (
    <PageWrapper title="Customer Report">

      {/* Date filter */}
      <FilterBar onFilter={handleFilter} />

      {/* Report list */}
      <Table
        loading={loading}
        columns={["Customer ID", "Total Orders", "Total Spent (₹)"]}
        data={list.map((item) => ({
          "Customer name": item.name,
          "Total Orders": item.orders,
          "Total Spent (₹)": item.totalSpent,
        }))}
      />

    </PageWrapper>
  );
}
