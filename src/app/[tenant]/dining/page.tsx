"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Clock, MapPin, Phone, Utensils, Wine, Coffee, ChevronRight, Star, Calendar, Loader2 } from "lucide-react";

interface DiningVenue {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    cuisine: string | null;
    dressCode: string | null;
    openingHours: Record<string, string> | null;
    priceRange: string | null;
    images: string[];
    menuUrl: string | null;
    phone: string | null;
    capacity: number | null;
    isActive: boolean;
    isFeatured: boolean;
    sortOrder: number;
}

// Fallback mock data for when API is unavailable
const FALLBACK_RESTAURANTS: DiningVenue[] = [
    {
        id: "signature",
        name: "The Grand Pavilion",
        slug: "the-grand-pavilion",
        description: "Experience culinary artistry at its finest. Our award-winning chefs create masterpieces using locally-sourced ingredients and time-honored techniques.",
        cuisine: "Contemporary European",
        dressCode: "Smart Elegant",
        openingHours: { daily: "6:00 PM - 11:00 PM" },
        priceRange: "$$$",
        images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"],
        menuUrl: null,
        phone: null,
        capacity: 80,
        isActive: true,
        isFeatured: true,
        sortOrder: 0
    },
    {
        id: "rooftop",
        name: "Sky Lounge",
        slug: "sky-lounge",
        description: "Savor handcrafted cocktails and gourmet bites while enjoying panoramic views of the city skyline. Perfect for sunset drinks.",
        cuisine: "International Grill",
        dressCode: "Smart Casual",
        openingHours: { daily: "5:00 PM - 1:00 AM" },
        priceRange: "$$",
        images: ["https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80"],
        menuUrl: null,
        phone: null,
        capacity: 50,
        isActive: true,
        isFeatured: false,
        sortOrder: 1
    },
    {
        id: "cafe",
        name: "The Garden Café",
        slug: "the-garden-cafe",
        description: "A relaxed ambiance perfect for breakfast, lunch, or afternoon tea. Fresh pastries, artisan coffee, and light fare in a garden setting.",
        cuisine: "International",
        dressCode: "Casual",
        openingHours: { daily: "7:00 AM - 10:00 PM" },
        priceRange: "$",
        images: ["https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80"],
        menuUrl: null,
        phone: null,
        capacity: 60,
        isActive: true,
        isFeatured: false,
        sortOrder: 2
    },
    {
        id: "poolside",
        name: "Aqua Bar",
        slug: "aqua-bar",
        description: "Light bites and refreshing beverages by the pool. From tropical smoothies to gourmet salads, perfect for a relaxing afternoon.",
        cuisine: "Light Fare",
        dressCode: "Poolside Attire",
        openingHours: { daily: "10:00 AM - 7:00 PM" },
        priceRange: "$",
        images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80"],
        menuUrl: null,
        phone: null,
        capacity: 30,
        isActive: true,
        isFeatured: false,
        sortOrder: 3
    },
];

export default function DiningPage() {
    const params = useParams();
    const tenant = params.tenant as string;
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], ["0%", "30%"]);
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

    const [venues, setVenues] = useState<DiningVenue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVenues() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/public/hotel/dining?tenantId=${tenant}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        setVenues(data);
                    } else {
                        setVenues(FALLBACK_RESTAURANTS);
                    }
                } else {
                    setVenues(FALLBACK_RESTAURANTS);
                }
            } catch (error) {
                console.error('Error fetching dining venues:', error);
                setVenues(FALLBACK_RESTAURANTS);
            } finally {
                setLoading(false);
            }
        }
        fetchVenues();
    }, [tenant]);

    const featuredVenue = venues.find(v => v.isFeatured) || venues[0];
    const otherVenues = venues.filter(v => v.id !== featuredVenue?.id);

    const getHours = (venue: DiningVenue) => {
        if (venue.openingHours && typeof venue.openingHours === 'object') {
            return Object.values(venue.openingHours)[0] || 'Open';
        }
        return 'Open';
    };

    const getImage = (venue: DiningVenue) => {
        return venue.images?.[0] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
            {/* HERO SECTION */}
            <section className="relative h-[70vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-stone-50 z-10" />
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80"
                        alt="Fine Dining"
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
                <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6"
                    >
                        <Utensils className="w-12 h-12 text-amber-400 mx-auto" />
                    </motion.div>
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-amber-400 uppercase tracking-[0.3em] text-sm font-medium mb-4"
                    >
                        Culinary Excellence
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-5xl md:text-7xl font-serif font-light mb-6"
                    >
                        Dining Experiences
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-xl text-white/80 max-w-2xl"
                    >
                        Embark on a gastronomic journey through our collection of world-class restaurants and bars.
                    </motion.p>
                </div>
            </section>

            {/* FEATURED RESTAURANT */}
            {featuredVenue && (
                <section className="container mx-auto px-4 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-amber-400 rounded-2xl" />
                            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src={getImage(featuredVenue)}
                                    alt={featuredVenue.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-6 left-6 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                                    <Star className="w-4 h-4 fill-current" />
                                    Signature Restaurant
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:pl-8"
                        >
                            <span className="text-amber-600 uppercase tracking-wider text-sm font-medium">
                                {featuredVenue.priceRange || 'Fine Dining'}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mt-2 mb-6">
                                {featuredVenue.name}
                            </h2>
                            <p className="text-stone-600 text-lg mb-8 leading-relaxed">
                                {featuredVenue.description}
                            </p>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="flex items-center gap-3 text-stone-600">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                        <Utensils className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone-400 uppercase">Cuisine</p>
                                        <p className="font-medium">{featuredVenue.cuisine || 'International'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-stone-600">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-stone-400 uppercase">Hours</p>
                                        <p className="font-medium">{getHours(featuredVenue)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Link href={`/${tenant}/book?service=dining&venue=${featuredVenue.id}`}>
                                    <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-medium hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl">
                                        <Calendar className="w-5 h-5" />
                                        Reserve a Table
                                    </button>
                                </Link>
                                {featuredVenue.menuUrl && (
                                    <a href={featuredVenue.menuUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 border-2 border-stone-300 text-stone-700 rounded-full font-medium hover:border-amber-500 hover:text-amber-600 transition-all">
                                        View Menu
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* OTHER VENUES */}
            {otherVenues.length > 0 && (
                <section className="bg-stone-100 py-20">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-amber-600 uppercase tracking-wider text-sm font-medium"
                            >
                                More to Explore
                            </motion.span>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-4xl font-serif text-stone-800 mt-2"
                            >
                                Bars & Casual Dining
                            </motion.h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {otherVenues.map((venue, index) => (
                                <motion.div
                                    key={venue.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.15 }}
                                    className="group"
                                >
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                                        <div className="relative h-56 overflow-hidden">
                                            <Image
                                                src={getImage(venue)}
                                                alt={venue.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute bottom-4 left-4 text-white">
                                                <p className="text-xs text-amber-300 uppercase tracking-wider">{venue.priceRange}</p>
                                                <h3 className="text-xl font-serif">{venue.name}</h3>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <p className="text-stone-500 text-sm mb-4 line-clamp-2">{venue.description}</p>
                                            <div className="flex items-center justify-between text-sm text-stone-400 mb-4">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {getHours(venue)}
                                                </span>
                                                <span>{venue.dressCode}</span>
                                            </div>
                                            <Link href={`/${tenant}/book?service=dining&venue=${venue.id}`}>
                                                <button className="w-full py-3 border-2 border-amber-500 text-amber-600 rounded-xl font-medium hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center gap-2">
                                                    Reserve
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* PRIVATE DINING CTA */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80"
                        alt="Private Dining"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-stone-900/80" />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Wine className="w-12 h-12 text-amber-400 mx-auto mb-6" />
                            <h2 className="text-4xl font-serif text-white mb-4">Private Dining</h2>
                            <p className="text-stone-300 mb-8">
                                Host an unforgettable event in our exclusive private dining rooms. From intimate celebrations to corporate gatherings, we create bespoke experiences.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href={`/${tenant}/contact?inquiry=private-dining`}>
                                    <button className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium transition-colors">
                                        Inquire Now
                                    </button>
                                </Link>
                                <a href="tel:+1234567890" className="px-8 py-4 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Call Us
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
