import { NextResponse } from "next/server";
import { apiBaseUrl } from "../../../lib/api";

type LoginPayload = {
  email: string;
  password: string;
};

function decodeJwtPayload(token: string): { role?: string; sub?: string } {
  const payload = token.split(".")[1];
  if (!payload) {
    return {};
  }
  const decoded = Buffer.from(payload, "base64").toString("utf-8");
  try {
    return JSON.parse(decoded);
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as LoginPayload;
  const response = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const data = (await response.json()) as { accessToken: string; refreshToken: string };
  const payload = decodeJwtPayload(data.accessToken);
  const role = payload.role ?? "VIEWER";
  const userId = payload.sub ?? "";

  const redirectTo = role === "ADMIN" ? "/admin" : "/app";
  const nextResponse = NextResponse.json({ redirectTo });
  nextResponse.cookies.set("mth_access", data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
  nextResponse.cookies.set("mth_refresh", data.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
  nextResponse.cookies.set("mth_role", role, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
  nextResponse.cookies.set("mth_user", userId, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
  return nextResponse;
}
