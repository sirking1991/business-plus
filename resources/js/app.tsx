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
        // Use a relative glob so Vite can find files without relying on alias
        const pkgPages = import.meta.glob('../../packages/businessplus-module-skeleton/resources/js/pages/**/*.tsx');

        const appKey = `./pages/${normalized}.tsx`;
        if (appPages[appKey]) {
            const mod: any = await appPages[appKey]!();
            return mod.default ?? mod;
        }

        const pkgKey = Object.keys(pkgPages).find((k) => k.endsWith(`/${normalized}.tsx`));
        if (pkgKey) {
            const mod: any = await pkgPages[pkgKey]!();
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
