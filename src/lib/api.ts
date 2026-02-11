const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface SearchParams {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    tenantId: string;
}

export interface Room {
    id: string;
    roomType: string;
    description: string;
    images: string[];
    maxOccupancy: number;
    rates: {
        ratePlanId: string;
        rateName: string;
        price: number;
        currency: string;
    }[];
}

export const hotelApi = {
    getConfig: async (tenant: string) => {
        const res = await fetch(`${API_BASE}/api/public/hotel/config?subdomain=${tenant}`);
        if (!res.ok) throw new Error('Failed to fetch config');
        return res.json();
    },

    searchRooms: async (params: SearchParams) => {
        const query = new URLSearchParams({
            checkIn: params.checkIn,
            checkOut: params.checkOut,
            adults: params.adults.toString(),
            children: params.children.toString(),
            tenantId: params.tenantId
        });
        const res = await fetch(`${API_BASE}/api/public/hotel/rooms?${query}`);
        if (!res.ok) throw new Error('Failed to search rooms');
        return res.json();
    },

    createBooking: async (data: any) => {
        const res = await fetch(`${API_BASE}/api/public/hotel/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to create booking');
        }
        return res.json();
    },

    getBranches: async (tenant: string) => {
        const res = await fetch(`${API_BASE}/api/public/hotel/branches?tenantId=${tenant}`);
        if (!res.ok) throw new Error('Failed to fetch branches');
        return res.json();
    },

    getOffering: async (id: string, tenant: string) => {
        const res = await fetch(`${API_BASE}/api/public/hotel/offerings/${id}?tenantId=${tenant}`);
        if (!res.ok) throw new Error('Failed to fetch offering details');
        return res.json();
    }
};
