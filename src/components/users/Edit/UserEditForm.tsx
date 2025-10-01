'use client';

type Role = {
  id?: string;
  nombre: string;
  descripcion?: string;
};

type UserEdit = {
  id?: string;
  username?: string;
  nombreCompleto: string;
  correo: string;
  contrasena?: string;
  isActive?: boolean;
  roles?: string[];
};

type Props = {
  open: boolean;
  initial?: UserEdit | null;
  saving?: boolean;
  onClose: () => void;
  onSave: (data: UserEdit) => void;
  availableRoles?: Role[];
};

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function UserEditForm({ open, initial, saving = false, onClose, onSave, availableRoles = [] }: Props) {
  const [form, setForm] = useState<UserEdit>({ nombreCompleto: '', correo: '', username: '', contrasena: '', isActive: true, roles: [] });

  useEffect(() => {
    console.log('UserEditForm - initial recibido:', initial);
    if (initial) {
      const formData = {
        id: initial.id,
        username: initial.username ?? '',
        nombreCompleto: initial.nombreCompleto ?? '',
        correo: initial.correo ?? '',
        contrasena: '',
        isActive: initial.isActive ?? true,
        roles: initial.roles || [],
      };
      console.log('UserEditForm - formData a establecer:', formData);
      setForm(formData);
    } else {
      setForm({ nombreCompleto: '', correo: '', username: '', contrasena: '', isActive: true, roles: [] });
    }
  }, [initial]);

  if (!open) return null;

  const modal = (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 modal">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 modal-content">
        <h3 className="text-lg font-semibold mb-4">{initial?.id ? 'Editar usuario' : 'Nuevo usuario'}</h3>
        <div className="space-y-3">
          {!initial?.id && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">Usuario</label>
              <input
                value={form.username || ''}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#676D47]"
                placeholder="usuario.ejemplo"
              />
            </div>
          )}
          {initial?.id && (
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Activo</label>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={!!form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="sr-only"
                  id="activo-toggle"
                />
                <label
                  htmlFor="activo-toggle"
                  className={`relative inline-flex h-6 w-11 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                    form.isActive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                      form.isActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                    style={{ marginTop: '4px' }}
                  />
                </label>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Nombre completo</label>
            <input
              value={form.nombreCompleto}
              onChange={(e) => setForm({ ...form, nombreCompleto: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#676D47]"
              placeholder="Nombre Apellido"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Correo</label>
            <input
              type="email"
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#676D47]"
              placeholder="correo@ejemplo.com"
              name="users-edit-email"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Contraseña {initial?.id ? '(opcional)' : ''}</label>
            <input
              type="password"
              value={form.contrasena || ''}
              onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#676D47]"
              placeholder={initial?.id ? 'Dejar en blanco para no cambiar' : '********'}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Roles {!initial?.id ? '(opcional)' : ''}</label>
            <div className="space-y-3">
              {availableRoles.map((role) => {
                const isChecked = form.roles?.includes(role.nombre) || false;
                console.log(`Rol ${role.nombre}: isChecked=${isChecked}, form.roles=`, form.roles);
                
                // Colores específicos para cada rol
                const getRoleColor = (roleName: string) => {
                  const colors: Record<string, string> = {
                    'Admin': 'bg-red-500',
                    'Analista': 'bg-blue-500', 
                    'Capturista': 'bg-green-500',
                    'Vista': 'bg-purple-500'
                  };
                  return colors[roleName] || 'bg-gray-500';
                };
                
                const roleColor = getRoleColor(role.nombre);
                
                return (
                  <label key={role.id || role.nombre} className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const currentRoles = form.roles || [];
                          if (e.target.checked) {
                            setForm({ ...form, roles: [...currentRoles, role.nombre] });
                          } else {
                            setForm({ ...form, roles: currentRoles.filter(r => r !== role.nombre) });
                          }
                        }}
                        className="sr-only"
                        id={`role-${role.nombre}`}
                      />
                      <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                        isChecked 
                          ? `${roleColor} border-transparent` 
                          : 'border-gray-300 bg-white group-hover:border-gray-400'
                      }`}>
                        {isChecked && (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">{role.nombre}</span>
                      {role.descripcion && (
                        <p className="text-xs text-gray-500 mt-0.5">{role.descripcion}</p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">Cancelar</button>
          <button onClick={() => onSave(form)} disabled={saving} className="px-4 py-2 rounded-md bg-[#737B4C] text-white hover:bg-[#5a6140] disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );

  // Render como portal para no afectar el layout de la tabla
  if (typeof document !== 'undefined') {
    return createPortal(modal, document.body);
  }
  return modal;
}


