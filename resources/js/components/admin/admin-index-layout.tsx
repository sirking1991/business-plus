import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import PageHeader from './page-header';
import DataTable, { TableColumn, TableAction } from './data-table';
import Pagination from './pagination';

interface AdminIndexLayoutProps {
    title: string;
    breadcrumbs: Array<{ title: string; href: string }>;
    createUrl?: string;
    createPermission?: string;
    searchUrl: string;
    searchValue?: string;
    data: any;
    columns: TableColumn[];
    actions?: TableAction[];
    itemName?: string;
}

export default function AdminIndexLayout({
    title,
    breadcrumbs,
    createUrl,
    createPermission,
    searchUrl,
    searchValue,
    data,
    columns,
    actions,
    itemName = 'items'
}: AdminIndexLayoutProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />

            <div className="p-4 space-y-4">
                <PageHeader
                    title={title}
                    createUrl={createUrl}
                    createPermission={createPermission}
                    searchUrl={searchUrl}
                    searchValue={searchValue}
                />

                <DataTable
                    columns={columns}
                    data={data.data}
                    actions={actions}
                />

                <Pagination data={data} itemName={itemName} />
            </div>
        </AppLayout>
    );
}
