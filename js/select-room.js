/**
 * Select Room Logic
 * Fetches rooms and renders them in the 'Search Results' style.
 */

document.addEventListener('DOMContentLoaded', function () {
    // 1. Parse URL Params
    const params = new URLSearchParams(window.location.search);
    const checkin = params.get('checkin') || 'Selected Date';
    const checkout = params.get('checkout') || 'Selected Date';
    const adults = parseInt(params.get('adults') || 1);
    const children = parseInt(params.get('children') || 0);
    const totalGuests = adults + children;

    // 2. Update Header Summary
    document.getElementById('summary-guests').textContent = `${totalGuests} Guests`;
    document.getElementById('summary-checkin').textContent = checkin;
    document.getElementById('summary-checkout').textContent = checkout;

    // 3. Fetch Rooms
    fetchRoomsForSelection(checkin, checkout, totalGuests);
});

async function fetchRoomsForSelection(checkin, checkout, guests) {
    const container = document.getElementById('rooms-list-container');
    const loading = document.getElementById('results-loading');

    try {
        let rooms = [];
        // Attempt API Fetch
        try {
            const url = `${CONFIG.API_BASE_URL}/rooms?tenantId=${CONFIG.TENANT_ID}&checkIn=${checkin}&checkOut=${checkout}&guests=${guests}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('API Error');
            rooms = await response.json();
        } catch (e) {
            console.warn("Using Fallback Data", e);
            rooms = MOCK_DATA.ROOMS; // Fallback to config.js mock data
        }

        loading.style.display = 'none';
        renderRoomCards(container, rooms);

    } catch (error) {
        console.error('Error loading rooms:', error);

        let msg = "Could not connect to the Backend API.";
        if (error.message.includes("Network")) {
            msg += "\n\nPossible Causes:\n1. Backend is not running (check localhost:3000).\n2. CORS is blocking the request.\n3. URL is wrong.";
        }

        if (roomsContainer) roomsContainer.innerHTML = `<div class="col-12 text-center text-danger">
            <i class="ion-alert-circled" style="font-size: 40px;"></i>
            <p><strong>Connection Failed</strong></p>
            <small>${msg}</small><br>
            <small class="text-muted">Target: ${CONFIG.API_BASE_URL}</small>
        </div>`;
    }
}

function renderRoomCards(container, rooms) {
    container.innerHTML = '';

    rooms.forEach(room => {
        const imageUrl = room.images && room.images.length > 0 ? room.images[0] : 'images/placeholder.jpg';

        // Generate Rate Plans HTML from the 'rates' array provided by backend/mock
        let ratePlansHtml = '';
        if (room.rates && room.rates.length > 0) {
            ratePlansHtml = room.rates.map(rate => {
                const perksHtml = rate.perks.map(perk => `<div><i class="fa fa-check"></i> ${perk}</div>`).join('');

                return `
                    <div class="rate-plan-row">
                        <div class="rate-plan-info">
                            <div class="rate-name" style="${rate.isMember ? 'color: purple;' : 'color: #333;'}">${rate.name}</div>
                            <div class="rate-perks">
                                ${perksHtml}
                            </div>
                        </div>
                        <div class="rate-pricing">
                            ${rate.isMember ? '<span style="color: purple; font-weight:bold; letter-spacing: 1px;">MEMBER RATE</span>' : ''}
                            <span class="price-strike">$${rate.strikePrice}</span>
                            <span class="price-main" style="${rate.isMember ? 'color: purple;' : 'color: #333;'}">$${rate.price}</span>
                            <span class="price-unit">Per Night</span>
                            <button class="btn-book-rate" style="${rate.isMember ? '' : 'background-color:#333;'}" onclick="openBookingModal('${room.id}', '${encodeURIComponent(rate.name)}', ${rate.price})">Book Now</button>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            // Fallback if no rates are defined (legacy support)
            ratePlansHtml = `<div class="p-3">No specific rate plans available. Contact us for details.</div>`;
        }

        const card = `
        <div class="room-card" data-aos="fade-up">
            <div class="room-image-col">
                <img src="${imageUrl}" alt="${room.roomType}">
            </div>
            <div class="room-details-col">
                <!-- Header -->
                <div class="room-header">
                    <h3 class="room-title">${room.roomType}</h3>
                    <div class="room-tags">
                        <span>Cityscape View</span>
                        <span>King Bed</span>
                    </div>
                </div>
                
                <!-- Room Specs -->
                <div class="room-specs">
                    <span style="color:#d9534f; font-weight:bold;">High Demand</span>
                    <span class="spec-item"><i class="fa fa-bed"></i> 1 King bed</span>
                    <span class="spec-item"><i class="fa fa-users"></i> Sleeps ${room.maxOccupancy}</span>
                    <span class="spec-item"><i class="fa fa-expand"></i> 30 to 40 sq m</span>
                </div>

                <!-- Description & Amenities -->
                <p class="room-desc">${room.description}</p>
                <ul class="room-amenities-list">
                    ${room.amenities.slice(0, 4).map(a => `<li><i class="ion-android-star-outline"></i> ${a}</li>`).join('')}
                </ul>

                <!-- Rate Plans Container -->
                <div class="rate-plans-container">
                    ${ratePlansHtml}
                </div>
            </div>
        </div>
        `;

        container.insertAdjacentHTML('beforeend', card);
    });
}

function openBookingModal(roomId, rateName, price) {
    // 1. Populate Hidden Fields
    document.getElementById('booking-room-id').value = roomId;
    document.getElementById('booking-rate-name').decodeURIComponent ? decodeURIComponent(rateName) : rateName; // Decode if previously encoded
    document.getElementById('booking-rate-name').value = decodeURIComponent(rateName);
    document.getElementById('booking-price').value = price;

    // 2. Show Summary
    document.getElementById('modal-room-summary').innerHTML = `
        <strong>${decodeURIComponent(rateName)}</strong><br>
        Price: $${price} / night
    `;

    // 3. Show Modal
    $('#bookingModal').modal('show');
}

// Handle Direct Form Submission
document.getElementById('direct-booking-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = "Processing...";
    btn.disabled = true;

    const formData = {
        tenantId: CONFIG.TENANT_ID,
        roomId: document.getElementById('booking-room-id').value,
        rateName: document.getElementById('booking-rate-name').value,
        price: parseFloat(document.getElementById('booking-price').value),
        guestName: document.getElementById('guest-name').value,
        guestEmail: document.getElementById('guest-email').value,
        guestPhone: document.getElementById('guest-phone').value,
        checkIn: params.get('checkin') || '2025-01-01',
        checkOut: params.get('checkout') || '2025-01-02',
        guests: (parseInt(params.get('adults') || 1) + parseInt(params.get('children') || 0))
    };

    try {
        // API Call (Reusing logic from booking.js)
        const url = `${CONFIG.API_BASE_URL}/bookings`;
        let response;
        try {
            response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } catch (netErr) {
            if (CONFIG.USE_MOCK_FALLBACK) {
                response = { ok: true, json: async () => ({ bookingNumber: "MOCK-DIRECT-" + Math.floor(Math.random() * 1000), status: "CONFIRMED" }) };
            } else { throw netErr; }
        }

        if (response.ok) {
            const result = await response.json();
            // Success State - Replace Modal Content
            document.querySelector('#bookingModal .modal-body').innerHTML = `
                <div class="text-center text-success py-4">
                    <i class="ion-checkmark-circled" style="font-size: 50px;"></i>
                    <h3 class="mt-3">Confirmed!</h3>
                    <p>Booking #${result.bookingNumber}</p>
                    <p>We have sent a confirmation to <strong>${formData.guestEmail}</strong></p>
                    <button class="btn btn-primary mt-3" onclick="window.location.href='index.html'">Return Home</button>
                </div>
            `;
            // Hide close button/prevent close to force user to see success
            document.querySelector('#bookingModal .close').style.display = 'none';
        } else {
            alert("Booking failed. Please try again.");
            btn.innerText = originalText;
            btn.disabled = false;
        }

    } catch (error) {
        console.error(error);
        alert("System Error. Please try again.");
        btn.innerText = originalText;
        btn.disabled = false;
    }
});
