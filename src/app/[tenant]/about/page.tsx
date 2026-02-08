import { HistoryTimeline } from "@/components/about/HistoryTimeline";
import { TeamGrid } from "@/components/about/TeamGrid";
import { VideoModal } from "@/components/about/VideoModal";

export default async function AboutPage({ params }: { params: Promise<{ tenant: string }> }) {
    const { tenant } = await params;
    const tenantName = tenant.charAt(0).toUpperCase() + tenant.slice(1);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
                    alt="About Us"
                    className="w-full h-full object-cover absolute inset-0"
                />
                <div className="relative z-20 text-center text-white container px-4">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">Our Story</h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90">
                        A legacy of luxury, hospitality, and unforgettable moments.
                    </p>
                </div>
            </section>

            {/* Intro & Video */}
            <section className="py-24 bg-zinc-900 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-serif mb-8">Welcome to {tenantName}</h2>
                    <p className="max-w-3xl mx-auto text-lg text-zinc-400 mb-12 leading-relaxed">
                        Founded in 1985, {tenantName} has been a pioneer in luxury hospitality.
                        We believe in creating moments that last a lifetime, blending traditional Sri Lankan warmth with modern elegance.
                    </p>
                    <div className="flex justify-center">
                        <VideoModal />
                    </div>
                </div>
            </section>

            {/* History Timeline */}
            <section className="py-24 bg-zinc-50 dark:bg-black">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-serif text-center mb-16">Our Journey</h2>
                    <HistoryTimeline />
                </div>
            </section>

            {/* Team */}
            <section className="py-24 bg-white dark:bg-zinc-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-serif text-center mb-16">Meet The Team</h2>
                    <TeamGrid />
                </div>
            </section>
        </div>
    );
}
