import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entidad = searchParams.get("entidad");

    // Construir URL del backend
    const backendUrl = new URL(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      }/api/v1/bitacora/count`
    );
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
    console.error("Error en API bitácora count:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener conteo de bitácora",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
