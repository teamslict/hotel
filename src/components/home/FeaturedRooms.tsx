"use client";

import { RoomCard } from "@/components/booking/RoomCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

interface Room {
    id: string;
    name: string;
    description: string | null;
    images: string[];
    basePrice: number;
    maxOccupancy: number;
    amenities: string[];
    slug: string;
}

interface FeaturedRoomsProps {
    tenantId: string;
}

export function FeaturedRooms({ tenantId }: FeaturedRoomsProps) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRooms() {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
                const res = await fetch(`${apiUrl}/api/public/hotel/room-types?tenantId=${tenantId}&featured=true`);
                if (res.ok) {
                    const data = await res.json();
                    setRooms(data);
                }
            } catch (error) {
                console.error("Failed to fetch featured rooms", error);
            } finally {
                setLoading(false);
            }
        }

        fetchRooms();
    }, [tenantId]);

    if (loading) {
        return <div className="py-20 text-center">Loading featured rooms...</div>;
    }

    if (rooms.length === 0) return null;

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Featured Rooms</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Select from our wide range of rooms and suites designed for your comfort.
                    </p>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full max-w-6xl mx-auto"
                >
                    <CarouselContent className="-ml-4">
                        {rooms.map((room) => (
                            <CarouselItem key={room.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                                <div className="p-1 h-full">
                                    <RoomCard tenantId={tenantId} room={room} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                </Carousel>
            </div>
        </section>
    );
}
