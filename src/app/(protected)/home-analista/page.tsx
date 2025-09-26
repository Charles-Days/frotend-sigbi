'use client';

import Image from 'next/image';

export default function HomeAnalistaPage() {
  return (
    <div className="h-full w-full bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full h-full flex items-center justify-center">
        {/* Logo súper grande centrado */}
        <Image
          src="/LOGOS_SECRETARIA_PERSONIFICADORES_ADMINISTRACION.png"
          alt="Logo SIGBI"
          width={1000}
          height={1000}
          className="w-[80vw] h-[80vh] max-w-[800px] max-h-[800px] object-contain"
        />
      </div>
    </div>
  );
}


