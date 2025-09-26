import AppShell from "@/components/layout/AppShell";
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jar = await cookies();
  const token = jar.get('access_token')?.value;
  if (!token) {
    redirect('/login');
  }
  return <AppShell>{children}</AppShell>;
}


