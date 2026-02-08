"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
}

export function HistoryTimeline() {
    const events: TimelineEvent[] = [
        { year: "1985", title: "The Beginning", description: "Ceylon Paradise was founded with a vision to redefine luxury hospitality." },
        { year: "1995", title: "Expanding Horizons", description: "Expanded to Kandy and Negombo, bringing world-class service to more locations." },
        { year: "2010", title: "Sustainable Luxury", description: "Launched our green initiative, becoming the first carbon-neutral hotel chain in Sri Lanka." },
        { year: "2024", title: "Digital Transformation", description: "Embracing modern technology with our new digital guest experience." },
    ];

    return (
        <div className="py-20 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/50 to-transparent -translate-x-1/2" />

            <div className="space-y-24">
                {events.map((event, index) => (
                    <TimelineItem key={event.year} event={event} index={index} />
                ))}
            </div>
        </div>
    );
}

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const isEven = index % 2 === 0;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className={cn(
                "flex items-center justify-between w-full",
                isEven ? "flex-row" : "flex-row-reverse"
            )}
        >
            <div className="w-5/12 text-right px-8 py-4">
                {isEven ? (
                    <EventContent event={event} />
                ) : (
                    <div className="text-4xl font-serif text-primary/20 font-bold">{event.year}</div>
                )}
            </div>

            <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-primary shadow-lg border-4 border-white dark:border-zinc-900">
                <div className="w-2 h-2 bg-white rounded-full" />
            </div>

            <div className="w-5/12 text-left px-8 py-4">
                {!isEven ? (
                    <EventContent event={event} />
                ) : (
                    <div className="text-4xl font-serif text-primary/20 font-bold text-left">{event.year}</div>
                )}
            </div>
        </motion.div>
    );
}

function EventContent({ event }: { event: TimelineEvent }) {
    return (
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors">
            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
        </div>
    );
}
