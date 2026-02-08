"use client";

import { motion } from "framer-motion";

interface TeamMember {
    name: string;
    role: string;
    image: string;
}

export function TeamGrid() {
    const team: TeamMember[] = [
        { name: "John Doe", role: "General Manager", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop" },
        { name: "Jane Smith", role: "Executive Chef", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" },
        { name: "Mike Johnson", role: "Head of Concierge", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
                <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="group perspective-1000"
                >
                    <div className="relative w-full h-96 transition-all duration-500 transform style-preserve-3d group-hover:rotate-y-180">
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden">
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-xl shadow-lg" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 text-white rounded-b-xl backdrop-blur-sm">
                                <h3 className="font-bold text-lg">{member.name}</h3>
                                <p className="text-sm opacity-80">{member.role}</p>
                            </div>
                        </div>

                        {/* Back */}
                        <div className="absolute inset-0 h-full w-full bg-primary rounded-xl shadow-lg rotate-y-180 backface-hidden p-8 text-white flex flex-col justify-center items-center text-center">
                            <h3 className="font-bold text-2xl mb-2">{member.name}</h3>
                            <p className="font-medium mb-4">{member.role}</p>
                            <p className="text-sm opacity-90">"Dedicated to making your stay unforgettable."</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
