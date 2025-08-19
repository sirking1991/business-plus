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
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3">
            {/* Left: Title */}
            <h1 className="text-xl font-semibold justify-self-start">{title}</h1>

            {/* Center: Search */}
            <form action={searchUrl} method="get" className="flex items-center gap-2 justify-self-center w-full md:w-auto">
                <input
                    type="text"
                    name="search"
                    placeholder="Search"
                    defaultValue={searchValue ?? ''}
                    className="w-full md:w-80 rounded border px-2 py-1 text-center placeholder:text-center"
                />
                {searchValue && (
                    <Link href={searchUrl} className="text-xs underline">
                        Reset
                    </Link>
                )}
            </form>

            {/* Right: Add */}
            {createUrl && createPermission && can(createPermission) && (
                <Link 
                    href={createUrl} 
                    className="inline-flex items-center gap-1 rounded border px-2 py-1 bg-primary text-primary-foreground justify-self-end"
                >
                    <Plus className="h-4 w-4" /> Add
                </Link>
            )}
        </div>
    );
}
