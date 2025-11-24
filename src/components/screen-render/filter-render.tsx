"use client";
import React from "react";
import type { ComponentSchema } from "@/types/screen.types";

export default function FiltersRenderer({
  schema,
}: {
  schema: ComponentSchema;
}) {
  // If a React node component is provided, render it directly
  if (schema.component) {
    const CustomComponent = schema.component;
    return <CustomComponent />;
  }
 
  return null;
}
