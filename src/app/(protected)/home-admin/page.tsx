'use client';

import Image from 'next/image';

export default function HomeAdminPage() {
  return (
    <div className="h-full w-full flex items-center justify-center p-4" style={{backgroundColor: '#F5F1EE'}}>
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


