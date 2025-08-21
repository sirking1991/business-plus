import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { type RouteName, route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
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
        setup: ({ App, props }) => {
            /* eslint-disable */
            // @ts-expect-error
            global.route<RouteName> = (name, params, absolute) =>
                route(name, params as any, absolute, {
                    // @ts-expect-error
                    ...page.props.ziggy,
                    // @ts-expect-error
                    location: new URL(page.props.ziggy.location),
                });
            /* eslint-enable */

            return <App {...props} />;
        },
    }),
);
