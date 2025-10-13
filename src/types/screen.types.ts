/* eslint-disable @typescript-eslint/no-explicit-any */
export type ScreenSchema = {
  id?: string;
  title?: string;
  subtitle?: string;
  layout?: "stack" | "grid" | "columns";
  components: ComponentSchema[];
};

export type ComponentSchema = {
  id?: string;
  type: string;
  props?: Record<string, any>;
  dataSource?: DataSourceSchema;
  children?: ComponentSchema[];
};

export type DataSourceSchema = {
  kind: "static" | "rest";
  url?: string;
  method?: "GET" | "POST";
  pagination?: { type: "offset" | "cursor"; pageSize?: number };
  serverSide?: boolean;
};
