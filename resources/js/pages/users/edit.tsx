import AppLayout from '@/layouts/app-layout';
import { Form, Head, Link, useForm } from '@inertiajs/react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import useCan from '@/hooks/use-can';

export default function UsersEdit({ user }: { user: any }) {
    const can = useCan();
    const { data, setData, put, processing, errors, delete: destroy } = useForm<{
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
    }>({
        name: user.name ?? '',
        email: user.email ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    const handleDelete = () => {
        destroy(`/admin/users/${user.id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Administration', href: '/admin' }, { title: 'Users', href: '/admin/users' }, { title: user.name, href: `/admin/users/${user.id}/edit` }]}>
            <Head title={`Edit ${user.name}`} />

            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Edit User</h1>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/users" className="px-2 py-1 text-sm rounded border">Back</Link>
                        {can('user.edit') && (
                            <button onClick={submit} disabled={processing} className="px-2 py-1 text-sm rounded border bg-primary text-primary-foreground cursor-pointer">Save</button>
                        )}
                        {can('user.delete') && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button type="button" className="px-2 py-1 text-sm rounded border inline-flex items-center gap-1 text-red-600 cursor-pointer">
                                        <Trash2 className="h-4 w-4" /> Delete
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Delete User</DialogTitle>
                                    <DialogDescription>Are you sure you want to delete this user? This action cannot be undone.</DialogDescription>
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

                <Form onSubmit={submit} className="space-y-3 max-w-xl">
                    <div>
                        <label className="block text-sm">Name</label>
                        <input value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full rounded border px-2 py-1" />
                        {errors.name && <div className="text-red-600 text-xs">{errors.name}</div>}
                    </div>
                    <div>
                        <label className="block text-sm">Email</label>
                        <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full rounded border px-2 py-1" />
                        {errors.email && <div className="text-red-600 text-xs">{errors.email}</div>}
                    </div>
                    <div>
                        <label className="block text-sm">Password (leave blank to keep current)</label>
                        <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="w-full rounded border px-2 py-1" />
                        {errors.password && <div className="text-red-600 text-xs">{errors.password}</div>}
                    </div>
                    <div>
                        <label className="block text-sm">Confirm Password</label>
                        <input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="w-full rounded border px-2 py-1" />
                        {errors.password_confirmation && <div className="text-red-600 text-xs">{errors.password_confirmation}</div>}
                    </div>
                </Form>
            </div>
        </AppLayout>
    );
}
