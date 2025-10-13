// import { Button } from "@/components/ui/button";
// import { Lang, getDictionary } from "@/utils/translations/dictionary-utils";
import ScreenRenderer from "@/components/screen-render/screen-render";
import { ScreenSchema } from "@/types/screen.types";
import React from "react";

const fakeScreen: ScreenSchema = {
  title: "Orders Dashboard",
  subtitle: "Testing dynamic rendering with fake data",
  layout: "stack",
  components: [
    {
      id: "search",
      type: "search",
      props: { placeholder: "Search orders..." },
    },
    {
      id: "filters",
      type: "filters",
    },
    {
      id: "orders-table",
      type: "table",
      props: {
        columns: [
          { accessor: "id", header: "ID" },
          { accessor: "customer", header: "Customer" },
          { accessor: "total", header: "Total ($)" },
          { accessor: "status", header: "Status" },
        ],
      },
      dataSource: {
        kind: "rest",
        url: "/api/orders",
        pagination: { type: "offset", pageSize: 10 },
        serverSide: false,
      },
    },
  ],
};

async function page() {
  return <ScreenRenderer schema={fakeScreen} />;
}

export default page;
