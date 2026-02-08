"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function Footer({ tenantId }: { tenantId: string }) {
    const t = useTranslations("footer");

    return (
        <footer className="bg-zinc-900 text-white py-12 md:py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-serif font-bold">Ceylon Paradise</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Experience the ultimate luxury in Sri Lanka's most beautiful locations.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold mb-6">Explore</h4>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li><Link href={`/${tenantId}/about`} className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href={`/${tenantId}/rooms`} className="hover:text-white transition-colors">Rooms</Link></li>
                            <li><Link href={`/${tenantId}/dining`} className="hover:text-white transition-colors">Dining</Link></li>
                            <li><Link href={`/${tenantId}/events`} className="hover:text-white transition-colors">Events</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-6">Contact</h4>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li>123 Paradise Road, Galle</li>
                            <li>+94 11 234 5678</li>
                            <li>reservations@ceylonparadise.com</li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold mb-6">Newsletter</h4>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email..."
                                className="bg-zinc-800 border-none rounded-md px-4 py-2 text-sm w-full focus:ring-1 focus:ring-primary"
                            />
                            <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
                    <p>&copy; {new Date().getFullYear()} Ceylon Paradise. {t("rights")}.</p>
                    <div className="flex gap-6">
                        <Link href={`/${tenantId}/privacy`} className="hover:text-white">{t("privacy")}</Link>
                        <Link href={`/${tenantId}/terms`} className="hover:text-white">{t("terms")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
