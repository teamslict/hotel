import { create } from 'zustand';
import { HotelConfig } from '@/lib/types';

interface HotelConfigState {
    config: HotelConfig | null;
    loading: boolean;
    error: string | null;
    setConfig: (config: HotelConfig) => void;
    fetchConfig: (subdomain: string) => Promise<void>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const useHotelConfigStore = create<HotelConfigState>((set) => ({
    config: null,
    loading: true,
    error: null,

    setConfig: (config) => set({ config, loading: false }),

    fetchConfig: async (subdomain: string) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`${API_BASE}/api/public/hotel/config?subdomain=${subdomain}`);
            if (!res.ok) {
                throw new Error('Failed to fetch config');
            }
            const data = await res.json();
            set({ config: data, loading: false });
        } catch (error: any) {
            set({ error: error.message, loading: false });
        }
    },
}));
