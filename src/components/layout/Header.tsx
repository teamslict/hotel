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
            setIsScrolled(window.scrollY > 20);
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
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                isScrolled
                    ? "bg-white/80 backdrop-blur-md shadow-sm border-zinc-200 dark:bg-black/80 dark:border-zinc-800"
                    : "bg-gradient-to-b from-black/50 to-transparent border-transparent"
            )}
        >
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href={`/${tenantId}`} className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                    {logoUrl && (
                        <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white/20">
                            <img src={logoUrl} alt={displayName} className="object-cover w-full h-full" />
                        </div>
                    )}
                    <span className={cn(isScrolled ? "text-foreground" : "text-white")}>
                        {displayName}
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors",
                                isScrolled
                                    ? "text-foreground/80 hover:text-primary"
                                    : "text-white/90 hover:text-white"
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
                            "hidden md:inline-flex rounded-full px-6 font-semibold shadow-lg hover:shadow-xl transition-all",
                            isScrolled
                                ? ""
                                : "bg-white text-black hover:bg-white/90"
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
                                    isScrolled ? "text-foreground" : "text-white hover:bg-white/20 hover:text-white"
                                )}
                            >
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px]">
                            <SheetHeader>
                                <SheetTitle className="text-left font-serif">{tenantName}</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-4 mt-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-lg font-medium hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="mt-4 pt-4 border-t">
                                    <Button className="w-full rounded-full size-lg">
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
