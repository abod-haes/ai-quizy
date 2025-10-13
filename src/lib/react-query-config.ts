export const CACHE_KEYS = {
   user: "user",
   plan: (id: string) => ["plan", id],
} as const;

export const fiveMinutesStaleTime = 1000 * 60 * 5; // Consider data fresh for 5 minutes
export const thirtyMinutesGcTime = 1000 * 60 * 30; // Keep data in cache for 30 minutes

export const oneHourTime = 1000 * 60 * 60;
