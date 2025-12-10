/**
 * Global Configuration for the Hotel Frontend
 * Defines API endpoints and Tenant configuration.
 */

const CONFIG = {
    // Live Backend URL
    API_BASE_URL: 'https://erp.slict.lk/api/public/hotel',

    // Your Tenant ID
    TENANT_ID: 'ceylon-paradise',

    // Set to false for Live Mode
    USE_MOCK_FALLBACK: false
};

// Mock Data for Testing (as per guide)
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
        },
        {
            id: '3',
            roomNumber: '305',
            roomType: 'Presidential Suite',
            basePrice: 500.00,
            maxOccupancy: 2,
            amenities: ['Jacuzzi', 'Private Butler', 'Panoramic View'],
            images: ['images/img_3.jpg'],
            description: 'The ultimate in luxury and privacy.',
            rates: [
                {
                    name: 'VIP Member Exclusive',
                    price: 450,
                    strikePrice: 500,
                    perks: ['Private Butler', 'Lounge Access', 'Champagne on arrival'],
                    isMember: true
                }
            ]
        }
    ]
};
