import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "50";
    const offset = searchParams.get("offset") || "0";
    const entidad = searchParams.get("entidad");

    // Construir URL del backend
    const backendUrl = new URL(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      }/api/v1/bitacora`
    );
    backendUrl.searchParams.set("limit", limit);
    backendUrl.searchParams.set("offset", offset);
    if (entidad) {
      backendUrl.searchParams.set("entidad", entidad);
    }

    // Hacer la petición al backend
    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en API bitácora:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener datos de bitácora",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
