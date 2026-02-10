import { useEffect, useState } from "react";
import Table from "../../components/common/Table";
import { getCheckerHistory } from "../../api/checker.reports.api";
import PageWrapper from "src/components/layout/PageWrapper";

export default function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getCheckerHistory().then(setData);
  }, []);

  return (
    <PageWrapper title="Scan History">
      <Table
        columns={["Order ID", "Time"]}
        data={data.map(o => ({
          orderId: o.orderId,
          time: new Date(o.createdAt).toLocaleString()
        }))}
      />
    </PageWrapper>
  );
}
