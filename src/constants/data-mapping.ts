export const fakeOrders = Array.from({ length: 150 }).map((_, i) => ({
  id: i + 1,
  customer: ["Alice", "Bob", "Charlie", "Dana"][i % 4],
  total: Math.round(Math.random() * 500),
  status: ["open", "closed", "returned"][i % 3],
}));
