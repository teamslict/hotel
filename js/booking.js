/**
 * Booking Handling Script
 * Integrates with the ERP API for reservations.
 */

document.addEventListener('DOMContentLoaded', function () {

    // 1. Handle Homepage Form (Redirects to Reservation)
    const homeForm = document.getElementById('home-booking-form');
    if (homeForm) {
        homeForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const checkin = document.getElementById('checkin_date').value;
            const checkout = document.getElementById('checkout_date').value;
            const adults = document.getElementById('adults').value;
            const children = document.getElementById('children').value;

            if (!checkin || !checkout) {
                alert("Please select dates.");
                return;
            }

            const params = new URLSearchParams({
                checkin, checkout, adults, children
            });
            // Redirect to the new Search Results / Select Room page
            window.location.href = `select-room.html?${params.toString()}`;
        });
    }

    // 2. Handle Reservation Form (API Submission)
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        // Pre-fill logic
        const params = new URLSearchParams(window.location.search);

        ['checkin', 'checkout', 'adults', 'children'].forEach(key => {
            if (params.has(key)) document.getElementById(key === 'checkin' ? 'checkin_date' : key === 'checkout' ? 'checkout_date' : key).value = params.get(key);
        });

        // Handle Room Pre-selection (if simulated or coming from Rooms page)
        const roomId = params.get('roomId');

        reservationForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Validate Dates
            const cin = new Date(document.getElementById('checkin_date').value);
            const cout = new Date(document.getElementById('checkout_date').value);

            if (cout <= cin) {
                alert("Check-out date must be after Check-in date.");
                return;
            }

            // Gather Data
            // Gather Data
            const formData = {
                tenantId: TENANT_ID || CONFIG.getSubdomain(), // Use dynamic tenant ID
                roomId: roomId || "default-room",
                rateName: params.get('rateName') || "Standard Rate", // Required by backend
                price: parseFloat(params.get('price')) || 0,
                guestName: document.getElementById('name').value,
                guestEmail: document.getElementById('email').value,
                guestPhone: document.getElementById('phone').value,
                checkIn: formatDate(document.getElementById('checkin_date').value),
                checkOut: formatDate(document.getElementById('checkout_date').value),
                guests: parseInt(document.getElementById('adults').value) + parseInt(document.getElementById('children').value)
            };

            const btn = reservationForm.querySelector('input[type="submit"]');
            const originalVal = btn.value;
            btn.value = "Processing...";
            btn.disabled = true;

            try {
                // API Call
                const url = `${CONFIG.API_BASE_URL}/bookings`;
                console.log('Sending booking request to:', url, formData);

                let response;
                try {
                    response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });
                } catch (netErr) {
                    // Network failed
                    if (CONFIG.USE_MOCK_FALLBACK) {
                        // Fake a success for demo
                        console.warn("Network failed, simulating success mock.");
                        response = {
                            ok: true,
                            json: async () => ({
                                id: "mock_123",
                                bookingNumber: "MOCK-BK-001",
                                status: "CONFIRMED",
                                totalAmount: 0
                            })
                        };
                    } else {
                        throw netErr;
                    }
                }

                if (response.ok) {
                    const result = await response.json();
                    showSuccess(result);
                } else {
                    const error = await response.json().catch(() => ({}));
                    if (response.status === 409) {
                        alert("Room already booked for these dates. Please choose another.");
                    } else {
                        alert("Booking failed: " + (error.message || "Unknown error"));
                    }
                    btn.value = originalVal;
                    btn.disabled = false;
                }

            } catch (error) {
                console.error('Booking Error:', error);
                alert("System Error: Could not connect to booking server.");
                btn.value = originalVal;
                btn.disabled = false;
            }
        });
    }
});

function showSuccess(data) {
    const reservationForm = document.getElementById('reservation-form');
    reservationForm.style.display = 'none';

    // Create or find message container
    let container = document.getElementById('booking-success-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'booking-success-container';
        reservationForm.parentNode.appendChild(container);
    }

    container.className = 'alert alert-success text-center p-5';
    container.innerHTML = `
        <h2 class="mb-4">Booking Confirmed!</h2>
        <p class="lead">Booking Number: <strong>${data.bookingNumber}</strong></p>
        <p>Status: ${data.status}</p>
        <a href="index.html" class="btn btn-primary mt-4">Return Home</a>
    `;

    container.scrollIntoView({ behavior: 'smooth' });
}

// Helper to format date if the datepicker format differs from API (YYYY-MM-DD)
// Assuming datepicker gives MM/DD/YYYY or similar, we might need parsing.
// For now, let's assume standard format or just pass through for the mock.
function formatDate(dateString) {
    // Convert "13 December, 2025" -> "2025-12-13"
    if (!dateString) return null;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString; // Fallback
    return d.toISOString().split('T')[0];
}
