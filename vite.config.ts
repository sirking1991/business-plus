import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        fs: {
            allow: [
                // Allow dev server to import files from app resources and vendor
                resolve(__dirname, 'resources'),
                resolve(__dirname, 'vendor'),
                // Composer path repository may symlink vendor packages to this local folder during development
                resolve(__dirname, 'packages'),
            ],
        },
    },
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        preserveSymlinks: true,
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
});
