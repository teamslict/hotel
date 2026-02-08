"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { hotelApi } from "@/lib/api";
import { useState } from "react";
import { useRouter } from "@/i18n/routing";

const formSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required"),
    specialRequests: z.string().optional(),
});

interface BookingFormProps {
    tenantId: string;
    roomId: string;
    offeringType: 'ROOM' | 'ROOM_TYPE'; // NEW
    checkIn: string;
    checkOut: string;
    price: number; // Verify price
    rateName: string;
}

export function BookingForm({ tenantId, roomId, offeringType, checkIn, checkOut, price, rateName }: BookingFormProps) {
    const t = useTranslations("booking");
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            specialRequests: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        setError(null);
        try {
            // Construct payload based on offering type
            const payload: any = {
                ...values,
                tenantId,
                checkIn,
                checkOut,
                price,
                rateName,
                adults: 2, // Todo: pass actual guests
                children: 0,
            };

            if (offeringType === 'ROOM_TYPE') {
                payload.roomTypeId = roomId; // The ID passed is a Type ID
            } else {
                payload.roomId = roomId; // The ID passed is a Room ID
            }

            await hotelApi.createBooking(payload);

            router.push(`/${tenantId}/booking/confirmation`);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold mb-6">{t("guestDetails")}</h2>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 text-sm">
                    {error}
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("firstName")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("lastName")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("email")}</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="john@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("phone")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+1 234 567 890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="specialRequests"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("specialRequests")}</FormLabel>
                                <FormControl>
                                    <Textarea placeholder={t("specialRequestsPlaceholder")} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? t("processing") : t("confirmBooking")}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
