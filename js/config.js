/**
 * Global Configuration for the Hotel Frontend
 * Defines API endpoints and dynamic Tenant resolution.
 */

const CONFIG = {
    // Automatically select API URL based on where the frontend is loaded
    API_BASE_URL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3000/api/public/hotel'     // Local Development
        : 'https://erp.slict.lk/api/public/hotel',     // Production (Vercel/Live)

    // REMOVED: TENANT_ID is no longer hardcoded here!
    // The tenantId is now resolved dynamically by theme.js based on subdomain.

    // Set to false for Live Mode
    USE_MOCK_FALLBACK: false,

    /**
     * Get the subdomain dynamically from the URL.
     * - For production: ceylon-paradise.hotels.myservice.com -> "ceylon-paradise"
     * - For local dev: Use query param ?subdomain=ceylon-paradise
     */
    getSubdomain: function () {
        const hostname = window.location.hostname;

        // Local development: use query parameter
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            const params = new URLSearchParams(window.location.search);
            const subdomain = params.get('subdomain');
            if (subdomain) {
                return subdomain;
            }
            // Fallback for local testing
            console.warn('[Config] No subdomain query param. Using "ceylon-paradise" as default.');
            return 'ceylon-paradise';
        }

        // Production: extract subdomain from hostname
        // e.g., "ceylon-paradise.hotels.myservice.com" -> "ceylon-paradise"
        const parts = hostname.split('.');
        if (parts.length >= 2) {
            // First part is the subdomain
            return parts[0];
        }

        // Custom domain case: look for subdomain via HTTP header (requires server-side setup)
        // For now, fallback to the full hostname as tenant identifier
        return hostname;
    }
};

// Mock Data for Testing (kept for fallback if enabled)
const MOCK_DATA = {
    ROOMS: [
        {
            id: '1',
            roomNumber: '101',
            roomType: 'Deluxe Suite',
            basePrice: 150.00,
            maxOccupancy: 2,
            amenities: ['Wifi', 'TV', 'AC', 'Ocean View'],
            images: ['images/img_1.jpg'],
            description: 'A beautiful view of the sea with modern amenities.',
            rates: [
                {
                    name: 'Member Rate - Room Only',
                    price: 128,
                    strikePrice: 150,
                    perks: ['Free cancellation until 6PM', 'Preferred Rate for Members'],
                    isMember: true
                },
                {
                    name: 'Flexible Rate',
                    price: 147,
                    strikePrice: 175,
                    perks: ['Free cancellation until 6PM'],
                    isMember: false
                }
            ]
        },
        {
            id: '2',
            roomNumber: '201',
            roomType: 'Family Room',
            basePrice: 300.00,
            maxOccupancy: 4,
            amenities: ['Wifi', 'Kitchen', 'Pool Access'],
            images: ['images/img_2.jpg'],
            description: 'Spacious comfort for the whole family.',
            rates: [
                {
                    name: 'Family Member Special',
                    price: 255,
                    strikePrice: 300,
                    perks: ['Kids eat free', 'Late Check-out'],
                    isMember: true
                },
                {
                    name: 'Standard Family',
                    price: 285,
                    strikePrice: 320,
                    perks: ['Breakfast included'],
                    isMember: false
                }
            ]
        }
    ]
};

