"use client";
// import { Button } from "@/components/ui/button";
// import { Lang, getDictionary } from "@/utils/translations/dictionary-utils";
import ScreenRenderer from "@/components/screen-render/screen-render";
import { ScreenSchema } from "@/types/screen.types";
import React, { useState, useMemo } from "react";
import {
  SearchComponent,
  FilterComponent,
  DataTable,
} from "@/components/section/dashboard";

/**
 * Dynamic Screen Render with Beautiful UI Components
 *
 * Using custom components from @components/custom/ with beautiful UI design
 */

interface FilterChangeHandler {
  status?: string;
  priority?: string;
}

// Dashboard component with state management
function DashboardWithState() {
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState<FilterChangeHandler>({
    status: "all",
    priority: "all",
  });

  // Mock data for demonstration
  const mockData = useMemo(
    () => [
      {
        id: 1,
        customer: "John Doe",
        total: 150.0,
        status: "pending",
        priority: "high",
      },
      {
        id: 2,
        customer: "Jane Smith",
        total: 275.5,
        status: "completed",
        priority: "medium",
      },
      {
        id: 3,
        customer: "Bob Johnson",
        total: 89.99,
        status: "pending",
        priority: "low",
      },
      {
        id: 4,
        customer: "Alice Brown",
        total: 420.75,
        status: "completed",
        priority: "high",
      },
      {
        id: 5,
        customer: "Charlie Wilson",
        total: 199.99,
        status: "cancelled",
        priority: "medium",
      },
    ],
    [],
  );

  // Filter and search data
  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      const matchesSearch =
        item.customer.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.id.toString().includes(searchValue);

      const matchesStatus =
        filters.status === "all" || item.status === filters.status;
      const matchesPriority =
        filters.priority === "all" || item.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [mockData, searchValue, filters]);

  const handleFilterChange = (newFilters: FilterChangeHandler) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Calculate counts for filter badges
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    mockData.forEach((item) => {
      counts[item.status] = (counts[item.status] || 0) + 1;
    });
    return counts;
  }, [mockData]);

  const priorityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    mockData.forEach((item) => {
      counts[item.priority] = (counts[item.priority] || 0) + 1;
    });
    return counts;
  }, [mockData]);

  const fakeScreen: ScreenSchema = {
    title: "Orders Dashboard",
    subtitle: "Manage and track your orders with beautiful UI components",
    layout: "stack",
    components: [
      // Beautiful Search Component
      {
        id: "search",
        type: "search",
        component: () => (
          <SearchComponent
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search orders by customer name or ID..."
            showResultsCount={true}
            resultsCount={filteredData.length}
          />
        ),
      },
      // Beautiful Filter Component
      {
        id: "filters",
        type: "filters",
        component: () => (
          <FilterComponent
            onFilterChange={handleFilterChange}
            status={filters.status}
            priority={filters.priority}
            showActiveFilters={true}
            statusCounts={statusCounts}
            priorityCounts={priorityCounts}
          />
        ),
      },
      // Beautiful Data Table
      {
        id: "orders-table",
        type: "table",
        component: () => (
          <DataTable
            data={filteredData}
            columns={[
              { accessor: "id", header: "Order ID" },
              { accessor: "customer", header: "Customer" },
              { accessor: "total", header: "Total" },
              { accessor: "status", header: "Status" },
              { accessor: "priority", header: "Priority" },
            ]}
            title="Orders"
            subtitle={`${filteredData.length} of ${mockData.length} orders`}
            showActions={true}
            onRowClick={(row) => console.log("Row clicked:", row)}
            emptyMessage="No orders found matching your criteria"
          />
        ),
      },
    ],
  };

  return <ScreenRenderer schema={fakeScreen} />;
}

function page() {
  return <DashboardWithState />;
}

export default page;
