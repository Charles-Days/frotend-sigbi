import { NextResponse } from 'next/server';
import axios from 'axios';

type LoginBody = { identifier?: string; correo?: string; email?: string; username?: string; contrasena?: string };

export async function POST(request: Request) {
    try {
        const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

        const body = (await request.json()) as LoginBody;
        const identifier = body?.identifier ?? body?.correo ?? body?.email ?? body?.username ?? '';
        const contrasena = body?.contrasena ?? '';

        const errors: Array<{ field: string; message: string }> = [];
        if (!identifier) errors.push({ field: 'identifier', message: 'El identificador es requerido' });
        if (!contrasena) errors.push({ field: 'contrasena', message: 'La contraseña es requerida' });
        if (errors.length > 0) {
            return NextResponse.json(
                { ok: false, message: 'Errores de validación', errors },
                { status: 400 }
            );
        }

        const targetUrl = new URL('/api/v1/users/login', API_BASE_URL).toString();
        try {
            const response = await axios.post(
                targetUrl,
                { identifier, contrasena },
                { headers: { 'Content-Type': 'application/json' }, validateStatus: () => true, timeout: 10000 }
            );
            const res = NextResponse.json(response.data, { status: response.status });
            if (response.status >= 200 && response.status < 300 && response.data?.data?.access_token) {
                const token: string = response.data.data.access_token;
                let maxAge: number | undefined;
                try {
                    const [, payloadB64] = token.split('.');
                    const payloadJson = Buffer.from(payloadB64, 'base64').toString('utf-8');
                    const payload = JSON.parse(payloadJson);
                    if (payload?.exp) {
                        const nowSec = Math.floor(Date.now() / 1000);
                        const delta = Number(payload.exp) - nowSec;
                        if (delta > 0) maxAge = delta;
                    }
                } catch { }
                res.cookies.set('access_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    ...(maxAge ? { maxAge } : {}),
                });
            }
            return res;
        } catch (err) {
            const axiosErr = err as { response?: { status?: number; data?: unknown } };
            const status = axiosErr?.response?.status ?? 502;
            const data = axiosErr?.response?.data ?? { ok: false, message: 'Error conectando con el API' };
            console.error('[LOGIN_PROXY_ERROR]', { targetUrl, status, data });
            return NextResponse.json(data, { status });
        }
    } catch {
        return NextResponse.json(
            { ok: false, message: 'Error en el servidor' },
            { status: 500 }
        );
    }
}


