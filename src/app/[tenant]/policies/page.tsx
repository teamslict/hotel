import { Link } from "@/i18n/routing";

export default async function PoliciesPage({ params }: { params: Promise<{ tenant: string }> }) {
    const { tenant } = await params;

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container max-w-4xl mx-auto px-4">
                <h1 className="text-4xl font-serif font-bold mb-8">Terms & Policies</h1>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Check-in & Check-out</h2>
                        <p className="text-muted-foreground">
                            Check-in time is from 2:00 PM. Check-out time is until 12:00 PM.
                            Early check-in and late check-out are subject to availability and may incur additional charges.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Cancellation Policy</h2>
                        <p className="text-muted-foreground">
                            cancellations made 48 hours prior to arrival used to be free of charge.
                            Cancellations made within 48 hours of arrival will be charged the first night's rate.
                            No-shows will be charged the full amount of the reservation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Children & Extra Beds</h2>
                        <p className="text-muted-foreground">
                            Children of all ages are welcome. Children aged 12 years and above are considered adults at this property.
                            Extra beds can be provided upon request for specific room types.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Pets</h2>
                        <p className="text-muted-foreground">
                            Pets are not allowed within the hotel premises, with the exception of service animals.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
                        <p className="text-muted-foreground">
                            We respect your privacy and are committed to protecting your personal data.
                            Please review our full <Link href="#" className="underline text-primary">Privacy Policy</Link> for details on how we collect and use your information.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
