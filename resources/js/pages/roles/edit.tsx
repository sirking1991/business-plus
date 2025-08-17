import AppLayout from '@/layouts/app-layout';
import { Form, Head, Link, useForm } from '@inertiajs/react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import useCan from '@/hooks/use-can';

export default function RolesEdit({ role, permissions }: { role: any; permissions: any[] }) {
    const can = useCan();
    const { data, setData, put, processing, errors, delete: destroy } = useForm<{
        name: string;
        guard_name: string;
        permissions: string[];
    }>({
        name: role.name ?? '',
        guard_name: role.guard_name ?? 'web',
        permissions: role.permissions ?? [],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/roles/${role.id}`);
    };

    const handleDelete = () => {
        destroy(`/admin/roles/${role.id}`);
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
        <AppLayout breadcrumbs={[ { title: 'Roles', href: '/admin/roles' }, { title: role.name, href: `/admin/roles/${role.id}/edit` }]}>
            <Head title={`Edit ${role.name}`} />

            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Edit Role</h1>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/roles" className="px-2 py-1 text-sm rounded border">Back</Link>
                        {can('role.edit') && (
                            <button onClick={submit} disabled={processing} className="px-2 py-1 text-sm rounded border bg-primary text-primary-foreground cursor-pointer">Save</button>
                        )}
                        {can('role.delete') && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button type="button" className="px-2 py-1 text-sm rounded border inline-flex items-center gap-1 text-red-600 cursor-pointer">
                                        <Trash2 className="h-4 w-4" /> Delete
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Delete Role</DialogTitle>
                                    <DialogDescription>Are you sure you want to delete this role? This action cannot be undone.</DialogDescription>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <button className="px-2 py-1 text-sm rounded border">Cancel</button>
                                        </DialogClose>
                                        <button onClick={handleDelete} className="px-2 py-1 text-sm rounded border bg-red-600 text-white cursor-pointer">Delete</button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </div>

                <Form onSubmit={submit} className="space-y-6 max-w-2xl">
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm">Name</label>
                            <input 
                                value={data.name} 
                                onChange={(e) => setData('name', e.target.value)} 
                                className="w-full rounded border px-2 py-1" 
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
                </Form>
            </div>
        </AppLayout>
    );
}
