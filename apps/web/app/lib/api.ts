const rawApiBaseUrl =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export const apiBaseUrl = rawApiBaseUrl.replace(/\/api\/v1\/?$/, "");
