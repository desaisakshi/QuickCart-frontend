import { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { getProductSales } from "../../api/owner.reports.api";
import PageWrapper from "../../components/layout/PageWrapper.jsx";

export default function ProductReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getProductSales().then(setData);
  }, []);

  return (
    <PageWrapper title="Product Performance">
      <Table
        columns={["Product", "Qty Sold", "Revenue"]}
        data={data.map(p => ({
          product: p.productName,
          qty: p.totalQty,
          revenue: `₹${p.revenue}`
        }))}
      />
    </PageWrapper>
  );
}
