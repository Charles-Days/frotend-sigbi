import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function GET() {
    try {
        const jar = await cookies();
        const token = jar.get('access_token')?.value;
        if (!token) {
            return NextResponse.json({ ok: false, message: 'No autenticado' }, { status: 401 });
        }

        const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
        const targetUrl = new URL('/api/v1/auth/me', API_BASE_URL).toString();

        try {
            const response = await axios.get(targetUrl, {
                headers: { Authorization: `Bearer ${token}` },
                validateStatus: () => true,
                timeout: 10000,
            });
            return NextResponse.json(response.data, { status: response.status });
        } catch (err) {
            const status = (err as any)?.response?.status ?? 502;
            const data = (err as any)?.response?.data ?? { ok: false, message: 'Error conectando con el API' };
            console.error('[AUTH_ME_PROXY_ERROR]', { targetUrl, status, data });
            return NextResponse.json(data, { status });
        }
    } catch {
        return NextResponse.json({ ok: false, message: 'Error interno' }, { status: 500 });
    }
}


