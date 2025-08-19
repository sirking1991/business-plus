import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export function NavMain({ items = [], title = 'Platform' }: { items: NavItem[]; title?: string }) {
    const page = usePage();
    const storageKey = `nav_group_open_${title}`;
    const [open, setOpen] = useState<boolean>(true);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved !== null) setOpen(saved === 'true');
        } catch {}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey]);

     const handleOpenChange = (value: boolean) => {
         setOpen(value);
         try {
             localStorage.setItem(storageKey, String(value));
         } catch {}
     };

     return (
         <Collapsible open={open} onOpenChange={handleOpenChange}>
             <SidebarGroup className="px-2 py-0">
                <SidebarGroupLabel asChild>
                    <CollapsibleTrigger aria-label={`Toggle ${title}`} className="flex w-full items-center">
                        <span className="truncate">{title}</span>
                        <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${open ? 'rotate-0' : '-rotate-90'}`} />
                    </CollapsibleTrigger>
                </SidebarGroupLabel>

                 <CollapsibleContent>
                     <SidebarMenu>
                         {items.map((item) => (
                             <SidebarMenuItem key={item.title}>
                                 <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                                     <Link href={item.href} prefetch>
                                         {item.icon && <item.icon />}
                                         <span>{item.title}</span>
                                     </Link>
                                 </SidebarMenuButton>
                             </SidebarMenuItem>
                         ))}
                     </SidebarMenu>
                 </CollapsibleContent>
             </SidebarGroup>
         </Collapsible>
     );
 }
