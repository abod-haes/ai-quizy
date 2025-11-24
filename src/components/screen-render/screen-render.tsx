/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";
import React from "react";
import type { ScreenSchema, ComponentSchema } from "@/types/screen.types";

const registry: Record<string, any> = {
  title: dynamic(() => import("./title-render")),
  search: dynamic(() => import("./search-render")),
  filters: dynamic(() => import("./filter-render")),
  table: dynamic(() => import("./table-render")),
};

export default function ScreenRenderer({ schema }: { schema: ScreenSchema }) {
  return (
    <div className="space-y-6 p-6">
      {schema.title && (
        <header>
          <h1 className="text-2xl font-semibold">{schema.title}</h1>
          {schema.subtitle && (
            <p className="text-muted-foreground text-sm">{schema.subtitle}</p>
          )}
        </header>
      )}

      {schema.components.map((c: ComponentSchema) => {
        // If a custom component is provided, use it instead of the registry
        if (c.component) {
          const CustomComponent = c.component;
          return <CustomComponent key={c.id} {...c.props} />;
        }

        const Renderer = registry[c.type];
        if (!Renderer) return <div key={c.id}>Unknown component: {c.type}</div>;
        return <Renderer key={c.id} schema={c} />;
      })}
    </div>
  );
}
