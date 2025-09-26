import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = (await cookies()).get("access_token")?.value;
  const targetUrl = new URL("/api/v1/users", API_BASE_URL);
  targetUrl.search = url.search;
  const res = await fetch(targetUrl.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: Request) {
  const token = (await cookies()).get("access_token")?.value;
  const body = await request.text();
  const res = await fetch(new URL("/api/v1/users", API_BASE_URL).toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
