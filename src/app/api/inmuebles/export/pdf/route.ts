import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

export async function POST(request: Request) {
  const token = (await cookies()).get("access_token")?.value;
  const body = await request.text();
  const res = await fetch(
    new URL("/api/v1/inmuebles/export/pdf", API_BASE_URL).toString(),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body,
    }
  );
  const blob = await res.arrayBuffer();
  return new NextResponse(Buffer.from(blob), {
    status: res.status,
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
