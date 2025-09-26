'use client';

import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refresh } = useAuth();


  const roleToPath = (roles: string[] | undefined | null): string => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post('/api/users/login', { identifier, contrasena }, { validateStatus: () => true, withCredentials: true });
      if (response.status >= 200 && response.status < 300) {
        // Actualizar el contexto de autenticación
        await refresh();
        const roles: string[] | undefined = response.data?.data?.user?.roles || response.data?.data?.roles;
        const path = roleToPath(roles);
        router.push(path);
      } else {
        const msg = (response.data && (response.data.message || response.data.error)) || 'Error de autenticación';
        setError(msg);
      }
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: 'url(/LOG-IN-01.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100vw'
      }}
    >

      {/* Card de login centrada en el lado derecho */}
      <div className="relative z-10 w-full min-h-screen flex items-center p-4">
        <div className="w-1/2"></div>
        <div className="w-1/2 flex justify-center">
          <div className="bg-[#5C635B]/80 backdrop-blur-sm rounded-3xl w-full max-w-sm lg:max-w-md xl:max-w-lg p-8 lg:p-12 xl:p-16 py-16 lg:py-20 xl:py-24 shadow-lg">
          {/* Logo centrado */}
          <div className="flex flex-col items-center mb-8 lg:mb-12">
            <Image 
              src="/LogoQuetzal.svg" 
              alt="Logo SIGBI" 
              width={120} 
              height={120} 
              className="w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 mb-2" 
            />
            <p className="text-white text-2xl lg:text-xl xl:text-2xl text-center font-medium">
              Inicia sesión
            </p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
          {/* Input Usuario */}
          <div className="relative">
            <input
              id="identifier"
              name="identifier"
              type="text"
              required
              placeholder="Usuario"
              className="w-full rounded-full border-2 border-white bg-transparent px-6 py-4 lg:py-5 text-white placeholder-white focus:outline-none focus:ring-0 text-lg lg:text-xl"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          {/* Input Contraseña */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Contraseña"
              className="w-full rounded-full border-2 border-white bg-transparent px-6 py-4 lg:py-5 text-white placeholder-white focus:outline-none focus:ring-0 text-lg lg:text-xl"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {error && <p className="text-red-300 text-center text-lg" role="alert">{error}</p>}

          {/* Botón Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#4A5249] px-6 py-4 lg:py-5 text-white font-medium text-lg lg:text-xl hover:bg-[#3d443c] focus:outline-none focus:ring-0 transition-colors"
          >
            {loading ? 'INGRESANDO...' : 'LOGIN'}
          </button>
        </form>
          </div>
        </div>
      </div>
    </div>
  );
}


