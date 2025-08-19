import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import PageHeader from '@/components/admin/page-header';
import DataTable, { TableColumn, TableAction } from '@/components/admin/data-table';
import Pagination from '@/components/admin/pagination';

interface ListPageLayoutProps {
    title: string;
    breadcrumbs: Array<{ title: string; href: string }>; 
    createUrl?: string;
    createPermission?: string;
    searchUrl: string;
    searchValue?: string;
    data: any; // paginated resource from server
    columns: TableColumn[];
    actions?: TableAction[];
    itemName?: string;
}

export default function ListPageLayout({
    title,
    breadcrumbs,
    createUrl,
    createPermission,
    searchUrl,
    searchValue,
    data,
    columns,
    actions,
    itemName = 'items',
}: ListPageLayoutProps) {
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
