import { Link } from '@inertiajs/react';
import useCan from '@/hooks/use-can';

export interface TableColumn {
    key: string;
    label: string;
    render?: (value: any, item: any) => React.ReactNode;
}

export interface TableAction {
    label: string;
    icon?: React.ReactNode;
    href: (item: any) => string;
    permission?: string;
    className?: string;
}

interface DataTableProps {
    columns: TableColumn[];
    data: any[];
    actions?: TableAction[];
}

export default function DataTable({ columns, data, actions = [] }: DataTableProps) {
    const can = useCan();

    return (
        <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full text-sm">
                <thead className="bg-muted/50">
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key} className="px-3 py-2 text-left">
                                {column.label}
                            </th>
                        ))}
                        {actions.length > 0 && (
                            <th className="px-3 py-2 text-right">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr 
                            key={item.id} 
                            className="border-t odd:bg-white even:bg-gray-50 dark:odd:bg-zinc-900 dark:even:bg-zinc-800"
                        >
                            {columns.map((column) => (
                                <td key={column.key} className="px-3 py-2">
                                    {column.render 
                                        ? column.render(item[column.key], item)
                                        : item[column.key]
                                    }
                                </td>
                            ))}
                            {actions.length > 0 && (
                                <td className="px-3 py-2">
                                    <div className="flex items-center gap-2 justify-end">
                                        {actions.map((action, index) => {
                                            if (action.permission && !can(action.permission)) {
                                                return null;
                                            }
                                            return (
                                                <Link
                                                    key={index}
                                                    href={action.href(item)}
                                                    className={action.className || "inline-flex items-center gap-1 rounded-md border px-3 py-1.5 cursor-pointer"}
                                                >
                                                    {action.icon} {action.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
