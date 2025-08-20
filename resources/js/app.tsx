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

        const appKey = `./pages/${normalized}.tsx`;
        if (appPages[appKey]) {
            const mod: any = await appPages[appKey]!();
            return mod.default ?? mod;
        }

        const vendorKey = Object.keys(vendorPages).find((k) => k.endsWith(`/${normalized}.tsx`));
        if (vendorKey) {
            const mod: any = await vendorPages[vendorKey]!();
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
