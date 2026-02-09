"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { format, addDays, differenceInDays } from "date-fns";
import { DateRange } from "react-day-picker";
import {
    Calendar as CalendarIcon, Users, Wifi, Tv, Coffee, Bath, Wind,
    ChevronRight, Star, Check, ArrowLeft, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface GenericItem {
    id: string;
    name: string;
    description?: string;
    images: string[];
    type: string;
    basePrice?: number;
    price?: number;
    maxOccupancy?: number;
    amenities?: string[];
    date?: string;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
    wifi: <Wifi className="w-5 h-5" />,
    tv: <Tv className="w-5 h-5" />,
    coffee: <Coffee className="w-5 h-5" />,
    bath: <Bath className="w-5 h-5" />,
    ac: <Wind className="w-5 h-5" />,
};

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80";

// Mock room data for demo
const MOCK_ROOMS: Record<string, GenericItem> = {
    "1": {
        id: "1",
        name: "Deluxe Ocean View",
        description: "Wake up to breathtaking ocean views in our spacious deluxe room.",
        basePrice: 299,
        maxOccupancy: 2,
        amenities: ["wifi", "tv", "coffee", "bath", "ac"],
        images: ["https://images.unsplash.com/photo-1590490360182-f33d5e6a3853?w=800&q=80"],
        type: "room"
    },
    "2": {
        id: "2",
        name: "Premium Suite",
        description: "Experience ultimate luxury in our premium suite.",
        basePrice: 499,
        maxOccupancy: 4,
        amenities: ["wifi", "tv", "coffee", "bath", "ac"],
        images: ["https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80"],
        type: "room"
    },
};

const MOCK_DINING: Record<string, GenericItem> = {
    "signature": {
        id: "signature",
        name: "The Grand Pavilion",
        description: "Experience culinary artistry at its finest. Our award-winning chefs create masterpieces using locally-sourced ingredients.",
        images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"],
        type: "dining"
    },
    "beach-bar": {
        id: "beach-bar",
        name: "Sunset Beach Bar",
        description: "Relax with signature cocktails and light bites while watching the sunset over the ocean.",
        images: ["https://images.unsplash.com/photo-1533630248425-ce545938562d?w=800&q=80"],
        type: "dining"
    },
};

const MOCK_EXPERIENCES: Record<string, GenericItem> = {
    "spa": {
        id: "spa",
        name: "Serenity Spa",
        description: "Rejuvenate your body and mind with our holistic spa treatments.",
        price: 150,
        images: ["https://images.unsplash.com/photo-1544161515-4ab6ce6db48e?w=800&q=80"],
        type: "experience"
    },
    "scuba": {
        id: "scuba",
        name: "Scuba Diving",
        description: "Explore the vibrant coral reefs with our certified dive instructors.",
        price: 120,
        images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"],
        type: "experience"
    },
};

const MOCK_EVENTS: Record<string, GenericItem> = {
    "1": {
        id: "1",
        name: "Jazz Night by the Beach",
        description: "Enjoy smooth jazz tunes with your favorite cocktails under the stars.",
        price: 0,
        images: ["https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=800&q=80"],
        type: "event",
        date: "Every Friday, 7:00 PM"
    },
    "2": {
        id: "2",
        name: "Sri Lankan Food Festival",
        description: "A culinary journey through the authentic flavors of Sri Lanka.",
        price: 45,
        images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80"],
        type: "event",
        date: "March 15-20, 2026"
    },
    "3": {
        id: "3",
        name: "Yoga Retreat Weekend",
        description: "Rejuvenate your mind and body with our expert yoga instructors.",
        price: 200,
        images: ["https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800&q=80"],
        type: "event",
        date: "April 10-12, 2026"
    }
};

export default function BookPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const tenant = params.tenant as string;

    // Determine booking type
    const serviceType = searchParams.get("service") || "room"; // 'room', 'dining', 'experience', 'event'
    const roomTypeId = searchParams.get("roomTypeId");
    const venueId = searchParams.get("venue");
    const experienceId = searchParams.get("experienceId");
    const eventId = searchParams.get("eventId");

    // Use global scroll for hero parallax
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], ["0%", "30%"]);

    const [item, setItem] = useState<GenericItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [date, setDate] = useState<Date | DateRange | undefined>(
        serviceType === 'room'
            ? { from: new Date(), to: addDays(new Date(), 2) }
            : new Date()
    );
    const [guests, setGuests] = useState({ adults: 2, children: 0 });
    const [guestInfo, setGuestInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        specialRequests: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        setIsMobile(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        const fetchItem = async () => {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
            try {
                if (serviceType === 'room') {
                    const id = roomTypeId || "1";
                    const res = await fetch(`${apiUrl}/api/public/hotel/room-types/${id}?tenantId=${tenant}`);
                    if (res.ok) {
                        setItem(await res.json());
                    } else {
                        setItem(MOCK_ROOMS[id] || MOCK_ROOMS["1"]);
                    }
                } else if (serviceType === 'dining') {
                    const id = venueId || "signature";
                    const res = await fetch(`${apiUrl}/api/public/hotel/dining/${id}?tenantId=${tenant}`);
                    if (res.ok) {
                        const data = await res.json();
                        setItem({ ...data, type: 'dining' });
                    } else {
                        setItem(MOCK_DINING[id] || MOCK_DINING["signature"]);
                    }
                } else if (serviceType === 'experience') {
                    const id = experienceId || "spa";
                    const res = await fetch(`${apiUrl}/api/public/hotel/experiences/${id}?tenantId=${tenant}`);
                    if (res.ok) {
                        const data = await res.json();
                        setItem({ ...data, type: 'experience' });
                    } else {
                        setItem(MOCK_EXPERIENCES[id] || MOCK_EXPERIENCES["spa"]);
                    }
                } else if (serviceType === 'event') {
                    const id = eventId || "1";
                    const res = await fetch(`${apiUrl}/api/public/hotel/events/${id}?tenantId=${tenant}`);
                    if (res.ok) {
                        const data = await res.json();
                        setItem({ ...data, type: 'event' });
                    } else {
                        setItem(MOCK_EVENTS[id] || MOCK_EVENTS["1"]);
                    }
                }
            } catch {
                // Fallback to mock data
                if (serviceType === 'room') setItem(MOCK_ROOMS["1"]);
                else if (serviceType === 'dining') setItem(MOCK_DINING["signature"]);
                else if (serviceType === 'experience') setItem(MOCK_EXPERIENCES["spa"]);
                else if (serviceType === 'event') setItem(MOCK_EVENTS["1"]);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [serviceType, roomTypeId, venueId, experienceId, eventId, tenant]);

    // Calculate totals
    const isRoom = serviceType === 'room';
    const nights = isRoom && (date as DateRange)?.from && (date as DateRange)?.to
        ? differenceInDays((date as DateRange).to!, (date as DateRange).from!)
        : 0;

    // For dining/experiences, just show price per person or base price
    const basePrice = item?.basePrice || item?.price || 0;
    const subtotal = isRoom ? basePrice * nights : basePrice * (guests.adults + guests.children);
    const taxes = Math.round(subtotal * 0.12);
    const total = subtotal + taxes;

    const handleSubmit = async () => {
        if (!item) return;

        setIsSubmitting(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

        try {
            let endpoint = '';
            let body: unknown;

            if (serviceType === 'dining') {
                endpoint = `${apiUrl}/api/public/hotel/dining/reservations`;
                body = {
                    tenantId: tenant,
                    venueId: item.id,
                    guestName: `${guestInfo.firstName} ${guestInfo.lastName}`,
                    email: guestInfo.email,
                    phone: guestInfo.phone,
                    date: format(date as Date, 'yyyy-MM-dd'),
                    time: '19:00', // Default time, could be made selectable
                    partySize: guests.adults + guests.children,
                    specialRequests: guestInfo.specialRequests,
                };
            } else if (serviceType === 'experience') {
                endpoint = `${apiUrl}/api/public/hotel/experiences/bookings`;
                body = {
                    tenantId: tenant,
                    experienceId: item.id,
                    guestName: `${guestInfo.firstName} ${guestInfo.lastName}`,
                    email: guestInfo.email,
                    phone: guestInfo.phone,
                    date: format(date as Date, 'yyyy-MM-dd'),
                    participants: guests.adults + guests.children,
                    specialRequests: guestInfo.specialRequests,
                };
            } else if (serviceType === 'event') {
                endpoint = `${apiUrl}/api/public/hotel/events/registrations`;
                body = {
                    tenantId: tenant,
                    eventId: item.id,
                    guestName: `${guestInfo.firstName} ${guestInfo.lastName}`,
                    email: guestInfo.email,
                    phone: guestInfo.phone,
                    attendees: guests.adults + guests.children,
                    specialRequests: guestInfo.specialRequests,
                };
            } else {
                // Room booking - for now just simulate
                await new Promise((r) => setTimeout(r, 1500));
                router.push(`/${tenant}/booking/confirmation`);
                return;
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                router.push(`/${tenant}/booking/confirmation`);
            } else {
                const data = await res.json();
                alert(data.error || 'Booking failed. Please try again.');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-slate-500">Item not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
            {/* HERO */}
            <section className="relative h-[50vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-amber-50 z-10" />
                <motion.div style={{ y: heroY }} className="absolute inset-0">
                    <Image
                        src={item.images?.[0] || PLACEHOLDER_IMAGE}
                        alt={item.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
                <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-amber-400 uppercase tracking-[0.3em] text-sm font-medium mb-4"
                    >
                        {serviceType === 'dining' ? 'Reserve a Table' : serviceType === 'experience' ? 'Book Experience' : serviceType === 'event' ? 'Event Access' : 'Reserve Your Stay'}
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-6xl font-serif font-light mb-4"
                    >
                        {item.name}
                    </motion.h1>
                    {isRoom && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-1 text-amber-400"
                        >
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className="w-4 h-4 fill-current" />
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* PROGRESS STEPS */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center gap-4 md:gap-8 mb-12">
                    {[
                        { num: 1, label: "Select Dates" },
                        { num: 2, label: "Details" },
                        { num: 3, label: "Payment" },
                    ].map((s, i) => (
                        <div key={s.num} className="flex items-center gap-2 md:gap-4">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                                    step >= s.num
                                        ? "bg-amber-500 text-white"
                                        : "bg-slate-200 text-slate-500"
                                )}
                            >
                                {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                            </div>
                            <span className={cn("hidden sm:block text-sm font-medium", step >= s.num ? "text-amber-600" : "text-slate-400")}>
                                {s.label}
                            </span>
                            {i < 2 && <ChevronRight className="w-5 h-5 text-slate-300 hidden sm:block" />}
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* MAIN CONTENT */}
                    <div className="lg:col-span-2">
                        {/* STEP 1: DATES */}
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-slate-100"
                            >
                                <h2 className="text-2xl font-serif font-medium text-slate-800 mb-6">
                                    {serviceType === 'dining' ? 'Select Date & Time' : 'Select Dates'}
                                </h2>

                                <div className="space-y-6">
                                    {/* Date Picker */}
                                    <div>
                                        <Label className="text-sm text-slate-500 mb-2 block">
                                            {isRoom ? 'Check-in / Check-out' : 'Date'}
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal h-14 text-base"
                                                >
                                                    <CalendarIcon className="mr-3 h-5 w-5 text-amber-500" />
                                                    {isRoom ? (
                                                        (date as DateRange)?.from ? (
                                                            (date as DateRange).to ? (
                                                                <>
                                                                    {format((date as DateRange).from!, "MMM dd, yyyy")} — {format((date as DateRange).to!, "MMM dd, yyyy")}
                                                                </>
                                                            ) : (
                                                                format((date as DateRange).from!, "MMM dd, yyyy")
                                                            )
                                                        ) : <span className="text-slate-400">Select dates</span>
                                                    ) : (
                                                        (date as Date) ? format(date as Date, "MMM dd, yyyy") : <span className="text-slate-400">Select date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                {isRoom ? (
                                                    <Calendar
                                                        initialFocus
                                                        mode="range"
                                                        defaultMonth={(date as DateRange)?.from}
                                                        selected={date as DateRange}
                                                        onSelect={(range) => setDate(range)}
                                                        numberOfMonths={isMobile ? 1 : 2}
                                                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                                                    />
                                                ) : (
                                                    <Calendar
                                                        initialFocus
                                                        mode="single"
                                                        defaultMonth={date as Date}
                                                        selected={date as Date}
                                                        onSelect={(d) => setDate(d)}
                                                        numberOfMonths={1}
                                                        disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                                                    />
                                                )}
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Guests */}
                                    <div>
                                        <Label className="text-sm text-slate-500 mb-2 block">
                                            {serviceType === 'dining' ? 'Party Size' : 'Guests'}
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start text-left font-normal h-14 text-base">
                                                    <Users className="mr-3 h-5 w-5 text-amber-500" />
                                                    {guests.adults} Adults, {guests.children} Children
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-72 p-4">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium">Adults</span>
                                                        <div className="flex items-center gap-3">
                                                            <Button variant="outline" size="icon" onClick={() => setGuests((g) => ({ ...g, adults: Math.max(1, g.adults - 1) }))}>-</Button>
                                                            <span className="w-8 text-center">{guests.adults}</span>
                                                            <Button variant="outline" size="icon" onClick={() => setGuests((g) => ({ ...g, adults: Math.min(10, g.adults + 1) }))}>+</Button>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium">Children</span>
                                                        <div className="flex items-center gap-3">
                                                            <Button variant="outline" size="icon" onClick={() => setGuests((g) => ({ ...g, children: Math.max(0, g.children - 1) }))}>-</Button>
                                                            <span className="w-8 text-center">{guests.children}</span>
                                                            <Button variant="outline" size="icon" onClick={() => setGuests((g) => ({ ...g, children: g.children + 1 }))}>+</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Amenities / Info */}
                                    {isRoom && item.amenities && (
                                        <div className="pt-6 border-t">
                                            <h3 className="text-lg font-medium text-slate-800 mb-4">Room Amenities</h3>
                                            <div className="flex flex-wrap gap-4">
                                                {item.amenities.map((amenity: string) => (
                                                    <div key={amenity} className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-sm text-slate-600">
                                                        {AMENITY_ICONS[amenity.toLowerCase()] || null}
                                                        <span className="capitalize">{amenity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full mt-8 h-14 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                                    onClick={() => setStep(2)}
                                    disabled={isRoom ? (!((date as DateRange)?.from && (date as DateRange)?.to)) : !(date as Date)}
                                >
                                    Continue to Details
                                    <ChevronRight className="ml-2 w-5 h-5" />
                                </Button>
                            </motion.div>
                        )}

                        {/* STEP 2: GUEST INFO */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-slate-100"
                            >
                                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6">
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                                <h2 className="text-2xl font-serif font-medium text-slate-800 mb-6">Guest Information</h2>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                placeholder="John"
                                                autoComplete="given-name"
                                                value={guestInfo.firstName}
                                                onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
                                                className="h-12 mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                placeholder="Doe"
                                                autoComplete="family-name"
                                                value={guestInfo.lastName}
                                                onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
                                                className="h-12 mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                inputMode="email"
                                                autoComplete="email"
                                                placeholder="john@example.com"
                                                value={guestInfo.email}
                                                onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                                                className="h-12 mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                inputMode="tel"
                                                autoComplete="tel"
                                                placeholder="+94 77 123 4567"
                                                value={guestInfo.phone}
                                                onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                                                className="h-12 mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="specialRequests">
                                            {serviceType === 'dining' ? 'Dietary Requirements / Special Requests' : 'Special Requests (Optional)'}
                                        </Label>
                                        <Textarea
                                            id="specialRequests"
                                            placeholder="Any special requests or details..."
                                            value={guestInfo.specialRequests}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGuestInfo({ ...guestInfo, specialRequests: e.target.value })}
                                            className="mt-1 min-h-[100px]"
                                        />
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full mt-8 h-14 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                                    onClick={() => setStep(3)}
                                    disabled={!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone}
                                >
                                    Continue to Payment
                                    <ChevronRight className="ml-2 w-5 h-5" />
                                </Button>
                            </motion.div>
                        )}

                        {/* STEP 3: PAYMENT */}
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-slate-100"
                            >
                                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6">
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                                <h2 className="text-2xl font-serif font-medium text-slate-800 mb-6">
                                    {total > 0 ? 'Payment Details' : 'Confirm Reservation'}
                                </h2>

                                {total > 0 ? (
                                    <>
                                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 mb-6 border border-amber-100">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Shield className="w-6 h-6 text-amber-600" />
                                                <span className="font-medium text-slate-800">Secure Payment</span>
                                            </div>
                                            <p className="text-sm text-slate-600">Your payment information is encrypted and secure.</p>
                                        </div>
                                        {/* Card inputs would go here - simplified for brevity */}
                                        <div className="p-4 border rounded-md mb-6 bg-slate-50 text-center text-slate-500">
                                            Payment Form Placeholder
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-green-50 rounded-xl p-6 mb-6 border border-green-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Check className="w-6 h-6 text-green-600" />
                                            <span className="font-medium text-slate-800">No Payment Required</span>
                                        </div>
                                        <p className="text-sm text-slate-600">This reservation does not require an upfront payment.</p>
                                    </div>
                                )}

                                <Button
                                    size="lg"
                                    className="w-full mt-8 h-14 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </span>
                                    ) : (
                                        <>
                                            {total > 0 ? `Confirm & Pay $${total}` : 'Confirm Reservation'}
                                            <ChevronRight className="ml-2 w-5 h-5" />
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        )}
                    </div>

                    {/* SIDEBAR - BOOKING SUMMARY */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 sticky top-24">
                            <h3 className="text-lg font-serif font-medium text-slate-800 mb-4">Booking Summary</h3>

                            <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                                <Image
                                    src={item.images?.[0] || PLACEHOLDER_IMAGE}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <h4 className="font-medium text-slate-800">{item.name}</h4>

                            <div className="border-t mt-4 pt-4 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">{isRoom ? 'Check-in' : 'Date'}</span>
                                    <span className="font-medium">
                                        {isRoom
                                            ? ((date as DateRange)?.from ? format((date as DateRange).from!, "MMM dd, yyyy") : "—")
                                            : ((date as Date) ? format((date as Date), "MMM dd, yyyy") : "—")}
                                    </span>
                                </div>
                                {isRoom && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Check-out</span>
                                        <span className="font-medium">{(date as DateRange)?.to ? format((date as DateRange).to!, "MMM dd, yyyy") : "—"}</span>
                                    </div>
                                )}
                                {isRoom && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Nights</span>
                                        <span className="font-medium">{nights}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-slate-500">{serviceType === 'dining' ? 'People' : 'Guests'}</span>
                                    <span className="font-medium">{guests.adults + guests.children}</span>
                                </div>
                            </div>

                            {total > 0 && (
                                <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Subtotal</span>
                                        <span>${subtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Taxes & fees</span>
                                        <span>${taxes}</span>
                                    </div>
                                </div>
                            )}

                            <div className="border-t mt-4 pt-4">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-amber-600">${total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
