import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
      `${API_BASE_URL}/caracteristicas-inmueble/${params.id}/historial-aprobacion`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al obtener historial de aprobación:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener historial de aprobación" },
      { status: 500 }
    );
  }
}
