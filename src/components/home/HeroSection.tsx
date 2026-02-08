"use client";

import { motion } from "framer-motion";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { useTranslations } from "next-intl";

interface HeroSectionProps {
    tenantId: string;
    tenantName: string;
}

export function HeroSection({ tenantId, tenantName }: HeroSectionProps) {
    const t = useTranslations("hero");

    return (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image/Video */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
                    alt="Hotel Background"
                    className="w-full h-full object-cover"
                />
                {/* Parallax effect can be added here */}
            </div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-xl md:text-2xl font-light tracking-widest mb-4 uppercase">
                        {t("tagline")}
                    </h2>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 drop-shadow-lg">
                        {tenantName}
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-12"
                >
                    <BookingWidget tenantId={tenantId} />
                </motion.div>
            </div>
        </section>
    );
}
