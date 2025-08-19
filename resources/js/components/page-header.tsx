import { Link } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import useCan from '@/hooks/use-can';
import { Button } from '@/components/ui/button';

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
            <form action={searchUrl} method="get" className="justify-self-center w-full md:w-auto">
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search"
                        defaultValue={searchValue ?? ''}
                        className="w-full rounded border py-1 pl-2 pr-8 text-center placeholder:text-center"
                    />
                    {searchValue && (
                        <button
                            type="button"
                            aria-label="Clear search"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                            onClick={() => { window.location.href = searchUrl; }}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </form>

            {/* Right: Add */}
            {createUrl && createPermission && can(createPermission) && (
                <Button asChild size="sm" className="justify-self-end">
                    <Link href={createUrl}>
                        <Plus className="h-4 w-4" /> Add
                    </Link>
                </Button>
            )}
        </div>
    );
}
