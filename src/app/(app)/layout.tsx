'use client';

import { ReactNode } from 'react';
import { Navbar } from '@/components/navbar';

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
                {children}
            </main>
        </div>
    );
}
