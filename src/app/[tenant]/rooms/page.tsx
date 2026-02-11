"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { RoomCard } from "@/components/booking/RoomCard";
import { API_BASE } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Users, Wifi, Coffee, Tv, Bath, Wind, ChevronRight, Star, Filter } from "lucide-react";

interface RoomType {
    id: string;
    name: string;
    description?: string;
    basePrice: number;
    maxOccupancy: number;
    amenities: string[];
    images: string[];
    bedType?: string | null;
    sizeSqM?: number | null;
    totalRooms?: number;
    availableRooms?: number;
    slug?: string;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
    wifi: <Wifi className="w-4 h-4" />,
    tv: <Tv className="w-4 h-4" />,
    coffee: <Coffee className="w-4 h-4" />,
    bath: <Bath className="w-4 h-4" />,
    ac: <Wind className="w-4 h-4" />,
};

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80";

export default function RoomsPage() {
    const params = useParams();
    const tenant = params.tenant as string;
    const [rooms, setRooms] = useState<RoomType[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ minPrice: 0, maxPrice: 5000, capacity: 0 });

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                // Robust fallback if env var is somehow empty string
                const baseUrl = API_BASE === "" ? 'http://localhost:3000' : API_BASE;

                const res = await fetch(`${baseUrl}/api/public/hotel/room-types?tenantId=${tenant}`);
                if (res.ok) {
                    const data = await res.json();
                    setRooms(data);
                }
            } catch (error) {
                console.error("Failed to fetch rooms:", error);
                // Fallback mock data for demo
                setRooms([
                    {
                        id: "1",
                        name: "Deluxe Ocean View",
                        description: "Wake up to breathtaking ocean views in our spacious deluxe room featuring premium amenities and a private balcony.",
                        basePrice: 299,
                        maxOccupancy: 2,
                        amenities: ["wifi", "tv", "coffee", "bath", "ac"],
                        images: [],
                    },
                    {
                        id: "2",
                        name: "Premium Suite",
                        description: "Experience ultimate luxury in our premium suite with separate living area, king-size bed, and panoramic city views.",
                        basePrice: 499,
                        maxOccupancy: 4,
                        amenities: ["wifi", "tv", "coffee", "bath", "ac"],
                        images: [],
                    },
                    {
                        id: "3",
                        name: "Garden Villa",
                        description: "A private sanctuary surrounded by lush tropical gardens with a personal infinity pool and outdoor dining area.",
                        basePrice: 899,
                        maxOccupancy: 6,
                        amenities: ["wifi", "tv", "coffee", "bath", "ac"],
                        images: [],
                    },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, [tenant]);



    const filteredRooms = rooms.filter(
        (room) =>
            room.basePrice >= filter.minPrice &&
            room.basePrice <= filter.maxPrice &&
            (filter.capacity === 0 || room.maxOccupancy >= filter.capacity)
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* HERO SECTION */}
            <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-10" />
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    <Image
                        src={PLACEHOLDER_IMAGE}
                        alt="Luxury Rooms"
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
                <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-amber-400 uppercase tracking-[0.3em] text-sm font-medium mb-4"
                    >
                        Accommodations
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl sm:text-5xl md:text-7xl font-serif font-light mb-4 md:mb-6"
                    >
                        Our Rooms & Suites
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-base md:text-xl text-white/80 max-w-2xl px-4"
                    >
                        Discover refined elegance and unparalleled comfort in our carefully curated collection of luxury accommodations.
                    </motion.p>
                </div>
            </section>

            {/* FILTER BAR */}
            <section className="sticky top-[5rem] z-30 bg-white border-b border-slate-200 shadow-sm">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Filter className="w-5 h-5" />
                            <span className="font-medium">Filter by:</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6">
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-slate-500 whitespace-nowrap">Price:</label>
                                <select
                                    className="flex-1 px-4 py-2.5 rounded-full border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 min-h-[44px]"
                                    onChange={(e) => {
                                        const [min, max] = e.target.value.split("-").map(Number);
                                        setFilter((f) => ({ ...f, minPrice: min, maxPrice: max }));
                                    }}
                                >
                                    <option value="0-5000">All Prices</option>
                                    <option value="0-300">Under $300</option>
                                    <option value="300-500">$300 - $500</option>
                                    <option value="500-5000">$500+</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-slate-500 whitespace-nowrap">Guests:</label>
                                <select
                                    className="flex-1 px-4 py-2.5 rounded-full border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 min-h-[44px]"
                                    onChange={(e) => setFilter((f) => ({ ...f, capacity: Number(e.target.value) }))}
                                >
                                    <option value="0">Any</option>
                                    <option value="2">2+ Guests</option>
                                    <option value="4">4+ Guests</option>
                                    <option value="6">6+ Guests</option>
                                </select>
                            </div>
                        </div>
                        <span className="text-sm text-slate-500 text-center sm:text-right">
                            {filteredRooms.length} {filteredRooms.length === 1 ? "room" : "rooms"} available
                        </span>
                    </div>
                </div>
            </section>

            {/* ROOMS GRID */}
            <section className="container mx-auto px-4 py-8 md:py-16">
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-slate-100 rounded-2xl h-[400px] animate-pulse" />
                        ))}
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        <p className="text-xl">No rooms match your criteria.</p>
                        <button
                            className="mt-4 text-amber-600 hover:underline"
                            onClick={() => setFilter({ minPrice: 0, maxPrice: 1000, capacity: 0 })}
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {filteredRooms.map((room, index) => (
                            <motion.div
                                key={room.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="group"
                            >
                                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100">
                                    {/* Image */}
                                    <div className="relative h-48 md:h-64 overflow-hidden">
                                        <Image
                                            src={room.images?.[0] || PLACEHOLDER_IMAGE}
                                            alt={room.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <span className="text-amber-600 font-semibold">${room.basePrice}</span>
                                            <span className="text-slate-400 text-sm">/night</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-amber-500 mb-2">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className="w-3 h-3 fill-current" />
                                            ))}
                                        </div>
                                        <h3 className="text-xl font-serif font-medium text-slate-800 mb-2">{room.name}</h3>
                                        <p className="text-slate-500 text-sm line-clamp-2 mb-4">{room.description}</p>

                                        {/* Amenities */}
                                        <div className="flex items-center gap-3 mb-4 text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                <span className="text-xs">{room.maxOccupancy}</span>
                                            </span>
                                            {room.amenities?.slice(0, 4).map((amenity) => (
                                                <span key={amenity} title={amenity}>
                                                    {AMENITY_ICONS[amenity.toLowerCase()] || amenity}
                                                </span>
                                            ))}
                                        </div>

                                        {/* CTA */}
                                        <Link href={`/${tenant}/book?roomTypeId=${room.id}`}>
                                            <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2 group/btn">
                                                Book Now
                                                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA BANNER */}
            <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-20">
                <div className="container mx-auto px-4 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-serif text-white mb-4"
                    >
                        Need Help Choosing?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-300 mb-8 max-w-xl mx-auto"
                    >
                        Our concierge team is available 24/7 to help you find the perfect accommodation for your stay.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link href={`/${tenant}/contact`}>
                            <button className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium transition-colors">
                                Contact Concierge
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
