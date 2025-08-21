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
import { useCallback } from 'react';

 type User = {
  id?: number | string;
  name?: string;
  email?: string;
  roles?: string[];
};

 type Role = { id: number | string; name: string };

 export default function UsersUpsert({ user, roles }: { user?: User; roles?: Role[] }) {
  const can = useCan();
  const isEdit = Boolean(user && user.id);

  const { data, setData, post, put, processing, errors, delete: destroy } = useForm<{
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    roles: string[];
  }>({
    name: isEdit ? user?.name ?? '' : '',
    email: isEdit ? user?.email ?? '' : '',
    password: '',
    password_confirmation: '',
    roles: isEdit ? user?.roles ?? [] : [],
  });

  const submit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && user?.id) {
      put(`/admin/users/${user.id}`);
    } else {
      post('/admin/users');
    }
  }, [isEdit, user?.id, put, post]);

  const handleDelete = useCallback(() => {
    if (isEdit && user?.id) {
      destroy(`/admin/users/${user.id}`);
    }
  }, [isEdit, user?.id, destroy]);

  return (
    <FormPageLayout
      title={isEdit ? 'Edit User' : 'Create User'}
      headTitle={isEdit ? `Edit ${user?.name}` : 'Create User'}
      breadcrumbs={
        isEdit && user?.id
          ? [
              { title: 'Users', href: '/admin/users' },
              { title: user?.name ?? 'Edit', href: `/admin/users/${user?.id}/edit` },
            ]
          : [
              { title: 'Users', href: '/admin/users' },
              { title: 'Create', href: '/admin/users/create' },
            ]
      }
      subtitle={isEdit ? 'Update user information and permissions' : 'Add user information and set credentials'}
      rightActions={
        <>
          <Button type="button" variant="outline" size="sm" onClick={() => router.visit('/admin/users')}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          {isEdit
            ? can('user.edit') && (
                <Button type="submit" form="user-edit-form" size="sm" disabled={processing}>
                  <Save className="h-4 w-4" /> {processing ? 'Saving…' : 'Save Changes'}
                </Button>
              )
            : can('user.add') && (
                <Button type="submit" form="user-create-form" size="sm" disabled={processing}>
                  <Save className="h-4 w-4" /> {processing ? 'Saving…' : 'Save'}
                </Button>
              )}

          {isEdit && can('user.delete') && (
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="text-destructive border-destructive/50 hover:bg-destructive/5">
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Delete User</DialogTitle>
                <DialogDescription>Are you sure you want to delete this user? This action cannot be undone.</DialogDescription>
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
          <CardTitle className="text-xl">User Details</CardTitle>
          <CardDescription>Basic information and account settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Form id={isEdit ? 'user-edit-form' : 'user-create-form'} onSubmit={submit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Enter full name"
                  aria-invalid={!!errors.name}
                  className="h-11 rounded-lg"
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="Enter email address"
                  aria-invalid={!!errors.email}
                  className="h-11 rounded-lg"
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">{isEdit ? 'New Password' : 'Password'}</Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder={isEdit ? 'Leave blank to keep current password' : 'Enter password'}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  className="h-11 rounded-lg"
                />
                {isEdit && <p className="text-xs text-muted-foreground">Leave blank to keep the current password</p>}
                {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">{isEdit ? 'Confirm New Password' : 'Confirm Password'}</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  placeholder={isEdit ? 'Confirm new password' : 'Confirm password'}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password_confirmation}
                  className="h-11 rounded-lg"
                />
                {errors.password_confirmation && (
                  <p className="text-destructive text-xs mt-1">{errors.password_confirmation}</p>
                )}
              </div>
            </div>

            {isEdit && roles && (
              <>
                <Separator />
                {/* Roles Section */}
                <div className="space-y-4">
                  <div>
                    <Label className="mb-3 block">User Roles & Permissions</Label>
                    <p className="text-sm text-muted-foreground">
                      Select the roles that define this user's access level and permissions
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {roles.map((role) => {
                      const id = `role-${role.id}`;
                      const checked = data.roles.includes(role.name);
                      return (
                        <div key={role.id} className="flex items-center gap-3 rounded-lg border border-input p-3 hover:bg-accent">
                          <Checkbox
                            id={id}
                            checked={checked}
                            onCheckedChange={(state) => {
                              const isChecked = Boolean(state);
                              if (isChecked && !checked) {
                                setData('roles', [...data.roles, role.name]);
                              } else if (!isChecked && checked) {
                                setData('roles', data.roles.filter((r) => r !== role.name));
                              }
                            }}
                          />
                          <Label htmlFor={id} className="capitalize cursor-pointer">
                            {role.name}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                  {errors.roles && <p className="text-destructive text-xs mt-2">{errors.roles as any}</p>}
                </div>
              </>
            )}
          </Form>
        </CardContent>
      </Card>
    </FormPageLayout>
  );
}
