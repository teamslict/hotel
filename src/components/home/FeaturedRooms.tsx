"use client";

import { useTranslations } from "next-intl";
import { RoomCard } from "@/components/booking/RoomCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface FeaturedRoomsProps {
    tenantId: string;
}

export function FeaturedRooms({ tenantId }: FeaturedRoomsProps) {
    // Mock data for now
    const rooms = [
        {
            id: "1",
            name: "Deluxe Ocean View",
            description: "Wake up to the sound of the waves in our spacious Deluxe Ocean View rooms.",
            price: 250,
            image: "https://images.unsplash.com/photo-1590490360182-f33d5e6a3853?q=80&w=2072&auto=format&fit=crop",
            maxGuests: 2,
        },
        {
            id: "2",
            name: "Luxury Suite",
            description: "Experience ultimate comfort with a separate living area and private balcony.",
            price: 450,
            image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=2070&auto=format&fit=crop",
            maxGuests: 4,
        },
        {
            id: "3",
            name: "Garden Villa",
            description: "A private sanctuary surrounded by lush tropical gardens.",
            price: 350,
            image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop",
            maxGuests: 3,
        },
        {
            id: "4",
            name: "Presidential Suite",
            description: "The epitome of luxury with panoramic views and exclusive amenities.",
            price: 1200,
            image: "https://images.unsplash.com/photo-1631049307264-da0f29c2622e?q=80&w=2070&auto=format&fit=crop",
            maxGuests: 5,
        },
    ];

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
                            <CarouselItem key={room.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                <div className="p-1 h-full">
                                    <RoomCard tenantId={tenantId} room={room} />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>
    );
}
