import { Link } from '@inertiajs/react';

interface PaginationProps {
    data: {
        from: number;
        to: number;
        total: number;
        links?: Array<{
            url?: string;
            label: string;
            active: boolean;
        }>;
    };
    itemName?: string;
}

export default function Pagination({ data, itemName = 'items' }: PaginationProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
                Showing {data.from} to {data.to} of {data.total} {itemName}
            </div>
            <div className="flex gap-2">
                {data.links?.map((link, idx) => (
                    <Link
                        key={idx}
                        href={link.url ?? '#'}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        preserveScroll
                        className={`px-3 py-1.5 rounded-md border cursor-pointer ${
                            link.active ? 'bg-primary text-primary-foreground' : ''
                        } ${!link.url ? 'pointer-events-none opacity-50 cursor-default' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
}
