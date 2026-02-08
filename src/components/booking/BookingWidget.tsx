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
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
            {/* Date Picker */}
            <div className="flex-[2]">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal bg-white/80 border-0 h-14 hover:bg-white text-black",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>{t("checkIn")} - {t("checkOut")}</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Guest Selector */}
            <div className="flex-1">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-white/80 border-0 h-14 hover:bg-white text-black">
                            <Users className="mr-2 h-4 w-4" />
                            <span>{guests.adults} {t("adults")}, {guests.children} {t("children")}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{t("adults")}</span>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" onClick={() => setGuests(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}>-</Button>
                                    <span>{guests.adults}</span>
                                    <Button variant="outline" size="icon" onClick={() => setGuests(prev => ({ ...prev, adults: prev.adults + 1 }))}>+</Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{t("children")}</span>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" onClick={() => setGuests(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}>-</Button>
                                    <span>{guests.children}</span>
                                    <Button variant="outline" size="icon" onClick={() => setGuests(prev => ({ ...prev, children: prev.children + 1 }))}>+</Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Search Button */}
            <Button
                size="lg"
                className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg"
                onClick={handleSearch}
            >
                {t("search")}
            </Button>
        </div>
    );
}
