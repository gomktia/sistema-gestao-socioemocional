import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
    title: 'Gestao Socioemocional',
    description: 'Sistema de Gestao Socioemocional - RTI + VIA',
};

import { Toaster } from 'sonner';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body className={`${plusJakarta.variable} font-sans`} suppressHydrationWarning>
                {children}
                <Toaster position="top-right" richColors />
            </body>
        </html>
    );
}
