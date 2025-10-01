import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

export async function POST(request: Request) {
  const token = (await cookies()).get("access_token")?.value;
  const body = await request.text();
  const url = new URL(
    "/api/v1/caracteristicas-inmueble/export/pdf",
    API_BASE_URL
  ).toString();
  try {
    console.log("[EXPORT/PDF] Proxy request ->", {
      url,
      hasToken: !!token,
      bodyLength: body?.length || 0,
    });
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[EXPORT/PDF] Backend error", res.status, text);
      return NextResponse.json(
        { success: false, status: res.status, error: text },
        { status: res.status }
      );
    }

    const blob = await res.arrayBuffer();
    return new NextResponse(Buffer.from(blob), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=report_${Date.now()}.pdf`,
      },
    });
  } catch (err: unknown) {
    console.error("[EXPORT/PDF] Proxy exception", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: true, route: "/api/inmuebles/export/pdf" },
    { status: 200 }
  );
}
