"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Calendar, Clock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { hotelApi } from "@/lib/api";

interface HotelEvent {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    category: string | null;
    date: string;
    endDate: string | null;
    time: string | null;
    location: string | null;
    images: string[];
    price: number;
    capacity: number | null;
    isPublished: boolean;
    isFeatured: boolean;
    _count?: { registrations: number };
}

const FALLBACK_EVENTS: HotelEvent[] = [
    {
        id: "1",
        title: "Jazz Night by the Beach",
        slug: "jazz-night-by-the-beach",
        description: "Enjoy smooth jazz tunes with your favorite cocktails under the stars.",
        category: "Music",
        date: new Date().toISOString(),
        endDate: null,
        time: "7:00 PM",
        location: "Ocean Lounge",
        images: ["https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1974&auto=format&fit=crop"],
        price: 0,
        capacity: null,
        isPublished: true,
        isFeatured: true
    },
    {
        id: "2",
        title: "Sri Lankan Food Festival",
        slug: "sri-lankan-food-festival",
        description: "A culinary journey through the authentic flavors of Sri Lanka.",
        category: "Dining",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: null,
        time: "6:00 PM - 10:00 PM",
        location: "Main Restaurant",
        images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop"],
        price: 0,
        capacity: 100,
        isPublished: true,
        isFeatured: false
    },
    {
        id: "3",
        title: "Yoga Retreat Weekend",
        slug: "yoga-retreat-weekend",
        description: "Rejuvenate your mind and body with our expert yoga instructors.",
        category: "Wellness",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: null,
        time: "6:00 AM - 8:00 AM",
        location: "Garden Pavilion",
        images: ["https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop"],
        price: 50,
        capacity: 30,
        isPublished: true,
        isFeatured: false
    }
];

export default function EventsPage() {
    const params = useParams();
    const tenant = params.tenant as string;
    const [events, setEvents] = useState<HotelEvent[]>([]);
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch Config
                try {
                    const configData = await hotelApi.getConfig(tenant);
                    if (configData && configData.config) {
                        setConfig(configData.config);
                    }
                } catch (e) {
                    console.error("Error fetching config", e);
                }

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
                const baseUrl = apiUrl === "" ? 'http://localhost:3000' : apiUrl;
                const res = await fetch(`${baseUrl}/api/public/hotel/events?tenantId=${tenant}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        setEvents(data);
                    } else {
                        setEvents(FALLBACK_EVENTS);
                    }
                } else {
                    setEvents(FALLBACK_EVENTS);
                }
            } catch (error) {
                console.error('Error fetching events:', error);
                setEvents(FALLBACK_EVENTS);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [tenant]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getImage = (event: HotelEvent) => {
        return event.images?.[0] || 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1974&auto=format&fit=crop';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            <section className="relative bg-zinc-900 text-white py-12 md:py-20 mb-8 md:mb-12 overflow-hidden">
                {config?.eventHeroImage && (
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={config.eventHeroImage}
                            alt="Events Hero"
                            fill
                            className="object-cover opacity-40"
                        />
                        <div className="absolute inset-0 bg-black/50" />
                    </div>
                )}
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">
                        {config?.eventHeroTitle || "Events & Happenings"}
                    </h1>
                    <p className="text-base md:text-xl text-zinc-200 max-w-2xl mx-auto px-4">
                        {config?.eventHeroSubtitle || "Discover exceptional experiences curated just for you."}
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4">
                {events.length === 0 ? (
                    <div className="text-center py-16">
                        <CalendarDays className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-stone-600 mb-2">No upcoming events</h3>
                        <p className="text-stone-500">Check back soon for new events and happenings!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {events.map((event) => (
                            <div key={event.id} className="group bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="relative h-48 md:h-64 overflow-hidden">
                                    <Image
                                        src={getImage(event)}
                                        alt={event.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {event.category && (
                                        <Badge className="absolute top-4 left-4 bg-white/90 text-black hover:bg-white">
                                            {event.category}
                                        </Badge>
                                    )}
                                    {event.isFeatured && (
                                        <Badge className="absolute top-4 right-4 bg-amber-500 text-white hover:bg-amber-600">
                                            Featured
                                        </Badge>
                                    )}
                                </div>

                                <div className="p-4 md:p-6">
                                    <div className="flex items-center gap-4 text-sm text-stone-500 mb-6">
                                        <span className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-amber-500" />
                                            {formatDate(event.date)}
                                        </span>
                                        {event.time && (
                                            <span className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-amber-500" />
                                                {event.time}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">
                                        {event.title}
                                    </h3>

                                    {event.location && (
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                                            <MapPin className="w-4 h-4" />
                                            <span>{event.location}</span>
                                        </div>
                                    )}

                                    <p className="text-muted-foreground mb-6 line-clamp-2">
                                        {event.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        {event.price > 0 && (
                                            <span className="text-lg font-semibold text-amber-600">${event.price}</span>
                                        )}
                                        <Link href={`/${tenant}/book?service=event&eventId=${event.id}`} className={event.price > 0 ? '' : 'w-full'}>
                                            <button className="w-full py-3 border border-stone-200 text-stone-600 rounded-xl font-medium hover:bg-stone-50 hover:border-amber-500 hover:text-amber-600 transition-all flex items-center justify-center gap-2 group">
                                                <span>RSVP Now</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
