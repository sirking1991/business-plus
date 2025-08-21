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
import { useCallback, useMemo, useState } from 'react';

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

  // Track selections per guard so we can restore when switching back
  const currentGuard = data.guard_name || 'web';
  const [guardSelections, setGuardSelections] = useState<Record<string, string[]>>({
    [currentGuard]: data.permissions,
  });

  const submit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && role?.id) {
      put(`/admin/roles/${role.id}`);
    } else {
      post('/admin/roles');
    }
  }, [isEdit, role?.id, put, post]);

  // Explicit save handler for header buttons to avoid native form submit refresh
  const handleSave = useCallback(() => {
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
    const nextList = checked
      ? [...data.permissions, permissionName]
      : data.permissions.filter((p) => p !== permissionName);
    setData('permissions', nextList);
    setGuardSelections((prev) => ({ ...prev, [currentGuard]: nextList }));
  }, [data.permissions, setData, currentGuard]);

  const handleGuardChange = useCallback((nextGuard: string) => {
    // Save current selections under current guard
    const saved = { ...guardSelections, [currentGuard]: data.permissions };
    // Restore previously selected for next guard (filtered to allowed)
    const allowed = new Set((permissions || []).filter((p) => (p.guard_name || 'web') === nextGuard).map((p) => p.name));
    const restored = (saved[nextGuard] ?? []).filter((p) => allowed.has(p));
    setGuardSelections(saved);
    setData('guard_name', nextGuard);
    setData('permissions', restored);
  }, [guardSelections, currentGuard, data.permissions, permissions, setData]);

  // Only show permissions for currently selected guard
  const filteredPermissions = useMemo(() => {
    const guard = data.guard_name || 'web';
    return (permissions || []).filter((p) => (p.guard_name || 'web') === guard);
  }, [permissions, data.guard_name]);

  // Group permissions by resource prefix for the selected guard
  const groupedPermissions = useMemo(() => {
    return filteredPermissions.reduce((groups: Record<string, PermissionItem[]>, permission) => {
      const resource = permission.name.split('.')[0];
      if (!groups[resource]) groups[resource] = [];
      groups[resource].push(permission);
      return groups;
    }, {} as Record<string, PermissionItem[]>);
  }, [filteredPermissions]);

  const hasPermissionsItemError = useMemo(() => {
    return Object.keys(errors || {}).some((k) => k.startsWith('permissions.'));
  }, [errors]);

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
                <Button type="button" onClick={handleSave} size="sm" disabled={processing}>
                  <Save className="h-4 w-4" /> {processing ? 'Saving…' : 'Save Changes'}
                </Button>
              )
            : can('role.add') && (
                <Button type="button" onClick={handleSave} size="sm" disabled={processing}>
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
                  onChange={(e) => handleGuardChange(e.target.value)}
                  className="h-11 rounded-lg border px-3"
                >
                  <option value="web">web</option>
                  <option value="api">api</option>
                </select>
                <p className="text-xs text-muted-foreground">Showing permissions for guard: <strong>{data.guard_name || 'web'}</strong></p>
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
                {Object.keys(groupedPermissions).length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No permissions available for guard <strong>{data.guard_name || 'web'}</strong>.
                  </div>
                ) : (
                  Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => {
                    const groupNames = resourcePermissions.map((p) => p.name);
                    const allSelected = groupNames.every((n) => data.permissions.includes(n));
                    const toggleGroup = () => {
                      if (allSelected) {
                        // Unselect all from this group
                        const next = data.permissions.filter((p) => !groupNames.includes(p));
                        setData('permissions', next);
                        setGuardSelections((prev) => ({ ...prev, [currentGuard]: next }));
                      } else {
                        // Select all in this group
                        const merged = Array.from(new Set([...data.permissions, ...groupNames]));
                        setData('permissions', merged);
                        setGuardSelections((prev) => ({ ...prev, [currentGuard]: merged }));
                      }
                    };

                    return (
                      <div key={resource} className="space-y-2">
                        <div className="flex items-center justify-between border-b pb-1">
                          <h4 className="font-medium text-sm text-gray-700 capitalize">
                            {String(resource).replace('_', ' ')}
                          </h4>
                          <Button type="button" variant="outline" size="sm" onClick={toggleGroup}>
                            {allSelected ? 'Unselect All' : 'Select All'}
                          </Button>
                        </div>
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
                    );
                  })
                )}
              </div>
              {(errors.permissions || hasPermissionsItemError) && (
                <p className="text-destructive text-xs mt-2">
                  One or more selected permissions are invalid for the selected guard.
                </p>
              )}
            </div>
          </Form>
        </CardContent>
      </Card>
    </FormPageLayout>
  );
}
