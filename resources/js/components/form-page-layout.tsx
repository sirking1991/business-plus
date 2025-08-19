import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import React from 'react';

interface FormPageLayoutProps {
    title: string;
    breadcrumbs: Array<{ title: string; href: string }>;
    headTitle?: string;
    subtitle?: string;
    rightActions?: React.ReactNode;
    children: React.ReactNode;
}

export default function FormPageLayout({
    title,
    breadcrumbs,
    headTitle,
    subtitle,
    rightActions,
    children,
}: FormPageLayoutProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={headTitle || title} />

            <div className="w-full mx-auto p-4">
                {/* Sticky Action Bar */}
                <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-background/80 supports-[backdrop-filter]:backdrop-blur">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
                            {subtitle && (
                                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {rightActions}
                        </div>
                    </div>
                </div>

                {children}
            </div>
        </AppLayout>
    );
}
