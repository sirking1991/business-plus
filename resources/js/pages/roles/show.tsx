import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import useCan from '@/hooks/use-can';

export default function RolesShow({ role }: { role: any }) {
    const can = useCan();

    return (
        <AppLayout breadcrumbs={[{ title: 'Roles', href: '/admin/roles' }, { title: role.name, href: `/admin/roles/${role.id}` }]}>
            <Head title={`Role: ${role.name}`} />

            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Role Details</h1>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/roles" className="px-2 py-1 text-sm rounded border">Back</Link>
                        {can('role.edit') && (
                            <Link href={`/admin/roles/${role.id}/edit`} className="px-2 py-1 text-sm rounded border bg-primary text-primary-foreground">Edit</Link>
                        )}
                    </div>
                </div>

                <div className="max-w-2xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <div className="mt-1 text-sm text-gray-900">{role.name}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Guard Name</label>
                            <div className="mt-1 text-sm text-gray-900">{role.guard_name}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Created At</label>
                            <div className="mt-1 text-sm text-gray-900">{role.created_at}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Updated At</label>
                            <div className="mt-1 text-sm text-gray-900">{role.updated_at}</div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Permissions ({role.permissions?.length || 0})</label>
                        <div className="flex flex-wrap gap-2">
                            {role.permissions && role.permissions.length > 0 ? (
                                role.permissions.map((permission: any) => (
                                    <Badge key={permission.id} variant="secondary">
                                        {permission.name}
                                    </Badge>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500 italic">No permissions assigned</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
