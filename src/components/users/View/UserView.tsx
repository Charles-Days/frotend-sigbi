'use client';

type Role = { id?: string; nombre: string; descripcion?: string };
type Usuario = {
  id: string;
  username: string;
  nombreCompleto: string;
  correo: string;
  activo: boolean;
  roles?: Role[] | string[];
  createdAt?: string;
  updatedAt?: string;
};

type Props = {
  user: Usuario | null;
  open: boolean;
  onClose: () => void;
};

import { createPortal } from 'react-dom';

export default function UserView({ user, open, onClose }: Props) {
  if (!open || !user) return null;

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Detalle del Usuario</h3>
        <div className="space-y-2 text-sm text-gray-800">
          <div><span className="font-medium">Usuario:</span> {user.username}</div>
          <div><span className="font-medium">Nombre:</span> {user.nombreCompleto}</div>
          <div><span className="font-medium">Correo:</span> {user.correo}</div>
          <div><span className="font-medium">Estado:</span> {user.activo ? 'Activo' : 'Inactivo'}</div>
          <div className="flex items-start gap-2"><span className="font-medium">Roles:</span>
            <div className="flex flex-wrap gap-1">
              {(Array.isArray(user.roles) ? (user.roles as Array<Role | string>) : []).map((r, idx: number) => (
                <span key={idx} className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{typeof r === 'string' ? r : r.nombre}</span>
              ))}
            </div>
          </div>
          {user.createdAt && <div><span className="font-medium">Creado:</span> {user.createdAt}</div>}
          {user.updatedAt && <div><span className="font-medium">Actualizado:</span> {user.updatedAt}</div>}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">Cerrar</button>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }
  return content;
}


