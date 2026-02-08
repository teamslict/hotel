// Hotel Configuration Interface
// Matches the response from /api/public/hotel/config

export interface HotelConfig {
    tenantId: string;
    subdomain: string;
    config: {
        hotelName: string;
        tagline?: string;
        logoUrl?: string;
        faviconUrl?: string;
        primaryColor?: string;
        secondaryColor?: string;
        accentColor?: string;
        fontFamily?: string;
        currency?: string;
        heroImageUrl?: string;
        heroTitle?: string;
        heroSubtitle?: string;
        aboutUs?: string;
        contactEmail?: string;
        contactPhone?: string;
        address?: string;
        mapEmbedUrl?: string;
        facebookUrl?: string;
        instagramUrl?: string;
        twitterUrl?: string;
        youtubeUrl?: string;
        footerText?: string;
        metaTitle?: string;
        metaDescription?: string;
    };
}

export interface Room {
    id: string;
    name: string;
    description?: string;
    price: number;
    maxGuests: number;
    amenities: string[];
    images: string[];
    available: boolean;
}

export interface BookingFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests?: string;
    tenantId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
}
