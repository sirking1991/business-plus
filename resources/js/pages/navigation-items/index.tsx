import { Pencil } from 'lucide-react';
import AdminIndexLayout from '@/components/admin/admin-index-layout';
import { TableColumn, TableAction } from '@/components/admin/data-table';

export default function NavigationItemsIndex({ items, filters }: { items: any; filters?: any }) {
    const columns: TableColumn[] = [
        { key: 'section', label: 'Section' },
        { key: 'title', label: 'Title' },
        { key: 'href', label: 'Href' },
        { key: 'icon', label: 'Icon' },
        { key: 'permission', label: 'Permission' },
        { key: 'sort', label: 'Sort' },
        { 
            key: 'is_active', 
            label: 'Active',
            render: (value) => value ? 'Yes' : 'No'
        },
    ];

    const actions: TableAction[] = [
        {
            label: 'Edit',
            icon: <Pencil className="h-4 w-4" />,
            href: (item) => `/admin/navigation-items/${item.id}/edit`,
            permission: 'navigation_item.edit',
        },
    ];

    return (
        <AdminIndexLayout
            title="Navigation"
            breadcrumbs={[{ title: 'Navigation', href: '/admin/navigation-items' }]}
            createUrl="/admin/navigation-items/create"
            createPermission="navigation_item.add"
            searchUrl="/admin/navigation-items"
            searchValue={filters?.search}
            data={items}
            columns={columns}
            actions={actions}
            itemName="items"
        />
    );
}
