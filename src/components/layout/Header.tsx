"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useHotelConfigStore } from "@/store/useHotelConfigStore";

interface HeaderProps {
    tenantId: string;
    tenantName: string;
}

export function Header({ tenantId, tenantName }: HeaderProps) {
    const t = useTranslations("nav");
    const [isScrolled, setIsScrolled] = useState(false);
    const { config } = useHotelConfigStore();

    // Use config data if available, otherwise fallback to props
    const displayName = config?.config?.hotelName || tenantName;
    const logoUrl = config?.config?.logoUrl;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: `/${tenantId}`, label: t("home") },
        { href: `/${tenantId}/rooms`, label: t("rooms") },
        { href: `/${tenantId}/dining`, label: t("dining") },
        { href: `/${tenantId}/experiences`, label: t("experiences") },
        { href: `/${tenantId}/events`, label: t("events") },
        { href: `/${tenantId}/contact`, label: t("contact") },
    ];

    return (
        <header
            className={cn(
                "fixed z-50 transition-all duration-500 ease-in-out flex items-center",
                isScrolled
                    ? "top-3 left-3 right-3 md:left-6 md:right-6 h-16 rounded-2xl bg-[#0f0f1a]/95 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                    : "top-0 left-0 right-0 h-20 bg-white border-b border-slate-200 shadow-sm"
            )}
        >
            <div className="container mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link
                    href={`/${tenantId}`}
                    className={cn(
                        "text-2xl font-serif font-bold flex items-center gap-3",
                        isScrolled ? "text-white" : "text-slate-900"
                    )}
                >
                    {logoUrl && (
                        <div className={cn("relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 shadow-sm", isScrolled ? "border-white/20" : "border-slate-200")}>
                            <img src={logoUrl} alt={displayName} className="object-cover w-full h-full" />
                        </div>
                    )}
                    <span className={cn("drop-shadow-sm tracking-tight", isScrolled ? "text-white" : "text-slate-900")}>{displayName}</span>
                </Link>

                {/* Desktop Nav */}
                <nav className={cn(
                    "hidden md:flex items-center gap-1 p-1 rounded-full border backdrop-blur-sm",
                    isScrolled ? "bg-white/5 border-white/5" : "bg-slate-100/80 border-slate-200/50"
                )}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "px-5 py-2 rounded-full text-[13px] font-medium tracking-wider uppercase transition-all duration-300",
                                isScrolled
                                    ? "hover:bg-white/10 hover:text-white text-white/80"
                                    : "hover:bg-slate-200/60 hover:text-slate-900 text-slate-600"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <LanguageSwitcher isScrolled={isScrolled} />
                    <Button
                        className={cn(
                            "hidden md:inline-flex rounded-full px-8 py-6 text-[13px] font-bold tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105",
                            isScrolled
                                ? "bg-white text-black border-none hover:bg-white/90"
                                : "bg-slate-900 text-white border-none hover:bg-slate-800"
                        )}
                    >
                        {t("bookNow")}
                    </Button>

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "md:hidden",
                                    isScrolled ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"
                                )}
                            >
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] bg-[#0f0f1a] border-l border-white/10 p-0">
                            <SheetHeader className="p-6 border-b border-white/5">
                                <SheetTitle className="text-left font-serif text-white text-xl">{tenantName}</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col p-6 gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-lg font-medium text-white/70 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl transition-all"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <Button className="w-full rounded-xl py-6 bg-white text-black hover:bg-zinc-200 font-bold tracking-wider uppercase">
                                        {t("bookNow")}
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
