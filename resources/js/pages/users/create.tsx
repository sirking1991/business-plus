import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import useCan from '@/hooks/use-can';

export default function UsersCreate() {
    const can = useCan();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Users', href: '/admin/users' }, { title: 'Create', href: '/admin/users/create' }]}>
            <Head title="Create User" />

            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Create User</h1>
                    <div className="flex items-center gap-2">
                        <button onClick={() => history.back()} className="px-2 py-1 text-sm rounded border">Back</button>
                        {can('user.add') && (
                            <button onClick={submit} disabled={processing} className="px-2 py-1 text-sm rounded border bg-primary text-primary-foreground">Save</button>
                        )}
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-3 max-w-xl">
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
                        <label className="block text-sm">Password</label>
                        <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="w-full rounded border px-2 py-1" />
                        {errors.password && <div className="text-red-600 text-xs">{errors.password}</div>}
                    </div>
                    <div>
                        <label className="block text-sm">Confirm Password</label>
                        <input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="w-full rounded border px-2 py-1" />
                        {errors.password_confirmation && <div className="text-red-600 text-xs">{errors.password_confirmation}</div>}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
