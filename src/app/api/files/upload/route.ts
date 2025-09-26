import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

export async function POST(request: Request) {
  try {
    const token = (await cookies()).get("access_token")?.value;
    const { search } = new URL(request.url);
    const target = new URL(
      `/api/v1/files/upload${search}`,
      API_BASE_URL
    ).toString();

    const formData = await request.formData();

    const res = await fetch(target, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
