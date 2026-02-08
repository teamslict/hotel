import { ContactForm } from "@/components/contact/ContactForm";
import { Mail, MapPin, Phone } from "lucide-react";

export default async function ContactPage({ params }: { params: Promise<{ tenant: string }> }) {
    const { tenant } = await params;
    const tenantName = tenant.charAt(0).toUpperCase() + tenant.slice(1);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Hero */}
            <section className="bg-zinc-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Contact Us</h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        We are here to assist you. Reach out to us for any inquiries or reservations.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-xl shadow-lg border">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                                <Phone className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Call Us</h3>
                            <p className="text-muted-foreground mb-4">Available 24/7 for reservations.</p>
                            <p className="text-lg font-medium">+94 11 234 5678</p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg border">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Email Us</h3>
                            <p className="text-muted-foreground mb-4">For general inquiries and feedback.</p>
                            <p className="text-lg font-medium">info@ceylonparadise.com</p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg border">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                            <p className="text-muted-foreground mb-4">Experience paradise in person.</p>
                            <p className="text-lg font-medium">123 Paradise Road, Galle, Sri Lanka</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <ContactForm />
                    </div>
                </div>

                {/* Map */}
                <div className="mt-12 rounded-xl overflow-hidden shadow-lg border h-[400px]">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63320.43002013146!2d80.1908337!3d6.0535185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae173bb6932fce3%3A0x4a35b903f9c64c03!2sGalle%2C%20Sri%20Lanka!5e0!3m2!1sen!2s!4v1652885329816!5m2!1sen!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
        </div>
    );
}
