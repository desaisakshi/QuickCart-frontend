import { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { getLowStock } from "../../api/manager.reports.api";
import PageWrapper from "../../components/layout/PageWrapper";

export default function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getLowStock().then(setItems);
  }, []);

  return (
    <PageWrapper title="Low Stock Alert">
      <Table
        columns={["Product", "Stock Left"]}
        data={items.map(p => ({
          name: p.name,
          stock: p.stock
        }))}
      />
    </PageWrapper>
  );
}
