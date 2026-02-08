import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin } from "lucide-react";
import { Link } from "@/i18n/routing";

interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    image: string;
    category: string;
    description: string;
}

const events: Event[] = [
    {
        id: "1",
        title: "Jazz Night by the Beach",
        date: "Every Friday, 7:00 PM",
        location: "Ocean Lounge",
        image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1974&auto=format&fit=crop",
        category: "Music",
        description: "Enjoy smooth jazz tunes with your favorite cocktails under the stars."
    },
    {
        id: "2",
        title: "Sri Lankan Food Festival",
        date: "March 15-20, 2026",
        location: "Main Restaurant",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop",
        category: "Dining",
        description: "A culinary journey through the authentic flavors of Sri Lanka."
    },
    {
        id: "3",
        title: "Yoga Retreat Weekend",
        date: "April 10-12, 2026",
        location: "Garden Pavilion",
        image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop",
        category: "Wellness",
        description: "Rejuvenate your mind and body with our expert yoga instructors."
    }
];

export default async function EventsPage({ params }: { params: Promise<{ tenant: string }> }) {
    const { tenant } = await params;

    return (
        <div className="min-h-screen bg-background pb-24">
            <section className="bg-zinc-900 text-white py-20 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Events & Happenings</h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Discover exceptional experiences curated just for you.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event.id} className="group bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <Badge className="absolute top-4 left-4 bg-white/90 text-black hover:bg-white">
                                    {event.category}
                                </Badge>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center text-sm text-muted-foreground mb-3 gap-4">
                                    <div className="flex items-center gap-1">
                                        <CalendarDays className="w-4 h-4" />
                                        <span>{event.date}</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">
                                    {event.title}
                                </h3>

                                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                                    <MapPin className="w-4 h-4" />
                                    <span>{event.location}</span>
                                </div>

                                <p className="text-muted-foreground mb-6 line-clamp-2">
                                    {event.description}
                                </p>

                                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                                    View Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
