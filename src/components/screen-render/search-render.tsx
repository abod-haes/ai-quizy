/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

export default function SearchRenderer({ schema }: any) {
  const [value, setValue] = useState("");
  return (
    <input
      type="text"
      placeholder={schema.props?.placeholder || "Search..."}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full rounded-md border p-2"
    />
  );
}
