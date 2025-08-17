import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';

/**
 * useCan returns a predicate that checks if the current user has a given permission name.
 * Example: can('user.browse') or can(['user.add', 'user.edit'])
 */
export default function useCan() {
    const { permissions, auth } = usePage<{ permissions?: string[]; auth?: { user?: { is_admin?: boolean } } }>().props as any;

    const permissionSet = useMemo(() => new Set<string>(permissions ?? []), [permissions]);

    const can = (perm: string | string[]): boolean => {
        // Admins can do anything
        if (auth?.user?.is_admin) return true;

        if (Array.isArray(perm)) {
            return perm.some((p) => permissionSet.has(p));
        }
        return permissionSet.has(perm);
    };

    return can;
}
