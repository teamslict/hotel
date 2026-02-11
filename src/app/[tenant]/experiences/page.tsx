"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    Sparkles, Heart, Mountain, Palmtree, Music, Camera,
    ChevronRight, Clock, Star, ArrowRight, Calendar, Loader2,
    LucideIcon
} from "lucide-react";
import { hotelApi } from "@/lib/api";

interface Experience {
    id: string;
    name: string;
    slug: string;
    category: string;
    description: string | null;
    duration: string | null;
    price: number;
    images: string[];
    includes: string[];
    requirements: string | null;
    maxParticipants: number | null;
    isActive: boolean;
    isFeatured: boolean;
    sortOrder: number;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
    "Wellness": Heart,
    "Adventure": Mountain,
    "Leisure": Palmtree,
    "Entertainment": Music,
    "Memories": Camera,
    "Culture": Sparkles,
};

const FALLBACK_EXPERIENCES: Experience[] = [
    {
        id: "spa",
        name: "Serenity Spa",
        slug: "serenity-spa",
        category: "Wellness",
        description: "Indulge in our world-class spa featuring ancient healing traditions and modern therapeutic techniques. From signature massages to holistic treatments.",
        duration: "60-120 min",
        price: 150,
        images: ["https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80"],
        includes: ["Aromatherapy", "Hot Stone Massage"],
        requirements: null,
        maxParticipants: 2,
        isActive: true,
        isFeatured: true,
        sortOrder: 0
    },
    {
        id: "tours",
        name: "Local Discoveries",
        slug: "local-discoveries",
        category: "Adventure",
        description: "Curated excursions led by expert guides. From cultural heritage tours to off-the-beaten-path adventures in the surrounding region.",
        duration: "Half/Full Day",
        price: 95,
        images: ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80"],
        includes: ["Guide", "Transport", "Lunch"],
        requirements: null,
        maxParticipants: 12,
        isActive: true,
        isFeatured: false,
        sortOrder: 1
    },
    {
        id: "beach",
        name: "Beach Club",
        slug: "beach-club",
        category: "Leisure",
        description: "Private beach access with premium loungers, water sports, and attentive service. Perfect for a day of relaxation or adventure.",
        duration: "All Day",
        price: 0,
        images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"],
        includes: ["Lounger", "Towels", "Water Sports"],
        requirements: null,
        maxParticipants: null,
        isActive: true,
        isFeatured: false,
        sortOrder: 2
    },
    {
        id: "events",
        name: "Live Events",
        slug: "live-events",
        category: "Entertainment",
        description: "Weekly live music, cultural performances, and themed evenings. From jazz nights to traditional dance shows.",
        duration: "Evening",
        price: 0,
        images: ["https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80"],
        includes: ["Entry", "Welcome Drink"],
        requirements: null,
        maxParticipants: null,
        isActive: true,
        isFeatured: false,
        sortOrder: 3
    },
    {
        id: "photography",
        name: "Photo Sessions",
        slug: "photo-sessions",
        category: "Memories",
        description: "Professional photography services for couples, families, or special occasions. Scenic locations throughout the property.",
        duration: "1-2 hours",
        price: 299,
        images: ["https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80"],
        includes: ["Digital Photos", "Editing", "Album"],
        requirements: null,
        maxParticipants: 6,
        isActive: true,
        isFeatured: false,
        sortOrder: 4
    },
];

const UPCOMING_EVENTS = [
    { date: "Feb 14", title: "Valentine's Dinner", venue: "Grand Pavilion" },
    { date: "Feb 20", title: "Jazz Night", venue: "Sky Lounge" },
    { date: "Mar 1", title: "Wine Tasting", venue: "The Cellar" },
];

export default function ExperiencesPage() {
    const params = useParams();
    const tenant = params.tenant as string;
    const { scrollY } = useScroll();
    const heroScale = useTransform(scrollY, [0, 500], [1, 1.2]);

    const [experiences, setExperiences] = useState<Experience[]>([]);
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
                const res = await fetch(`${baseUrl}/api/public/hotel/experiences?tenantId=${tenant}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        setExperiences(data);
                    } else {
                        setExperiences(FALLBACK_EXPERIENCES);
                    }
                } else {
                    setExperiences(FALLBACK_EXPERIENCES);
                }
            } catch (error) {
                console.error('Error fetching experiences:', error);
                setExperiences(FALLBACK_EXPERIENCES);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [tenant]);

    const featured = experiences.find((e) => e.isFeatured) || experiences[0];
    const others = experiences.filter((e) => e.id !== featured?.id);

    const getImage = (exp: Experience) => {
        return exp.images?.[0] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80';
    };

    const formatPrice = (price: number) => {
        if (price === 0) return 'Complimentary';
        return `From $${price}`;
    };

    const getIcon = (category: string) => {
        return CATEGORY_ICONS[category] || Sparkles;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
            {/* HERO SECTION */}
            <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
                <motion.div style={{ scale: heroScale }} className="absolute inset-0">
                    <Image
                        src={config?.experienceHeroImage || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80"}
                        alt="Hotel Experiences"
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 via-teal-900/50 to-transparent z-10" />

                <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6"
                    >
                        <Sparkles className="w-10 h-10 md:w-14 md:h-14 text-amber-400 mx-auto" />
                    </motion.div>
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-amber-400 uppercase tracking-[0.4em] text-sm font-medium mb-4"
                    >
                        Beyond Accommodation
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl sm:text-5xl md:text-7xl font-serif font-light mb-4 md:mb-6"
                    >
                        {config?.experienceHeroTitle || "Curated Experiences"}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-base md:text-xl text-white/80 max-w-2xl px-4"
                    >
                        {config?.experienceHeroSubtitle || "Create lasting memories with our handpicked collection of activities, wellness retreats, and cultural journeys."}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mt-10"
                    >
                        <a href="#experiences" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors group">
                            <span>Explore All</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* FEATURED EXPERIENCE */}
            {featured && (
                <section className="container mx-auto px-4 py-12 md:py-24">
                    <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-br from-teal-100 to-amber-100 rounded-3xl -z-10" />
                            <div className="relative h-[280px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src={getImage(featured)}
                                    alt={featured.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-6 left-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                                    <Star className="w-4 h-4 fill-current" />
                                    Most Popular
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                                    {(() => {
                                        const IconComponent = getIcon(featured.category);
                                        return <IconComponent className="w-6 h-6 text-teal-600" />;
                                    })()}
                                </div>
                                <span className="text-teal-600 uppercase tracking-wider text-sm font-medium">
                                    {featured.category}
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-slate-800 mb-4">
                                {featured.name}
                            </h2>
                            <p className="text-xl text-teal-600 mb-6">Rejuvenate Your Senses</p>
                            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                {featured.description}
                            </p>

                            <div className="grid grid-cols-2 gap-6 mb-10">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Clock className="w-5 h-5 text-teal-500" />
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase">Duration</p>
                                        <p className="font-medium">{featured.duration || 'Flexible'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase">Starting</p>
                                        <p className="font-medium">{formatPrice(featured.price)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <Link href={`/${tenant}/book?service=experience&experienceId=${featured.id}`}>
                                    <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-medium hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl">
                                        <Calendar className="w-5 h-5" />
                                        Book Experience
                                    </button>
                                </Link>
                                <button className="px-8 py-4 border-2 border-stone-300 text-stone-700 rounded-full font-medium hover:border-amber-500 hover:text-amber-600 transition-all">
                                    View Details
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ALL EXPERIENCES GRID */}
            <section id="experiences" className="bg-gradient-to-b from-white to-teal-50 py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-teal-600 uppercase tracking-wider text-sm font-medium"
                        >
                            Discover More
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl font-serif text-slate-800 mt-2"
                        >
                            All Experiences
                        </motion.h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {others.map((exp, index) => {
                            const IconComponent = getIcon(exp.category);
                            return (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group"
                                >
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={getImage(exp)}
                                                alt={exp.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                                                <IconComponent className="w-5 h-5 text-teal-600" />
                                            </div>
                                        </div>
                                        <div className="p-5 flex-grow flex flex-col">
                                            <span className="text-xs text-teal-500 uppercase tracking-wider">{exp.category}</span>
                                            <h3 className="text-lg font-serif font-medium text-slate-800 mt-1">{exp.name}</h3>
                                            <p className="text-slate-500 text-sm mt-2 line-clamp-2 flex-grow">{exp.description}</p>
                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 text-sm">
                                                <span className="text-slate-400 flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {exp.duration || 'Flexible'}
                                                </span>
                                                <span className="font-medium text-teal-600">{formatPrice(exp.price)}</span>
                                            </div>
                                            <Link href={`/${tenant}/book?service=experience&experienceId=${exp.id}`} className="mt-4">
                                                <button className="w-full py-3 border-2 border-teal-500 text-teal-600 rounded-xl font-medium hover:bg-teal-500 hover:text-white transition-all flex items-center justify-center gap-2">
                                                    Book Now
                                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* UPCOMING EVENTS */}
            <section className="container mx-auto px-4 py-20">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="grid lg:grid-cols-2">
                        <div className="p-6 md:p-12 lg:p-16">
                            <span className="text-amber-400 uppercase tracking-wider text-sm font-medium">
                                What&apos;s Happening
                            </span>
                            <h2 className="text-3xl md:text-4xl font-serif text-white mt-2 mb-6 md:mb-8">
                                Upcoming Events
                            </h2>
                            <div className="space-y-6">
                                {UPCOMING_EVENTS.map((event, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-6 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                                    >
                                        <div className="w-16 h-16 rounded-xl bg-amber-500/20 flex flex-col items-center justify-center shrink-0">
                                            <span className="text-amber-400 text-xs uppercase">{event.date.split(" ")[0]}</span>
                                            <span className="text-white text-xl font-bold">{event.date.split(" ")[1]}</span>
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="text-white font-medium text-lg">{event.title}</h4>
                                            <p className="text-slate-400 text-sm">{event.venue}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                                    </motion.div>
                                ))}
                            </div>
                            <Link href={`/${tenant}/events`}>
                                <button className="mt-8 px-6 py-3 border border-amber-500/50 text-amber-400 rounded-full hover:bg-amber-500/10 transition-colors flex items-center gap-2">
                                    View All Events
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                        <div className="relative h-[250px] md:h-[400px] lg:h-auto">
                            <Image
                                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80"
                                alt="Events"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* BESPOKE CTA */}
            <section className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-800 mb-4">
                        Create Your Own Experience
                    </h2>
                    <p className="text-slate-600 text-lg mb-8">
                        Can&apos;t find what you&apos;re looking for? Our concierge team specializes in crafting bespoke experiences tailored to your desires.
                    </p>
                    <Link href={`/${tenant}/contact?inquiry=bespoke`}>
                        <button className="px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl text-lg">
                            Speak to a Concierge
                        </button>
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
