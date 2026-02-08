import { hotelApi } from "@/lib/api";
import { RoomCard } from "@/components/booking/RoomCard";
import { getTranslations } from "next-intl/server";
import { format } from "date-fns";

export default async function SearchPage({
    params,
    searchParams,
}: {
    params: Promise<{ tenant: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { tenant } = await params;
    const query = await searchParams;
    const t = await getTranslations("booking");

    const checkIn = query.checkIn as string;
    const checkOut = query.checkOut as string;
    const adults = Number(query.adults || 2);
    const children = Number(query.children || 0);

    if (!checkIn || !checkOut) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">{t("selectDates")}</h1>
                <p className="text-muted-foreground mb-8">Please go back to home and select check-in and check-out dates.</p>
            </div>
        );
    }

    let rooms = [];
    let error = null;

    try {
        // Mocking response structure matching API
        const apiRooms = await hotelApi.searchRooms({
            checkIn,
            checkOut,
            adults,
            children,
            tenantId: tenant
        });

        // Transform API data to RoomCard props
        rooms = apiRooms.map((room: any) => {
            // Find lowest price
            const prices = room.rates?.map((r: any) => r.price) || [];
            const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

            return {
                id: room.id,
                name: room.roomType, // API returns roomType as name usually
                description: room.description || "Experience comfort and luxury.",
                price: minPrice,
                image: room.images?.[0] || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop", // Fallback image
                maxGuests: room.maxOccupancy || 2
            };
        });

    } catch (err) {
        console.error("Search Error:", err);
        error = "Failed to load rooms. Please try again.";
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold mb-2">Available Rooms</h1>
                <p className="text-muted-foreground">
                    {checkIn} - {checkOut} • {adults} Adults, {children} Children
                </p>
            </div>

            {error ? (
                <div className="p-8 border rounded-lg bg-red-50 text-red-600 text-center">
                    {error}
                </div>
            ) : rooms.length === 0 ? (
                <div className="p-12 text-center border rounded-lg bg-zinc-50">
                    <p className="text-xl text-muted-foreground">No rooms available for these dates.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.map((room: any) => (
                        <div key={room.id} className="h-full">
                            <RoomCard tenantId={tenant} room={room} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
