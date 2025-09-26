'use client';

type Role = { id?: string; nombre: string; descripcion?: string };
export type Usuario = {
  id: string;
  username: string;
  nombreCompleto: string;
  correo: string;
  activo: boolean;
  roles?: Role[] | string[];
};

type UsersListProps = {
  users: Usuario[];
  loading?: boolean;
  onEdit: (u: Usuario) => void;
  onDelete: (u: Usuario) => void;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (n: number) => void;
};

import Pagination from '@/components/ui/Pagination';
import { Edit, Trash2 } from 'lucide-react';

// Función para obtener colores específicos para cada rol
const getRoleColors = (roleName: string) => {
  const roleColors: Record<string, { bg: string; text: string }> = {
    'Admin': { bg: 'bg-red-100', text: 'text-red-800' },
    'Analista': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'Capturista': { bg: 'bg-green-100', text: 'text-green-800' },
    'Vista': { bg: 'bg-purple-100', text: 'text-purple-800' },
  };
  
  return roleColors[roleName] || { bg: 'bg-gray-100', text: 'text-gray-800' };
};

export default function UsersList({
  users,
  loading = false,
  onEdit,
  onDelete,
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onItemsPerPageChange,
}: UsersListProps) {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.nombreCompleto}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.correo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(u.roles) ? (u.roles as Array<Role | string>) : []).map((r, idx: number) => {
                      const roleName = typeof r === 'string' ? r : r.nombre;
                      const colors = getRoleColors(roleName);
                      return (
                        <span 
                          key={idx} 
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                        >
                          {roleName}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {u.activo ? (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Activo</span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactivo</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEdit(u)} 
                      className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                      title="Editar usuario"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(u)} 
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
                      title="Eliminar usuario"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Sin resultados</td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Cargando...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={pageSize}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
        loading={loading}
      />
    </div>
  );
}


