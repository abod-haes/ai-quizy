"use client";
import React from "react";

export default function FiltersRenderer() {
  return (
    <div className="flex gap-2">
      <select className="rounded border p-2">
        <option>Status</option>
        <option>Open</option>
        <option>Closed</option>
      </select>
      <button className="rounded bg-gray-100 px-3 py-2">Apply</button>
    </div>
  );
}
