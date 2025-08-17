import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

// Server-provided navigation item shape
export interface SharedNavItem {
    title: string;
    href: string;
    icon?: string | null; // lucide icon name
}

export interface SharedNavGroup {
    title: string;
    items: SharedNavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    /**
     * Flat list of permission names for the current user, e.g. ["user.browse", "user.add", ...]
     */
    permissions?: string[];
    /**
     * Table-driven navigation grouped by section
     */
    navigation?: SharedNavGroup[];
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
