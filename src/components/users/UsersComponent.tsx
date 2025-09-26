'use client';

import { useEffect, useRef, useState } from 'react';
// Pagination es usado desde UsersList
import UsersList from './List/UsersList';
import UserEditForm from './Edit/UserEditForm';
import UserView from './View/UserView';
import Toast from '@/components/ui/Toast';

type Role = { id?: string; nombre: string; descripcion?: string };
type Usuario = {
  id: string;
  username: string;
  nombreCompleto: string;
  correo: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
  roles?: Role[] | string[];
};

type UserForm = {
  username: string;
  nombreCompleto: string;
  correo: string;
  contrasena: string;
  isActive?: boolean;
  roles?: string[];
};

export default function UsersComponent() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  
  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });

  const [search, setSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showForm) {
      // Ignorar cambios en el buscador mientras un modal esté abierto
      return;
    }
    setSearch(e.target.value);
    setPage(0);
  };
  const [sortField] = useState('createdAt');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal estado
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [form, setForm] = useState<UserForm>({
    username: '',
    nombreCompleto: '',
    correo: '',
    contrasena: '',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  // Confirmación de borrado
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);

  // Removed unused params variable

  // Helper function to show toast
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2500);
  };

  const cargarRoles = async () => {
    try {
      const res = await fetch('/api/roles');
      if (!res.ok) throw new Error('Error al cargar roles');
      const data = await res.json();
      setAvailableRoles(data.data || []);
    } catch (err) {
      console.error('Error al cargar roles:', err);
    }
  };

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const qs = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(search ? { search } : {}),
        ...(sortField ? { sortField } : {}),
        ...(sortOrder ? { sortOrder } : {}),
      }).toString();
      console.debug('[Users] fetch list', { qs });
      const res = await fetch(`/api/users?${qs}`, { headers: { 'Content-Type': 'application/json' }, cache: 'no-store' });
      const data = await res.json();
      const usuarios: Usuario[] = data?.data?.users || [];
      const meta = data?.data?.meta || data?.meta;
      setUsers(usuarios);
      if (meta) {
        setTotalItems(meta.total ?? usuarios.length);
        setTotalPages(meta.totalPages ?? Math.ceil((meta.total ?? usuarios.length) / pageSize));
      } else {
        setTotalItems(usuarios.length);
        setTotalPages(Math.ceil(usuarios.length / pageSize));
      }
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      showToast('No se pudieron obtener los usuarios', 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRoles();
    cargarUsuarios();
    // Dependencias estrictas para evitar recargas por apertura de modal
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search, sortField, sortOrder]);

  // Blindaje: si se abre el modal y el navegador/gestor intenta autocompletar campos,
  // restauramos el valor del buscador y quitamos el foco del input para evitar cambios inesperados
  useEffect(() => {
    if (showForm) {
      const current = search;
      // microtask para ejecutar después de cualquier autofill del navegador
      const t = setTimeout(() => {
        setSearch(current);
        if (searchInputRef.current) {
          searchInputRef.current.blur();
        }
      }, 0);
      return () => clearTimeout(t);
    }
  }, [showForm, search]);

  const openCreate = () => {
    setEditingUser(null);
    setForm({ username: '', nombreCompleto: '', correo: '', contrasena: '', isActive: true, roles: [] });
    setShowForm(true);
  };

  const openEdit = (u: Usuario) => {
    setEditingUser(u);
    // Extraer solo los nombres de los roles del objeto completo
    const userRoles = Array.isArray(u.roles) 
      ? u.roles.map(r => {
          if (typeof r === 'string') return r;
          if (typeof r === 'object' && r.nombre) return r.nombre;
          return '';
        }).filter(Boolean)
      : [];
    
    console.log('Usuario para editar:', u);
    console.log('Roles extraídos:', userRoles);
    console.log('Estado activo del usuario:', u.activo);
    
    setForm({ 
      username: u.username, 
      nombreCompleto: u.nombreCompleto, 
      correo: u.correo, 
      contrasena: '', 
      isActive: u.activo, // Usar directamente el campo 'activo' del backend
      roles: userRoles
    });
    setShowForm(true);
  };

  const handleSave = async (override?: Partial<UserForm>) => {
    try {
      setSaving(true);
      const data: UserForm = { ...form, ...(override || {}) } as UserForm;
      if (editingUser) {
        const patch: Record<string, unknown> = {};
        if (data.nombreCompleto) patch.nombreCompleto = data.nombreCompleto;
        if (data.correo) patch.correo = data.correo;
        if (data.contrasena) patch.contrasena = data.contrasena;
        if (typeof data.isActive === 'boolean') patch.isActive = data.isActive;
        if (data.roles && data.roles.length > 0) {
          // Asegurar que solo se envíen nombres de roles (strings)
          patch.roles = data.roles.filter(role => typeof role === 'string' && role.trim() !== '');
        }
        const res = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
        if (!res.ok) throw new Error('Error al actualizar usuario');
        showToast('Usuario actualizado exitosamente', 'success');
      } else {
        const createPayload: Record<string, unknown> = {
          username: data.username,
          nombreCompleto: data.nombreCompleto,
          correo: data.correo,
          contrasena: data.contrasena,
          ...(data.roles && data.roles.length > 0 ? { 
            roles: data.roles.filter(role => typeof role === 'string' && role.trim() !== '') 
          } : {}),
        };
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createPayload),
        });
        if (!res.ok) throw new Error('Error al crear usuario');
        showToast('Usuario creado exitosamente', 'success');
      }
      setShowForm(false);
      await cargarUsuarios();
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      showToast('No se pudo guardar el usuario', 'error');
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (u: Usuario) => {
    setUserToDelete(u);
    setConfirmDeleteOpen(true);
  };

  const performDelete = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/users/${userToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar usuario');
      showToast('Usuario eliminado exitosamente', 'success');
      await cargarUsuarios();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      showToast('No se pudo eliminar el usuario', 'error');
    } finally {
      setConfirmDeleteOpen(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1EE' }}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-sm text-gray-600">Crear, editar y eliminar usuarios</p>
          </div>
          <button onClick={openCreate} className="bg-[#737B4C] text-white px-4 py-2 rounded-lg hover:bg-[#5a6140] transition-colors">Nuevo usuario</button>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Buscar usuario..."
            name="users-global-search"
            autoComplete="new-password"
            autoCorrect="off"
            spellCheck={false}
            ref={searchInputRef}
            readOnly={showForm}
            className="w-full md:w-96 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent bg-white text-gray-900 placeholder-gray-400 caret-gray-900"
          />
        </div>

        <UsersList
          users={users}
          loading={loading}
          onEdit={(u) => openEdit(u)}
          onDelete={requestDelete}
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          onItemsPerPageChange={(n) => { setPageSize(n); setPage(0); }}
        />

        <UserEditForm
          open={showForm}
          initial={editingUser ? (() => {
            const initialData = {
              id: editingUser.id,
              username: editingUser.username,
              nombreCompleto: editingUser.nombreCompleto,
              correo: editingUser.correo,
              contrasena: '',
              isActive: editingUser.activo,
              roles: form.roles || []
            };
            console.log('Datos iniciales para el formulario:', initialData);
            return initialData;
          })() : null}
          saving={saving}
          onClose={() => setShowForm(false)}
          onSave={(payload) => {
            handleSave(payload as Partial<UserForm>);
          }}
          availableRoles={availableRoles}
        />
        <UserView
          open={false}
          user={null}
          onClose={() => {}}
        />

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(prev => ({ ...prev, show: false }))}
            durationMs={2000}
          />
        )}

        {confirmDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={cancelDelete} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
              <h3 className="text-lg font-semibold text-gray-900">Confirmar eliminación</h3>
              <p className="mt-2 text-sm text-gray-600">
                ¿Seguro que deseas eliminar al usuario{' '}
                <span className="font-medium text-gray-900">{userToDelete?.username}</span>?
                Esta acción no se puede deshacer.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={performDelete}
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


