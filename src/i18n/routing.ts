import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    locales: ['en', 'ta', 'si', 'ar'],
    defaultLocale: 'en',
    // Don't add locale to URL paths
    localePrefix: 'never'
});

// These navigation helpers will work without locale in URL
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
