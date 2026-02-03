import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiBaseUrl } from "../../../lib/api";
import { decodeJwtPayload } from "../../../lib/jwt";

export async function POST() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("mth_access")?.value;
  const refreshToken = cookieStore.get("mth_refresh")?.value;
  if (accessToken && refreshToken) {
    const payload = decodeJwtPayload(accessToken);
    await fetch(`${apiBaseUrl}/api/v1/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ userId: payload.sub ?? "", refreshToken })
    });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete("mth_access");
  response.cookies.delete("mth_refresh");
  response.cookies.delete("mth_role");
  response.cookies.delete("mth_user");
  return response;
}
