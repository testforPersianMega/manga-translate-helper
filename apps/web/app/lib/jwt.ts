export type JwtPayload = {
  role?: string;
  sub?: string;
};

export function decodeJwtPayload(token: string): JwtPayload {
  const payload = token.split(".")[1];
  if (!payload) {
    return {};
  }
  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = Buffer.from(padded, "base64").toString("utf-8");
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return {};
  }
}
