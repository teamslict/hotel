"use client";

import { useEffect, useState } from "react";
import { useHotelConfigStore } from "@/store/useHotelConfigStore";

interface ConfigProviderProps {
    subdomain: string;
    children: React.ReactNode;
}

export function ConfigProvider({ subdomain, children }: ConfigProviderProps) {
    const { config, fetchConfig, loading, error, setConfig } = useHotelConfigStore();
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                await fetchConfig(subdomain);
            } catch (e) {
                // If API fails, use default fallback config
                console.warn("Failed to fetch hotel config, using defaults:", e);
                setConfig({
                    tenantId: subdomain,
                    subdomain: subdomain,
                    config: {
                        hotelName: subdomain.charAt(0).toUpperCase() + subdomain.slice(1) + " Hotel",
                        tagline: "Experience Luxury & Comfort",
                        primaryColor: "#8B5CF6",
                        secondaryColor: "#D4AF37",
                        currency: "LKR",
                    }
                });
            }
            setInitialized(true);
        };
        init();
    }, [subdomain, fetchConfig, setConfig]);

    // Apply CSS variables for dynamic theming
    useEffect(() => {
        if (config?.config) {
            const root = document.documentElement;
            const { primaryColor, secondaryColor, accentColor } = config.config;

            if (primaryColor) {
                root.style.setProperty("--primary", hexToHsl(primaryColor));
                root.style.setProperty("--hotel-primary", primaryColor);
            }
            if (secondaryColor) {
                root.style.setProperty("--secondary", hexToHsl(secondaryColor));
                root.style.setProperty("--hotel-secondary", secondaryColor);
            }
            if (accentColor) {
                root.style.setProperty("--accent", hexToHsl(accentColor));
                root.style.setProperty("--hotel-accent", accentColor);
            }
        }
    }, [config]);

    if (!initialized || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground">Loading hotel configuration...</p>
                </div>
            </div>
        );
    }

    // Always render children - use fallback config if API fails
    return <>{children}</>;
}

// Helper: Convert hex color to HSL string for shadcn
function hexToHsl(hex: string): string {
    hex = hex.replace(/^#/, "");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
