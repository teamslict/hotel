import { hotelApi } from "@/lib/api";
import { BookingForm } from "@/components/booking/BookingForm";
import { getTranslations } from "next-intl/server";
import { differenceInDays } from "date-fns";

export default async function BookingPage({
    params,
    searchParams,
}: {
    params: Promise<{ tenant: string; roomId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { tenant, roomId } = await params;
    const query = await searchParams;
    const t = await getTranslations("booking");

    const checkIn = query.checkIn as string;
    const checkOut = query.checkOut as string;

    if (!checkIn || !checkOut) {
        return <div className="p-8 text-center">Missing Dates</div>;
    }

    let offering = null;
    let error = null;

    try {
        offering = await hotelApi.getOffering(roomId, tenant);
    } catch (e) {
        console.error("Failed to fetch offering", e);
        error = "Room not found or unavailable.";
    }

    if (error || !offering) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Error</h1>
                <p className="text-muted-foreground">{error || "Offering not found"}</p>
            </div>
        );
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const nights = differenceInDays(endDate, startDate);
    const totalPrice = (offering.price || 0) * nights;

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-serif font-bold mb-8">{t("completeBooking")}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <BookingForm
                        tenantId={tenant}
                        roomId={offering.id}
                        offeringType={offering.type}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        price={totalPrice}
                        rateName="Standard Rate"
                    />
                </div>

                <div className="bg-zinc-50 p-6 rounded-lg sticky top-24 h-fit border">
                    <h3 className="font-bold text-lg mb-4">{t("summary")}</h3>

                    <div className="mb-4">
                        <h4 className="font-medium text-lg">{offering.name}</h4>
                        <p className="text-sm text-muted-foreground">{offering.description?.substring(0, 100)}...</p>
                    </div>

                    <div className="space-y-2 text-sm border-t pt-4">
                        <div className="flex justify-between">
                            <span>Check-in</span>
                            <span className="font-medium">{checkIn}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Check-out</span>
                            <span className="font-medium">{checkOut}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Nights</span>
                            <span className="font-medium">{nights}</span>
                        </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${totalPrice}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
