import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { nuevoEstado, comentarios } = body;

    if (!nuevoEstado) {
      return NextResponse.json(
        { success: false, message: "El campo nuevoEstado es requerido" },
        { status: 400 }
      );
    }

    // Obtener token de la cookie access_token
    const jar = await cookies();
    const token = jar.get("access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No autenticado" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/caracteristicas-inmueble/${params.id}/cambiar-estado-aprobacion`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nuevoEstado,
          comentarios: comentarios || null,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error del servidor: ${response.status}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al cambiar estado de aprobación:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al cambiar estado de aprobación",
      },
      { status: 500 }
    );
  }
}
