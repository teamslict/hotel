/**
 * Rooms Handler
 * Fetches room data from the API and renders it to the DOM.
 */

document.addEventListener('DOMContentLoaded', function () {
  const roomsContainer = document.getElementById('rooms-container');
  const homeContainer = document.getElementById('home-rooms-container');

  if (roomsContainer || homeContainer) {
    fetchRooms(roomsContainer, homeContainer);
  }
});

async function fetchRooms(roomsContainer, homeContainer) {
  // Show Loading
  if (roomsContainer) roomsContainer.innerHTML = '<div class="col-12 text-center"><p>Loading rooms...</p></div>';
  if (homeContainer) homeContainer.innerHTML = '<div class="col-12 text-center"><p>Loading offers...</p></div>';

  try {
    let rooms = [];

    try {
      const url = `${CONFIG.API_BASE_URL}/rooms?tenantId=${CONFIG.TENANT_ID}`;
      console.log(`Fetching rooms from: ${url}`);

      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      rooms = await response.json();

    } catch (apiError) {
      console.warn('API Fetch failed, using mock data:', apiError);
      if (CONFIG.USE_MOCK_FALLBACK) {
        rooms = MOCK_DATA.ROOMS;
      } else {
        rooms = [];
      }
    }

    if (roomsContainer) renderRoomsDetailed(roomsContainer, rooms);
    if (homeContainer) renderRoomsSimple(homeContainer, rooms.slice(0, 3)); // Show max 3 on home

  } catch (error) {
    console.error('Error loading rooms:', error);
  }
}

function renderRoomsDetailed(container, rooms) {
  container.innerHTML = '';
  if (rooms.length === 0) {
    container.innerHTML = '<div class="col-12 text-center"><p>No rooms available.</p></div>';
    return;
  }
  rooms.forEach(room => {
    const imageUrl = room.images && room.images.length > 0 ? room.images[0] : 'images/placeholder.jpg';
    const price = parseFloat(room.basePrice).toFixed(2);

    const roomHtml = `
          <div class="col-md-6 col-lg-4 mb-5" data-aos="fade-up">
            <div class="room">
              <figure class="img-wrap">
                <img src="${imageUrl}" alt="${room.roomType}" class="img-fluid mb-3">
              </figure>
              <div class="p-3 text-center room-info">
                <h2>${room.roomType}</h2>
                <div class="mb-3">
                    ${room.amenities.slice(0, 3).map(a => `<span class="badge badge-light mr-1">${a}</span>`).join('')}
                </div>
                <p>${room.description}</p>
                <span class="text-uppercase letter-spacing-1 font-weight-bold d-block mb-3">$${price} / per night</span>
                <a href="select-room.html?roomId=${room.id}&roomType=${encodeURIComponent(room.roomType)}" class="btn btn-primary text-white">Book Now</a>
              </div>
            </div>
          </div>
        `;
    container.insertAdjacentHTML('beforeend', roomHtml);
  });
}

function renderRoomsSimple(container, rooms) {
  container.innerHTML = '';
  if (rooms.length === 0) {
    container.innerHTML = '<div class="col-12 text-center"><p>No rooms available.</p></div>';
    return;
  }
  rooms.forEach(room => {
    const imageUrl = room.images && room.images.length > 0 ? room.images[0] : 'images/placeholder.jpg';
    const price = parseFloat(room.basePrice).toFixed(2);

    // Simple card for homepage
    const roomHtml = `
          <div class="col-md-6 col-lg-4" data-aos="fade-up">
            <a href="select-room.html?roomId=${room.id}&roomType=${encodeURIComponent(room.roomType)}" class="room">
              <figure class="img-wrap">
                <img src="${imageUrl}" alt="${room.roomType}" class="img-fluid mb-3">
              </figure>
              <div class="p-3 text-center room-info">
                <h2>${room.roomType}</h2>
                <span class="text-uppercase letter-spacing-1">$${price} / per night</span>
              </div>
            </a>
          </div>
        `;
    container.insertAdjacentHTML('beforeend', roomHtml);
  });
}
