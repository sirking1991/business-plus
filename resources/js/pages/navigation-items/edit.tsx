import AppLayout from '@/layouts/app-layout';
import { Form, Head, Link, useForm } from '@inertiajs/react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import useCan from '@/hooks/use-can';

export default function NavigationItemsEdit({ item }: { item: any }) {
    const can = useCan();
    const { data, setData, put, processing, errors, delete: destroy } = useForm<{
        section: string;
        title: string;
        href: string;
        icon: string;
        permission: string;
        sort: number;
        is_active: boolean;
    }>({
        section: item.section ?? '',
        title: item.title ?? '',
        href: item.href ?? '',
        icon: item.icon ?? '',
        permission: item.permission ?? '',
        sort: item.sort ?? 0,
        is_active: !!item.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/navigation-items/${item.id}`);
    };

    const handleDelete = () => {
        destroy(`/admin/navigation-items/${item.id}`);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Navigation', href: '/admin/navigation-items' }, { title: item.title, href: `/admin/navigation-items/${item.id}/edit` }]}>
            <Head title={`Edit ${item.title}`} />

            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Edit Navigation Item</h1>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/navigation-items" className="px-2 py-1 text-sm rounded border">Back</Link>
                        {can('navigation_item.edit') && (
                            <button onClick={submit} disabled={processing} className="px-2 py-1 text-sm rounded border bg-primary text-primary-foreground cursor-pointer">Save</button>
                        )}
                        {can('navigation_item.delete') && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button type="button" className="px-2 py-1 text-sm rounded border inline-flex items-center gap-1 text-red-600 cursor-pointer">
                                        <Trash2 className="h-4 w-4" /> Delete
                                    </button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Delete Navigation Item</DialogTitle>
                                    <DialogDescription>Are you sure you want to delete this item? This action cannot be undone.</DialogDescription>
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
                </Form>
            </div>
        </AppLayout>
    );
}
