"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Users } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function BookingWidget({ tenantId }: { tenantId: string }) {
    const t = useTranslations("booking");
    const router = useRouter();
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 2),
    });
    const [guests, setGuests] = React.useState({ adults: 2, children: 0 });
    const [isMobile, setIsMobile] = React.useState(false);

    // Detect mobile screen for responsive calendar
    React.useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        setIsMobile(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    const handleSearch = () => {
        if (!date?.from || !date?.to) return;

        const params = new URLSearchParams({
            checkIn: format(date.from, "yyyy-MM-dd"),
            checkOut: format(date.to, "yyyy-MM-dd"),
            adults: guests.adults.toString(),
            children: guests.children.toString(),
        });

        router.push(`/${tenantId}/search?${params.toString()}`);
    };

    return (
        <div className="bg-[#0f0f1a]/60 backdrop-blur-xl border border-white/10 p-3 md:p-4 lg:p-6 rounded-2xl md:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-3 md:gap-4">
            {/* Date Picker */}
            <div className="flex-[2]">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal h-12 md:h-16 rounded-xl md:rounded-2xl transition-all duration-300",
                                "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white hover:border-white/20",
                                !date && "text-white/50"
                            )}
                        >
                            <CalendarIcon className="mr-3 h-5 w-5 text-white/70" />
                            <div className="flex flex-col items-start gap-0.5">
                                <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">{t("dates")}</span>
                                <span className="text-sm font-medium">
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, "LLL dd")} - {format(date.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(date.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>{t("checkIn")} - {t("checkOut")}</span>
                                    )}
                                </span>
                            </div>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#0f0f1a] border-white/10 text-white" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={isMobile ? 1 : 2}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            className="bg-[#0f0f1a] text-white rounded-xl border border-white/10"
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Guest Selector */}
            <div className="flex-1">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal h-12 md:h-16 rounded-xl md:rounded-2xl transition-all duration-300",
                                "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white hover:border-white/20"
                            )}
                        >
                            <Users className="mr-3 h-5 w-5 text-white/70" />
                            <div className="flex flex-col items-start gap-0.5">
                                <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">{t("guests")}</span>
                                <span className="text-sm font-medium">{guests.adults} {t("adults")}, {guests.children} {t("children")}</span>
                            </div>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-6 bg-[#1a1a2e] border-white/10 text-white backdrop-blur-xl rounded-2xl">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-base font-medium">{t("adults")}</span>
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" size="icon" className="border-white/20 bg-white/5 hover:bg-white/10 text-white h-8 w-8 rounded-full" onClick={() => setGuests(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}>-</Button>
                                    <span className="w-4 text-center">{guests.adults}</span>
                                    <Button variant="outline" size="icon" className="border-white/20 bg-white/5 hover:bg-white/10 text-white h-8 w-8 rounded-full" onClick={() => setGuests(prev => ({ ...prev, adults: prev.adults + 1 }))}>+</Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-base font-medium">{t("children")}</span>
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" size="icon" className="border-white/20 bg-white/5 hover:bg-white/10 text-white h-8 w-8 rounded-full" onClick={() => setGuests(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}>-</Button>
                                    <span className="w-4 text-center">{guests.children}</span>
                                    <Button variant="outline" size="icon" className="border-white/20 bg-white/5 hover:bg-white/10 text-white h-8 w-8 rounded-full" onClick={() => setGuests(prev => ({ ...prev, children: prev.children + 1 }))}>+</Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Search Button */}
            <Button
                size="lg"
                className="h-12 md:h-16 px-6 md:px-10 text-xs md:text-sm font-bold tracking-widest uppercase bg-white hover:bg-white/90 text-black shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 rounded-xl md:rounded-2xl w-full md:w-auto"
                onClick={handleSearch}
            >
                {t("search")}
            </Button>
        </div>
    );
}
