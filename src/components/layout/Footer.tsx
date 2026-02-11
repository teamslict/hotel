"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useHotelConfigStore } from "@/store/useHotelConfigStore";

export function Footer({ tenantId }: { tenantId: string }) {
    const t = useTranslations("footer");
    const { config } = useHotelConfigStore();
    const c = config?.config;

    return (
        <footer className="bg-[#05050A] border-t border-white/5 text-white/80 py-16 md:py-24 font-light">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                    {/* Brand */}
                    <div className="space-y-6">
                        <h3 className="text-3xl font-serif font-bold text-white tracking-tight">{c?.hotelName || "Luxury Hotel"}</h3>
                        <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                            {c?.tagline || "Experience the ultimate luxury in our beautiful locations."}
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-6 tracking-wide uppercase text-xs">Explore</h4>
                        <ul className="space-y-4 text-sm text-white/50">
                            <li><Link href={`/${tenantId}/about`} className="hover:text-white transition-colors duration-300 flex items-center gap-2">About Us</Link></li>
                            <li><Link href={`/${tenantId}/rooms`} className="hover:text-white transition-colors duration-300 flex items-center gap-2">Rooms</Link></li>
                            <li><Link href={`/${tenantId}/dining`} className="hover:text-white transition-colors duration-300 flex items-center gap-2">Dining</Link></li>
                            <li><Link href={`/${tenantId}/experiences`} className="hover:text-white transition-colors duration-300 flex items-center gap-2">Experiences</Link></li>
                            <li><Link href={`/${tenantId}/events`} className="hover:text-white transition-colors duration-300 flex items-center gap-2">Events</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white mb-6 tracking-wide uppercase text-xs">Contact</h4>
                        <ul className="space-y-4 text-sm text-white/50">
                            {c?.address && <li className="leading-relaxed">{c.address}</li>}
                            {c?.contactPhone && <li><a href={`tel:${c.contactPhone}`} className="hover:text-white transition-colors duration-300 block">{c.contactPhone}</a></li>}
                            {c?.contactEmail && <li><a href={`mailto:${c.contactEmail}`} className="hover:text-white transition-colors duration-300 block">{c.contactEmail}</a></li>}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold text-white mb-6 tracking-wide uppercase text-xs">Newsletter</h4>
                        <div className="flex flex-col gap-3">
                            <input
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                placeholder="Email Address"
                                className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm w-full focus:outline-none focus:bg-white/10 focus:border-white/20 transition-all text-white placeholder:text-white/30"
                            />
                            <button className="bg-white text-black px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/40 uppercase tracking-widest">
                    <p>&copy; {new Date().getFullYear()} Ceylon Paradise. {t("rights")}.</p>
                    <div className="flex gap-8">
                        <Link href={`/${tenantId}/privacy`} className="hover:text-white transition-colors duration-300">{t("privacy")}</Link>
                        <Link href={`/${tenantId}/terms`} className="hover:text-white transition-colors duration-300">{t("terms")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
