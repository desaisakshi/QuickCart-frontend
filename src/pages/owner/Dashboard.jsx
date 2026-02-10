import { useEffect, useState } from "react";
import { getSalesSummary } from "../../api/owner.reports.api";
import StatCard from "../../components/charts/StatCard";

export default function OwnerDashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    getSalesSummary().then(setData);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Total Revenue" value={`₹${data.totalRevenue || 0}`} />
      <StatCard title="Orders" value={data.totalOrders || 0} />
      <StatCard title="Avg Order Value" value={`₹${Math.round(data.avgOrderValue || 0)}`} />
    </div>
  );
}
