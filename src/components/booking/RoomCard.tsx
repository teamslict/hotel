"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Tv, Coffee, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoomCardProps {
    tenantId: string;
    room: {
        id: string;
        name: string;
        description: string;
        price: number;
        image: string;
        maxGuests: number;
    };
}

export function RoomCard({ tenantId, room }: RoomCardProps) {
    const t = useTranslations("rooms"); // assuming 'rooms' namespace exists

    return (
        <Card className="overflow-hidden border-0 shadow-lg group hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            <div className="relative h-64 overflow-hidden">
                <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <Badge className="absolute top-4 right-4 bg-white/90 text-black hover:bg-white">
                    ${room.price} / night
                </Badge>
            </div>

            <CardHeader>
                <CardTitle className="font-serif text-xl">{room.name}</CardTitle>
            </CardHeader>

            <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {room.description}
                </p>

                <div className="flex gap-4 text-muted-foreground text-sm">
                    <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{room.maxGuests} Guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Wifi className="w-4 h-4" />
                        <span>Free Wifi</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-0">
                <Button asChild className="w-full">
                    <Link href={`/${tenantId}/booking/${room.id}`}>
                        Book Now
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
