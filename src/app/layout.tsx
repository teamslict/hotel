import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import React from 'react';
import "./globals.css";

export const metadata = {
    title: 'Ceylon Paradise Resort',
    description: 'Experience luxury and comfort',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get locale from cookie/header (no URL prefix)
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <body className="antialiased min-h-screen bg-background font-sans text-foreground">
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
