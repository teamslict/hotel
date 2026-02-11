"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { User, Bed, Maximize2, Star, ChevronRight, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoomCardProps {
    tenantId: string;
    room: {
        id: string;
        name: string;
        description: string | null | undefined;
        price?: number;
        basePrice?: number;
        image?: string;
        images?: string[];
        maxGuests?: number;
        maxOccupancy?: number;
        bedType?: string | null;
        sizeSqM?: number | null;
        totalRooms?: number;
        availableRooms?: number;
        amenities?: string[];
    };
}

export function RoomCard({ tenantId, room }: RoomCardProps) {
    const t = useTranslations("rooms");
    const available = room.availableRooms ?? 0;
    const hasAvailability = available > 0;

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 group h-full flex flex-col">
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={room.images?.[0] || room.image || "https://images.unsplash.com/photo-1590490360182-f33d5e6a3853?w=800&q=80"}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-amber-600 font-semibold">${room.basePrice || room.price}</span>
                    <span className="text-slate-400 text-sm">/night</span>
                </div>
                {room.totalRooms !== undefined && (
                    <Badge
                        className={`absolute top-4 left-4 shadow-md px-3 py-1.5 text-xs rounded-lg ${hasAvailability
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white border-0"
                            : "bg-red-500 hover:bg-red-600 text-white border-0"
                            }`}
                    >
                        {hasAvailability ? `${available} Available` : "Fully Booked"}
                    </Badge>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3 h-3 fill-current" />
                    ))}
                </div>
                <h3 className="text-xl font-serif font-medium text-slate-800 mb-2">{room.name}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                    {room.description || "No description available."}
                </p>

                {/* Amenities */}
                <div className="flex items-center gap-3 mb-4 text-slate-400">
                    <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span className="text-xs">{room.maxOccupancy || room.maxGuests}</span>
                    </span>
                    {room.bedType && (
                        <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            <span className="text-xs">{room.bedType}</span>
                        </span>
                    )}
                    {room.amenities?.slice(0, 3).map((amenity) => (
                        <span key={amenity} className="flex items-center gap-1">
                            <Wifi className="w-4 h-4" />
                            <span className="text-xs">{amenity}</span>
                        </span>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-auto">
                    <Link href={`/${tenantId}/book?service=room&roomTypeId=${room.id}`}>
                        <button
                            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!hasAvailability && room.totalRooms !== undefined}
                        >
                            {hasAvailability || room.totalRooms === undefined ? "Book Now" : "Fully Booked"}
                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
