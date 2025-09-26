import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

export async function POST(request: Request) {
  const token = (await cookies()).get("access_token")?.value;
  // Detectar si viene multipart/form-data o JSON y hacer passthrough adecuado
  const contentType = request.headers.get("content-type") || "";
  let fetchOptions: RequestInit;
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    fetchOptions = {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // IMPORTANTE: no establecer Content-Type manualmente para multipart
      },
      body: formData,
    } as RequestInit;
  } else {
    const body = await request.text();
    fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body,
    };
  }
  const res = await fetch(
    new URL(
      "/api/v1/caracteristicas-inmueble/registro-parcial",
      API_BASE_URL
    ).toString(),
    fetchOptions
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
