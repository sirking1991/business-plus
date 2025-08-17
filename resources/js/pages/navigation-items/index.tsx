import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Pencil } from 'lucide-react';
import useCan from '@/hooks/use-can';

export default function NavigationItemsIndex({ items, filters }: { items: any; filters?: any }) {
    const can = useCan();
    const page = usePage();

    return (
        <AppLayout breadcrumbs={[{ title: 'Navigation', href: '/admin/navigation-items' }]}>
            <Head title="Navigation" />

            <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-semibold">Navigation</h1>
                    {can('navigation_item.add') && (
                        <Link href="/admin/navigation-items/create" className="inline-flex items-center gap-1 rounded border px-2 py-1 bg-primary text-primary-foreground">
                            <Plus className="h-4 w-4" /> Add
                        </Link>
                    )}
                    <form action="/admin/navigation-items" method="get" className="flex items-center gap-2">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search"
                            defaultValue={filters?.search ?? ''}
                            className="w-64 rounded border px-2 py-1"
                        />
                        {filters?.search ? (
                            <Link href="/admin/navigation-items" className="text-xs underline">
                                Reset
                            </Link>
                        ) : null}
                    </form>
                </div>

                <div className="overflow-x-auto rounded-md border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-3 py-2 text-left">Section</th>
                                <th className="px-3 py-2 text-left">Title</th>
                                <th className="px-3 py-2 text-left">Href</th>
                                <th className="px-3 py-2 text-left">Icon</th>
                                <th className="px-3 py-2 text-left">Permission</th>
                                <th className="px-3 py-2 text-left">Sort</th>
                                <th className="px-3 py-2 text-left">Active</th>
                                <th className="px-3 py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.data.map((i: any) => (
                                <tr key={i.id} className="border-t odd:bg-white even:bg-gray-50 dark:odd:bg-zinc-900 dark:even:bg-zinc-800">
                                    <td className="px-3 py-2">{i.section}</td>
                                    <td className="px-3 py-2">{i.title}</td>
                                    <td className="px-3 py-2">{i.href}</td>
                                    <td className="px-3 py-2">{i.icon}</td>
                                    <td className="px-3 py-2">{i.permission}</td>
                                    <td className="px-3 py-2">{i.sort}</td>
                                    <td className="px-3 py-2">{i.is_active ? 'Yes' : 'No'}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2 justify-end">
                                            {can('navigation_item.edit') && (
                                                <Link href={`/admin/navigation-items/${i.id}/edit`} className="inline-flex items-center gap-1 rounded border px-2 py-1">
                                                    <Pencil className="h-4 w-4" /> Edit
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Showing {items.from} to {items.to} of {items.total} items</div>
                    <div className="flex gap-2">
                        {items.links?.map((link: any) => (
                            <Link key={link.url ?? link.label} href={link.url ?? '#'} dangerouslySetInnerHTML={{ __html: link.label }} preserveScroll className={`px-2 py-1 rounded border ${link.active ? 'bg-primary text-primary-foreground' : ''} ${!link.url ? 'pointer-events-none opacity-50' : ''}`} />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
