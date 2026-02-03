import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiBaseUrl } from "../../../lib/api";

async function proxy(request: Request, params: { path: string[] }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("mth_access")?.value;
  const url = new URL(request.url);
  const targetUrl = `${apiBaseUrl}/api/v1/${params.path.join("/")}${url.search}`;

  const headers: Record<string, string> = {
    "Content-Type": request.headers.get("Content-Type") ?? "application/json"
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const body =
    request.method === "GET" || request.method === "HEAD" ? undefined : await request.text();

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body
  });

  const responseText = await response.text();
  return new NextResponse(responseText, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json"
    }
  });
}

export async function GET(request: Request, context: { params: { path: string[] } }) {
  return proxy(request, context.params);
}

export async function POST(request: Request, context: { params: { path: string[] } }) {
  return proxy(request, context.params);
}

export async function PATCH(request: Request, context: { params: { path: string[] } }) {
  return proxy(request, context.params);
}

export async function DELETE(request: Request, context: { params: { path: string[] } }) {
  return proxy(request, context.params);
}
