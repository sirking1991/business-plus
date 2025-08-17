import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import useCan from '@/hooks/use-can';

interface PageHeaderProps {
    title: string;
    createUrl?: string;
    createPermission?: string;
    searchUrl: string;
    searchValue?: string;
}

export default function PageHeader({ 
    title, 
    createUrl, 
    createPermission, 
    searchUrl, 
    searchValue 
}: PageHeaderProps) {
    const can = useCan();

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-semibold">{title}</h1>
            {createUrl && createPermission && can(createPermission) && (
                <Link 
                    href={createUrl} 
                    className="inline-flex items-center gap-1 rounded border px-2 py-1 bg-primary text-primary-foreground"
                >
                    <Plus className="h-4 w-4" /> Add
                </Link>
            )}
            <form action={searchUrl} method="get" className="flex items-center gap-2">
                <input
                    type="text"
                    name="search"
                    placeholder="Search"
                    defaultValue={searchValue ?? ''}
                    className="w-64 rounded border px-2 py-1"
                />
                {searchValue && (
                    <Link href={searchUrl} className="text-xs underline">
                        Reset
                    </Link>
                )}
            </form>
        </div>
    );
}
