"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { API_BASE } from "@/lib/api";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
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
import { useState } from "react";

const formSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export function ContactForm() {
    const t = useTranslations("contact");
    const params = useParams();
    const searchParams = useSearchParams();
    const tenant = params.tenant as string;
    const inquiryType = searchParams.get('inquiry') || 'General';

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            message: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        setError(null);

        try {
            const baseUrl = API_BASE === "" ? 'http://localhost:3000' : API_BASE;
            const response = await fetch(`${baseUrl}/api/public/hotel/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tenantId: tenant,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phone: values.phone,
                    message: values.message,
                    inquiryType: inquiryType,
                }),
            });

            if (response.ok) {
                setSuccess(true);
                form.reset();
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to send message. Please try again.');
            }
        } catch (err) {
            console.error('Error submitting contact form:', err);
            setError('Failed to send message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (success) {
        return (
            <div className="bg-green-50 p-8 rounded-lg text-center border border-green-200">
                <h3 className="text-xl font-bold text-green-700 mb-2">Message Sent!</h3>
                <p className="text-green-600">Thank you for contacting us. We will get back to you shortly.</p>
                <Button variant="outline" onClick={() => setSuccess(false)} className="mt-4">
                    Send Another Message
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg border">
            <h2 className="text-2xl font-serif font-bold mb-6">{t("title")}</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("name")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="First Name" autoComplete="given-name" {...field} />
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
                                    <FormLabel>{t("name")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Last Name" autoComplete="family-name" {...field} />
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
                                        <Input type="email" inputMode="email" autoComplete="email" placeholder="john@example.com" {...field} />
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
                                        <Input type="tel" inputMode="tel" autoComplete="tel" placeholder="+1 234 567 890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("message")}</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="How can we help you?" className="min-h-[150px]" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : t("send")}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
