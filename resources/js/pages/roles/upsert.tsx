import FormPageLayout from '@/components/form-page-layout';
import { Form, useForm, router } from '@inertiajs/react';
import useCan from '@/hooks/use-can';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useCallback, useMemo } from 'react';

 type RoleData = {
  id?: number | string;
  name?: string;
  guard_name?: string;
  permissions?: string[];
};

 type PermissionItem = { id: number | string; name: string; guard_name?: string };

 export default function RolesUpsert({ role, permissions }: { role?: RoleData; permissions: PermissionItem[] }) {
  const can = useCan();
  const isEdit = Boolean(role && role.id);

  const { data, setData, post, put, processing, errors, delete: destroy } = useForm<{
    name: string;
    guard_name: string;
    permissions: string[];
  }>({
    name: isEdit ? role?.name ?? '' : '',
    guard_name: isEdit ? role?.guard_name ?? 'web' : 'web',
    permissions: isEdit ? role?.permissions ?? [] : [],
  });

  const submit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && role?.id) {
      put(`/admin/roles/${role.id}`);
    } else {
      post('/admin/roles');
    }
  }, [isEdit, role?.id, put, post]);

  const handleDelete = useCallback(() => {
    if (isEdit && role?.id) {
      destroy(`/admin/roles/${role.id}`);
    }
  }, [isEdit, role?.id, destroy]);

  const handlePermissionChange = useCallback((permissionName: string, checked: boolean) => {
    if (checked) {
      setData('permissions', [...data.permissions, permissionName]);
    } else {
      setData('permissions', data.permissions.filter((p) => p !== permissionName));
    }
  }, [data.permissions, setData]);

  // Group permissions by resource prefix
  const groupedPermissions = useMemo(() => {
    return (permissions || []).reduce((groups: Record<string, PermissionItem[]>, permission) => {
      const resource = permission.name.split('.')[0];
      if (!groups[resource]) groups[resource] = [];
      groups[resource].push(permission);
      return groups;
    }, {} as Record<string, PermissionItem[]>);
  }, [permissions]);

  return (
    <FormPageLayout
      title={isEdit ? 'Edit Role' : 'Create Role'}
      headTitle={isEdit ? `Edit ${role?.name}` : 'Create Role'}
      breadcrumbs={
        isEdit && role?.id
          ? [
              { title: 'Roles', href: '/admin/roles' },
              { title: role?.name ?? 'Edit', href: `/admin/roles/${role?.id}/edit` },
            ]
          : [
              { title: 'Roles', href: '/admin/roles' },
              { title: 'Create', href: '/admin/roles/create' },
            ]
      }
      subtitle={isEdit ? 'Update role details and permissions' : 'Define role name, guard and permissions'}
      rightActions={
        <>
          <Button type="button" variant="outline" size="sm" onClick={() => router.visit('/admin/roles')}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          {isEdit
            ? can('role.edit') && (
                <Button type="submit" form="role-edit-form" size="sm" disabled={processing}>
                  <Save className="h-4 w-4" /> {processing ? 'Saving…' : 'Save Changes'}
                </Button>
              )
            : can('role.add') && (
                <Button type="submit" form="role-create-form" size="sm" disabled={processing}>
                  <Save className="h-4 w-4" /> {processing ? 'Saving…' : 'Save'}
                </Button>
              )}

          {isEdit && can('role.delete') && (
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
          <Form id={isEdit ? 'role-edit-form' : 'role-create-form'} onSubmit={submit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Enter role name"
                  aria-invalid={!!errors.name}
                  className="h-11 rounded-lg"
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="guard_name" className="block">Guard Name</Label>
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
                      {resourcePermissions.map((permission: PermissionItem) => {
                        const id = `perm-${permission.id}`;
                        const checked = data.permissions.includes(permission.name);
                        return (
                          <div key={permission.id} className="flex items-center gap-3 rounded-lg border border-input p-3 hover:bg-accent">
                            <Checkbox
                              id={id}
                              checked={checked}
                              onCheckedChange={(state) => {
                                const isChecked = Boolean(state);
                                handlePermissionChange(permission.name, isChecked);
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
              {errors.permissions && <p className="text-destructive text-xs mt-2">{errors.permissions as any}</p>}
            </div>
          </Form>
        </CardContent>
      </Card>
    </FormPageLayout>
  );
}
