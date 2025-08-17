import { Pencil } from 'lucide-react';
import AdminIndexLayout from '@/components/admin/admin-index-layout';
import { TableColumn, TableAction } from '@/components/admin/data-table';

export default function RolesIndex({ roles, filters }: { roles: any; filters?: any }) {
    const columns: TableColumn[] = [
        { key: 'name', label: 'Name' },
        { key: 'guard_name', label: 'Guard' },
        { key: 'permissions_count', label: 'Permissions' },
        { key: 'created_at', label: 'Created' },
    ];

    const actions: TableAction[] = [
        {
            label: 'Edit',
            icon: <Pencil className="h-4 w-4" />,
            href: (role) => `/admin/roles/${role.id}/edit`,
            permission: 'role.edit',
        },
    ];

    return (
        <AdminIndexLayout
            title="Roles"
            breadcrumbs={[{ title: 'Roles', href: '/admin/roles' }]}
            createUrl="/admin/roles/create"
            createPermission="role.add"
            searchUrl="/admin/roles"
            searchValue={filters?.search}
            data={roles}
            columns={columns}
            actions={actions}
            itemName="roles"
        />
    );
}
