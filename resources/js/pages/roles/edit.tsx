import FormPageLayout from '@/components/form-page-layout';
import { Form, useForm } from '@inertiajs/react';
import useCan from '@/hooks/use-can';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Trash2, ArrowLeft, Save } from 'lucide-react';

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
        <FormPageLayout
            title="Edit Role"
            headTitle={`Edit ${role.name}`}
            breadcrumbs={[ { title: 'Roles', href: '/admin/roles' }, { title: role.name, href: `/admin/roles/${role.id}/edit` }]}
            subtitle="Update role details and permissions"
            rightActions={
                <>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = '/admin/roles'}
                    >
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    {can('role.edit') && (
                        <Button
                            type="button"
                            size="sm"
                            disabled={processing}
                            onClick={() => put(`/admin/roles/${role.id}`)}
                        >
                            <Save className="h-4 w-4" /> {processing ? 'Saving…' : 'Save Changes'}
                        </Button>
                    )}
                    {can('role.delete') && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button type="button" variant="outline" size="sm" className="text-destructive border-destructive/50 hover:bg-destructive/5">
                                    <Trash2 className="h-4 w-4" /> Delete
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Delete Role</DialogTitle>
                                <DialogDescription>Are you sure you want to delete this role? This action cannot be undone.</DialogDescription>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </>
            }
        >
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Role Details</CardTitle>
                    <CardDescription>Basic information and permission settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form onSubmit={submit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    aria-invalid={!!errors.name}
                                    className="h-11 rounded-lg"
                                />
                                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="guard_name">Guard Name</Label>
                                <select
                                    id="guard_name"
                                    value={data.guard_name}
                                    onChange={(e) => setData('guard_name', e.target.value)}
                                    className="h-11 rounded-lg border px-3"
                                >
                                    <option value="web">web</option>
                                    <option value="api">api</option>
                                </select>
                                {errors.guard_name && <p className="text-destructive text-xs mt-1">{errors.guard_name}</p>}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div>
                                <Label className="mb-3 block">Permissions</Label>
                                <p className="text-sm text-muted-foreground">Select the permissions for this role</p>
                            </div>
                            <div className="border rounded p-4 max-h-96 overflow-y-auto space-y-4">
                                {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                                    <div key={resource} className="space-y-2">
                                        <h4 className="font-medium text-sm text-gray-700 capitalize border-b pb-1">
                                            {String(resource).replace('_', ' ')}
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-2">
                                            {resourcePermissions.map((permission: any) => {
                                                const id = `perm-${permission.id}`;
                                                const checked = data.permissions.includes(permission.name);
                                                return (
                                                    <div key={permission.id} className="flex items-center gap-3 rounded-lg border border-input p-3 hover:bg-accent">
                                                        <Checkbox
                                                            id={id}
                                                            checked={checked}
                                                            onCheckedChange={(state) => {
                                                                const isChecked = Boolean(state);
                                                                if (isChecked && !checked) {
                                                                    setData('permissions', [...data.permissions, permission.name]);
                                                                } else if (!isChecked && checked) {
                                                                    setData('permissions', data.permissions.filter((p) => p !== permission.name));
                                                                }
                                                            }}
                                                        />
                                                        <Label htmlFor={id} className="capitalize cursor-pointer">
                                                            {permission.name.split('.')[1]}
                                                        </Label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.permissions && <p className="text-destructive text-xs mt-2">{errors.permissions}</p>}
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </FormPageLayout>
    );
}
