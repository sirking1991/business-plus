import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: async (name) => {
        const normalized = name.replace(/^pkg-pages\//, '');
        const appPages = import.meta.glob('./pages/**/*.tsx');
        // Load pages from installed vendor packages (supports resource or resources folder)
        const vendorPages = import.meta.glob('../../vendor/bizwerks/*/{resource,resources}/js/pages/**/*.tsx');
        // Also support local path-repo packages during development
        const localPkgPages = import.meta.glob('../../packages/*/{resource,resources}/js/pages/**/*.tsx');

        // Try exact app page match first
        const appKeyExact = `./pages/${normalized}.tsx`;
        if (appPages[appKeyExact]) {
            const mod: any = await appPages[appKeyExact]!();
            return mod.default ?? mod;
        }
        // Fall back to case-insensitive match for app pages
        const appKeyCi = Object.keys(appPages).find((k) => k.toLowerCase().endsWith(`/${normalized}.tsx`.toLowerCase()));
        if (appKeyCi) {
            const mod: any = await appPages[appKeyCi]!();
            return mod.default ?? mod;
        }

        const pkgPages = { ...vendorPages, ...localPkgPages } as Record<string, () => Promise<any>>;
        // Try case-insensitive match for package pages
        const pkgKeyCi = Object.keys(pkgPages).find((k) => k.toLowerCase().endsWith(`/${normalized}.tsx`.toLowerCase()));
        if (pkgKeyCi) {
            const mod: any = await pkgPages[pkgKeyCi]!();
            return mod.default ?? mod;
        }

        throw new Error(`Page not found: ${normalized}`);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
