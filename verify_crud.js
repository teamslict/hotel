
const https = require('https');

// Reverting to User provided path to debug redirect
const apiBase = 'https://erp.slict.lk/api/hotel';

// Tenant ID as per config
const tenantId = 'ceylon-paradise';

// Confirming verify_crud.js matches new frontend logic
global.testPrice = 100; // Define global.testPrice for the test

function request(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: 443,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        resolve(body);
                    }
                } else {
                    reject({ status: res.statusCode, body: body, headers: res.headers });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    console.log("Starting ROOM CRUD Verification...");
    console.log(`Target: ${apiBase}/rooms`);

    let createdRoomId = null;

    // 1. LIST ROOMS (GET)
    try {
        console.log(`\n[LIST] Fetching rooms...`);
        const rooms = await request(`${apiBase}/rooms?tenantId=${tenantId}`);
        console.log(`[LIST] Success. Count: ${rooms.length}`);
    } catch (e) {
        console.error(`[LIST] Failed: ${e.status}`);
        if (e.headers && e.headers.location) console.log(`[LIST] Redirect Location: ${e.headers.location}`);
    }

    // 2. CREATE ROOM (POST)
    try {
        console.log(`\n[CREATE] Creating Test Room...`);
        const payload = {
            tenantId: tenantId,
            roomNumber: "TEST-999",
            roomType: "Automated Test Suite",
            basePrice: 150,
            floor: 1,
            bedType: "King",
            maxOccupancy: 2,
            amenities: ["Wifi", "Test Amenity"],
            description: "Temporary room for CRUD verification.",
            images: []
        };

        const res = await request(`${apiBase}/rooms`, 'POST', payload);
        console.log(`[CREATE] Success.`);
        createdRoomId = res.id; // Assuming response contains { id: ... }
        console.log(`[CREATE] New Room ID: ${createdRoomId}`);
    } catch (e) {
        console.error(`[CREATE] Failed: ${e.status}`);
        if (e.headers && e.headers.location) console.log(`[CREATE] Redirect Location: ${e.headers.location}`);
        return; // Cannot proceed without ID
    }

    if (!createdRoomId) {
        console.error("No Room ID returned from Create. Aborting.");
        return;
    }

    // 3. GET DETAILS (GET)
    try {
        console.log(`\n[DETAILS] Fetching Room ${createdRoomId}...`);
        const room = await request(`${apiBase}/rooms/${createdRoomId}`);
        console.log(`[DETAILS] Success. Room Number: ${room.roomNumber}`);
    } catch (e) {
        console.error(`[DETAILS] Failed: ${e.status} ${e.body}`);
    }

    // 4. UPDATE ROOM (PATCH)
    try {
        console.log(`\n[UPDATE] Updating Room ${createdRoomId}...`);
        const updatePayload = {
            basePrice: 200,
            description: "Updated Description"
        };
        await request(`${apiBase}/rooms/${createdRoomId}`, 'PATCH', updatePayload);
        console.log(`[UPDATE] Success.`);
    } catch (e) {
        console.error(`[UPDATE] Failed: ${e.status} ${e.body}`);
    }

    // 5. DELETE ROOM (DELETE)
    try {
        console.log(`\n[DELETE] Deleting Room ${createdRoomId}...`);
        await request(`${apiBase}/rooms/${createdRoomId}`, 'DELETE');
        console.log(`[DELETE] Success.`);
    } catch (e) {
        console.error(`[DELETE] Failed: ${e.status} ${e.body}`);
    }
}

runTests();
