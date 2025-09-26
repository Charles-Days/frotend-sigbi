import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jar = await cookies();
  const token = jar.get('access_token')?.value;
  if (token) {
    const tokenPayload = decodeToken(token);
    const userHome = roleToPath(tokenPayload?.roles);
    redirect(userHome);
  }
  return children;
}


   