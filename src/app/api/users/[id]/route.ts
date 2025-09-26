import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const token = (await cookies()).get("access_token")?.value;
  const body = await request.text();
  const { id } = await context.params;
  const res = await fetch(
    new URL(`/api/v1/users/${id}`, API_BASE_URL).toString(),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body,
    }
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const token = (await cookies()).get("access_token")?.value;
  const { id } = await context.params;
  const res = await fetch(
    new URL(`/api/v1/users/${id}`, API_BASE_URL).toString(),
    {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
