"use client";

import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Play } from "lucide-react";

export function VideoModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-8 py-4 rounded-full hover:bg-white/20 transition-all text-white group border border-white/20">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-1" />
                    </div>
                    <span className="font-medium text-lg tracking-wide">Watch Our Story</span>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl p-0 bg-black border-none text-white">
                <DialogTitle className="sr-only">Hotel Story Video</DialogTitle>
                <div className="aspect-video w-full rounded-lg overflow-hidden">
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
                        title="Hotel Story"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
