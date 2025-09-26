import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeToken(token: string) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch {
        return null;
    }
}

function roleToPath(roles: string[] | undefined | null): string {
    if (!roles || roles.length === 0) return '/home-vista';
    const priority = ['Admin', 'Capturista', 'Analista', 'Vista'];
    const found = priority.find((r) => roles.includes(r)) || roles[0];
    const map: Record<string, string> = {
        Admin: '/home-admin',
        Capturista: '/home-capturista',
        Analista: '/home-analista',
        Vista: '/home-vista',
    };
    return map[found] || '/home-vista';
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get('access_token')?.value;
    console.log('[MW]', { pathname, hasToken: !!token });

    // Proteger rutas /home*
    if (pathname.startsWith('/home')) {
        if (!token) {
            const url = req.nextUrl.clone();
            url.pathname = '/login';
            console.log('[MW] redirect -> /login');
            return NextResponse.redirect(url);
        }
    }

    // Evitar mostrar /login si ya hay sesión - redirigir al home específico del rol
    if (pathname.startsWith('/login') && token) {
        const tokenPayload = decodeToken(token);
        const userHome = roleToPath(tokenPayload?.roles);
        const url = req.nextUrl.clone();
        url.pathname = userHome;
        console.log('[MW] redirect -> ', userHome);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/home', '/home/:path*', '/login'],
};


