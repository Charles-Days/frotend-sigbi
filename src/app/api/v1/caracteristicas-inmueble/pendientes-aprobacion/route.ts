import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "0";
    const pageSize = searchParams.get("pageSize") || "50";

    console.log("🔍 [Pendientes] Iniciando request...");
    console.log("🔍 [Pendientes] API_BASE_URL:", API_BASE_URL);

    // Obtener token de la cookie access_token (igual que /api/auth/me)
    const jar = await cookies();
    const token = jar.get("access_token")?.value;

    console.log("🔍 [Pendientes] Token encontrado:", !!token);

    if (!token) {
      console.log("❌ [Pendientes] No hay token de autenticación");
      return NextResponse.json(
        { success: false, message: "No autenticado" },
        { status: 401 }
      );
    }

    const url = `${API_BASE_URL}/caracteristicas-inmueble/pendientes-aprobacion?page=${page}&pageSize=${pageSize}`;
    console.log("🔍 [Pendientes] URL del backend:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("🔍 [Pendientes] Status del backend:", response.status);
    console.log(
      "🔍 [Pendientes] Headers del backend:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ [Pendientes] Error del backend:", errorText);
      throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ [Pendientes] Respuesta del backend:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "❌ [Pendientes] Error al obtener inmuebles pendientes de aprobación:",
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: `Error al obtener inmuebles pendientes de aprobación: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
      },
      { status: 500 }
    );
  }
}
