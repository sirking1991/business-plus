import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import useCan from '@/hooks/use-can';

export default function NavigationItemsCreate() {
    const can = useCan();
    const { data, setData, post, processing, errors } = useForm({
        section: '',
        title: '',
        href: '',
        icon: '',
        permission: '',
        sort: 0,
        is_active: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/navigation-items');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Administration', href: '/admin' }, { title: 'Navigation', href: '/admin/navigation-items' }, { title: 'Create', href: '/admin/navigation-items/create' }]}>
            <Head title="Create Navigation Item" />

            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Create Navigation Item</h1>
                    <div className="flex items-center gap-2">
                        <button onClick={() => history.back()} className="px-2 py-1 text-sm rounded border">Back</button>
                        {can('navigation_item.add') && (
                            <button onClick={submit} disabled={processing} className="px-2 py-1 text-sm rounded border bg-primary text-primary-foreground">Save</button>
                        )}
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-3 max-w-xl">
                    <div>
                        <label className="block text-sm">Section</label>
                        <input value={data.section} onChange={(e) => setData('section', e.target.value)} className="w-full rounded border px-2 py-1" />
                        {errors.section && <div className="text-red-600 text-xs">{errors.section}</div>}
                    </div>
                    <div>
                        <label className="block text-sm">Title</label>
                        <input value={data.title} onChange={(e) => setData('title', e.target.value)} className="w-full rounded border px-2 py-1" />
                        {errors.title && <div className="text-red-600 text-xs">{errors.title}</div>}
                    </div>
                    <div>
                        <label className="block text-sm">Href</label>
                        <input value={data.href} onChange={(e) => setData('href', e.target.value)} className="w-full rounded border px-2 py-1" />
                        {errors.href && <div className="text-red-600 text-xs">{errors.href}</div>}
                    </div>
                    <div>
                        <label className="block text-sm">Icon (Lucide name)</label>
                        <input value={data.icon} onChange={(e) => setData('icon', e.target.value)} className="w-full rounded border px-2 py-1" />
                        {errors.icon && <div className="text-red-600 text-xs">{errors.icon}</div>}
                    </div>
                    <div>
                        <label className="block text-sm">Permission (optional)</label>
                        <input value={data.permission} onChange={(e) => setData('permission', e.target.value)} className="w-full rounded border px-2 py-1" placeholder="e.g. navigation_item.browse" />
                        {errors.permission && <div className="text-red-600 text-xs">{errors.permission}</div>}
                    </div>
                    <div>
                        <label className="block text-sm">Sort</label>
                        <input type="number" value={data.sort} onChange={(e) => setData('sort', Number(e.target.value))} className="w-full rounded border px-2 py-1" />
                        {errors.sort && <div className="text-red-600 text-xs">{errors.sort}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                        <input id="is_active" type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />
                        <label htmlFor="is_active" className="text-sm">Active</label>
                        {errors.is_active && <div className="text-red-600 text-xs">{errors.is_active}</div>}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
