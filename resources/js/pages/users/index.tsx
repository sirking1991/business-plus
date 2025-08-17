import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Pencil } from 'lucide-react';
import useCan from '@/hooks/use-can';

export default function UsersIndex({ users, filters }: { users: any; filters?: any }) {
    const can = useCan();
    const page = usePage();

    return (
        <AppLayout breadcrumbs={[{ title: 'Administration', href: '/admin' }, { title: 'Users', href: '/admin/users' }]}>
            <Head title="Users" />

            <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-semibold">Users</h1>
                    {can('user.add') && (
                        <Link href="/admin/users/create" className="inline-flex items-center gap-1 rounded border px-2 py-1 bg-primary text-primary-foreground">
                            <Plus className="h-4 w-4" /> Add
                        </Link>
                    )}
                    <form action="/admin/users" method="get" className="flex items-center gap-2">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search"
                            defaultValue={filters?.search ?? ''}
                            className="w-64 rounded border px-2 py-1"
                        />
                        {filters?.search ? (
                            <Link href="/admin/users" className="text-xs underline">
                                Reset
                            </Link>
                        ) : null}
                    </form>
                </div>

                <div className="overflow-x-auto rounded-md border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-3 py-2 text-left">Name</th>
                                <th className="px-3 py-2 text-left">Email</th>
                                <th className="px-3 py-2 text-left">Created</th>
                                <th className="px-3 py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((u: any) => (
                                <tr key={u.id} className="border-t odd:bg-white even:bg-gray-50 dark:odd:bg-zinc-900 dark:even:bg-zinc-800">
                                    <td className="px-3 py-2">{u.name}</td>
                                    <td className="px-3 py-2">{u.email}</td>
                                    <td className="px-3 py-2">{u.created_at}</td>
                                    <td className="px-3 py-2">
                                        <div className="flex items-center gap-2 justify-end">
                                            {can('user.edit') && (
                                                <Link href={`/admin/users/${u.id}/edit`} className="inline-flex items-center gap-1 rounded border px-2 py-1">
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
                    <div className="text-xs text-muted-foreground">Showing {users.from} to {users.to} of {users.total} users</div>
                    <div className="flex gap-2">
                        {users.links?.map((link: any) => (
                            <Link key={link.url ?? link.label} href={link.url ?? '#'} dangerouslySetInnerHTML={{ __html: link.label }} preserveScroll className={`px-2 py-1 rounded border ${link.active ? 'bg-primary text-primary-foreground' : ''} ${!link.url ? 'pointer-events-none opacity-50' : ''}`} />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
