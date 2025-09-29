import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const token = (await cookies()).get("access_token")?.value;
  const { id } = await context.params;
  const target = new URL(
    `/api/v1/caracteristicas-inmueble/${id}/estado-registro`,
    API_BASE_URL
  ).toString();
  const res = await fetch(target, {
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
