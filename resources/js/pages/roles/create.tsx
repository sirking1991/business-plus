import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import useCan from '@/hooks/use-can';

export default function RolesCreate({ permissions }: { permissions: any[] }) {
    const can = useCan();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        guard_name: 'web',
        permissions: [] as string[],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/roles');
    };

    const handlePermissionChange = (permissionName: string, checked: boolean) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            setData('permissions', data.permissions.filter(p => p !== permissionName));
        }
    };

    // Group permissions by resource
    const groupedPermissions = permissions.reduce((groups: Record<string, any[]>, permission) => {
        const resource = permission.name.split('.')[0];
        if (!groups[resource]) {
            groups[resource] = [];
        }
        groups[resource].push(permission);
        return groups;
    }, {});

    return (
        <AppLayout breadcrumbs={[{ title: 'Roles', href: '/admin/roles' }, { title: 'Create', href: '/admin/roles/create' }]}>
            <Head title="Create Role" />

            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Create Role</h1>
                    <div className="flex items-center gap-2">
                        <button onClick={() => history.back()} className="px-2 py-1 text-sm rounded border">Back</button>
                        {can('role.add') && (
                            <button onClick={submit} disabled={processing} className="px-2 py-1 text-sm rounded border bg-primary text-primary-foreground">Save</button>
                        )}
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6 max-w-2xl">
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm">Name</label>
                            <input 
                                value={data.name} 
                                onChange={(e) => setData('name', e.target.value)} 
                                className="w-full rounded border px-2 py-1" 
                                placeholder="Enter role name"
                            />
                            {errors.name && <div className="text-red-600 text-xs">{errors.name}</div>}
                        </div>
                        <div>
                            <label className="block text-sm">Guard Name</label>
                            <select 
                                value={data.guard_name} 
                                onChange={(e) => setData('guard_name', e.target.value)} 
                                className="w-full rounded border px-2 py-1"
                            >
                                <option value="web">web</option>
                                <option value="api">api</option>
                            </select>
                            {errors.guard_name && <div className="text-red-600 text-xs">{errors.guard_name}</div>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm mb-3">Permissions</label>
                        <div className="border rounded p-4 max-h-96 overflow-y-auto space-y-4">
                            {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                                <div key={resource} className="space-y-2">
                                    <h4 className="font-medium text-sm text-gray-700 capitalize border-b pb-1">
                                        {resource.replace('_', ' ')}
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pl-2">
                                        {resourcePermissions.map((permission) => (
                                            <label key={permission.id} className="flex items-center space-x-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={data.permissions.includes(permission.name)}
                                                    onChange={(e) => handlePermissionChange(permission.name, e.target.checked)}
                                                    className="rounded"
                                                />
                                                <span className="text-gray-600">{permission.name.split('.')[1]}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.permissions && <div className="text-red-600 text-xs">{errors.permissions}</div>}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
