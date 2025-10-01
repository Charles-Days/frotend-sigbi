import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

export async function POST(request: Request) {
  const token = (await cookies()).get("access_token")?.value;
  const payload = await request.json().catch(() => ({}));

  const target = new URL(
    `/api/v1/analytics/custom-charts`,
    API_BASE_URL
  ).toString();

  const res = await fetch(target, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
