import { Pencil } from 'lucide-react';
import ListPageLayout from '@/components/list-page-layout';
import { TableColumn, TableAction } from '@/components/data-table';

export default function UsersIndex({ users, filters }: { users: any; filters?: any }) {
    const columns: TableColumn[] = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'created_at', label: 'Created' },
    ];

    const actions: TableAction[] = [
        {
            label: 'Edit',
            icon: <Pencil className="h-4 w-4" />,
            href: (user) => `/admin/users/${user.id}/edit`,
            permission: 'user.edit',
        },
    ];

    return (
        <ListPageLayout
            title="Users"
            breadcrumbs={[{ title: 'Users', href: '/admin/users' }]}
            createUrl="/admin/users/create"
            createPermission="user.add"
            searchUrl="/admin/users"
            searchValue={filters?.search}
            data={users}
            columns={columns}
            actions={actions}
            itemName="users"
        />
    );
}
