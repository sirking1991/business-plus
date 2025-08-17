import * as Lucide from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Resolve a Lucide icon component from its name string.
 * Returns null if not found or if name is falsy.
 */
export function iconFromName(name?: string | null): LucideIcon | null {
    if (!name) return null;
    const Icon = (Lucide as any)[name];
    return Icon ?? null;
}
