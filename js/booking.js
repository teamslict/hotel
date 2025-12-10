/**
 * Booking Simulation Script
 * Handles form interactions, validations, and simulated "backend" processing.
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log("Booking System Initialized");

    // 1. Handle "Check Availability" on Homepage
    // We look for the home page form by a unique characteristic or ID if we added one (we will add ID 'home-booking-form')
    const homeForm = document.getElementById('home-booking-form');
    if (homeForm) {
        homeForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const checkin = document.getElementById('checkin_date').value;
            const checkout = document.getElementById('checkout_date').value;
            const adults = document.getElementById('adults').value;
            const children = document.getElementById('children').value;

            // Simple validation
            if (!checkin || !checkout) {
                alert("Please select both check-in and check-out dates.");
                return;
            }

            // Redirect to reservation page with params
            // Using window.location.href to simulate navigation
            const params = new URLSearchParams({
                checkin: checkin,
                checkout: checkout,
                adults: adults,
                children: children
            });

            window.location.href = `reservation.html?${params.toString()}`;
        });
    }

    // 2. Handle Reservation Page Logic (Pre-fill & Submit)
    const reservationForm = document.getElementById('reservation-form'); // We will add this ID
    if (reservationForm) {
        // Pre-fill from URL params
        const params = new URLSearchParams(window.location.search);
        if (params.has('checkin')) document.getElementById('checkin_date').value = params.get('checkin');
        if (params.has('checkout')) document.getElementById('checkout_date').value = params.get('checkout');
        if (params.has('adults')) document.getElementById('adults').value = params.get('adults');
        if (params.has('children')) document.getElementById('children').value = params.get('children');

        // Handle Submission
        reservationForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simulate "Processing"
            const btn = reservationForm.querySelector('input[type="submit"]');
            const originalVal = btn.value;
            btn.value = "Processing...";
            btn.disabled = true;

            setTimeout(() => {
                // Success State
                // Hide form, show success message
                reservationForm.style.display = 'none';

                const successMsg = document.createElement('div');
                successMsg.className = 'alert alert-success text-center p-5';
                successMsg.innerHTML = `
                    <h2 class="mb-4">Reservation Confirmed!</h2>
                    <p class="lead">Thank you, <strong id="res-name">${document.getElementById('name').value}</strong>.</p>
                    <p>Your stay from <strong>${document.getElementById('checkin_date').value}</strong> to <strong>${document.getElementById('checkout_date').value}</strong> has been booked.</p>
                    <p>A confirmation email has been sent to <strong>${document.getElementById('email').value}</strong>.</p>
                    <a href="index.html" class="btn btn-primary mt-4">Return Home</a>
                `;

                // Insert after the form's parent container or replace the form
                reservationForm.parentNode.appendChild(successMsg);

                // Scroll to message
                successMsg.scrollIntoView({ behavior: 'smooth' });

            }, 1500); // 1.5s delay
        });
    }
});
