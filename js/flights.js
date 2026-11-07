/**
 * js/flights.js - Logic hiển thị và lọc chuyến bay từ SQLite
 */

let currentSearchParams = {};

document.addEventListener('DOMContentLoaded', async () => {
    await window.db.readyPromise;

    // Đọc URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    currentSearchParams = {
        origin: urlParams.get('from') || '',
        destination: urlParams.get('to') || '',
        departDate: urlParams.get('depart') || '',
        tripType: urlParams.get('trip') || 'all',
        airline: urlParams.get('airline') || '',
        cabin: urlParams.get('cabin') || 'economy'
    };

    // Cập nhật Banner tiêu đề hành trình
    updateHeaderBanner();

    // Nạp danh sách checkbox hãng bay
    await initAirlineFilters();

    // Đồng bộ trạng thái bộ lọc từ URL
    syncFiltersFromURL();

    // Nạp và render chuyến bay
    await applyFlightFilters();
});

// Cập nhật tiêu đề hành trình trên header
async function updateHeaderBanner() {
    const headerTitle = document.getElementById('headerRouteText');
    const headerSub = document.getElementById('headerSubText');
    if (!headerTitle) return;

    if (currentSearchParams.origin && currentSearchParams.destination) {
        headerTitle.textContent = `Chuyến Bay: ${currentSearchParams.origin} ➔ ${currentSearchParams.destination}`;
        headerSub.textContent = `Ngày khởi hành: ${currentSearchParams.departDate || 'Tất cả các ngày'} | Loại vé: ${currentSearchParams.tripType === 'round_trip' ? 'Khứ hồi' : 'Một chiều'}`;
    } else if (currentSearchParams.airline) {
        headerTitle.textContent = `Chuyến Bay Của Hãng: ${currentSearchParams.airline}`;
        headerSub.textContent = 'Danh sách đường bay chọn lọc với giá vé tốt nhất';
    } else {
        headerTitle.textContent = 'Tất Cả Các Chuyến Bay Khả Dụng';
        headerSub.textContent = 'So sánh và lựa chọn hành trình phù hợp nhất';
    }
}

// Nạp danh sách hãng bay vào sidebar bộ lọc
async function initAirlineFilters() {
    const container = document.getElementById('filterAirlinesList');
    if (!container) return;

    const airlines = await window.db.getAirlines();
    container.innerHTML = airlines.map(al => `
        <label class="filter-item-label">
            <input type="checkbox" name="filter_airline" value="${al.name}" onchange="applyFlightFilters()">
            ${al.name}
        </label>
    `).join('');
}

// Đồng bộ bộ lọc với query params từ URL
function syncFiltersFromURL() {
    if (currentSearchParams.tripType && currentSearchParams.tripType !== 'all') {
        const tripRadio = document.querySelector(`input[name="filter_trip_type"][value="${currentSearchParams.tripType}"]`);
        if (tripRadio) tripRadio.checked = true;
    }

    if (currentSearchParams.airline) {
        const airlineCb = document.querySelector(`input[name="filter_airline"][value="${currentSearchParams.airline}"]`);
        if (airlineCb) airlineCb.checked = true;
    }

    if (currentSearchParams.cabin) {
        const cabinRadio = document.querySelector(`input[name="filter_cabin"][value="${currentSearchParams.cabin}"]`);
        if (cabinRadio) cabinRadio.checked = true;
    }
}

// Áp dụng các bộ lọc và nạp lại danh sách từ SQLite
async function applyFlightFilters() {
    const listContainer = document.getElementById('flightsList');
    const countDisplay = document.getElementById('flightResultCount');

    // 1. Sắp xếp giá
    const sortBy = document.querySelector('input[name="filter_sort"]:checked')?.value || 'price_asc';

    // 2. Loại vé
    const tripType = document.querySelector('input[name="filter_trip_type"]:checked')?.value || 'all';

    // 3. Số chặng bay (Direct / Multi)
    const isDirectChecked = document.getElementById('filterDirect')?.checked;
    const isMultiChecked = document.getElementById('filterMulti')?.checked;
    let isDirect = null;
    if (isDirectChecked && !isMultiChecked) isDirect = 1;
    if (!isDirectChecked && isMultiChecked) isDirect = 0;

    // 4. Hãng bay
    const selectedAirlines = Array.from(document.querySelectorAll('input[name="filter_airline"]:checked')).map(el => el.value);

    // 5. Khung giờ bay
    const selectedTimeSlots = Array.from(document.querySelectorAll('input[name="filter_time_slot"]:checked')).map(el => el.value);

    // 6. Hạng ghế hiển thị giá
    const selectedCabin = document.querySelector('input[name="filter_cabin"]:checked')?.value || 'economy';

    // Xây dựng điều kiện lọc
    const filterQuery = {
        origin: currentSearchParams.origin || null,
        destination: currentSearchParams.destination || null,
        tripType: tripType !== 'all' ? tripType : null,
        isDirect: isDirect,
        timeSlots: selectedTimeSlots.length > 0 ? selectedTimeSlots : null,
        sortBy: sortBy
    };

    try {
        let flights = await window.db.getFlights(filterQuery);

        // Lọc thêm theo mảng hãng bay nếu người dùng chọn
        if (selectedAirlines.length > 0) {
            flights = flights.filter(f => selectedAirlines.includes(f.airline_name));
        }

        countDisplay.textContent = flights.length;

        if (flights.length === 0) {
            listContainer.innerHTML = `
                <div style="background: #ffffff; border: 1px dashed #d1d5db; border-radius: 12px; padding: 40px; text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 12px;">✈️</div>
                    <h3 style="font-size: 18px; margin-bottom: 8px;">Không tìm thấy chuyến bay phù hợp</h3>
                    <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">Vui lòng thử điều chỉnh lại bộ lọc hoặc chọn chặng bay khác.</p>
                    <button class="btn btn-primary btn-sm" onclick="resetFlightFilters()">Đặt lại bộ lọc</button>
                </div>
            `;
            return;
        }

        // Render danh sách chuyến bay
        listContainer.innerHTML = flights.map(flight => {
            const price = selectedCabin === 'business' ? flight.price_business : flight.price_economy;
            const cabinLabel = selectedCabin === 'business' ? 'Thương Gia' : 'Phổ Thông';

            let amenitiesObj = {};
            try {
                amenitiesObj = typeof flight.amenities === 'string' ? JSON.parse(flight.amenities) : (flight.amenities || {});
            } catch (e) {
                amenitiesObj = {};
            }

            return `
                <div class="flight-card">
                    <!-- Hãng bay & Số hiệu -->
                    <div class="flight-airline-col">
                        <img src="${flight.airline_logo}" alt="${flight.airline_name}" class="airline-thumb" loading="lazy">
                        <div class="flight-name">${flight.airline_name}</div>
                        <span class="flight-number-tag">${flight.flight_number}</span>
                    </div>

                    <!-- Thời gian & Hành trình -->
                    <div class="flight-timeline-col">
                        <div class="time-point">
                            <div class="time-val">${flight.departure_time}</div>
                            <div class="airport-code">${flight.origin_code}</div>
                            <div class="city-name">${flight.origin_city}</div>
                        </div>

                        <div class="flight-duration-block">
                            <span class="duration-text">${flight.duration}</span>
                            <div class="duration-line"></div>
                            <span class="direct-flight-badge">${flight.is_direct ? '✓ Bay thẳng' : '1 điểm dừng'}</span>
                        </div>

                        <div class="time-point">
                            <div class="time-val">${flight.arrival_time}</div>
                            <div class="airport-code">${flight.dest_code}</div>
                            <div class="city-name">${flight.dest_city}</div>
                        </div>
                    </div>

                    <!-- Giá vé & Nút chọn -->
                    <div class="flight-action-col">
                        <span class="price-start-label">Giá Hạng ${cabinLabel}:</span>
                        <div class="flight-card-price">${formatVND(price)}</div>
                        <span class="aircraft-badge">✈ ${flight.aircraft_type}</span>
                        <a href="flight-detail.html?id=${flight.id}&cabin=${selectedCabin}" class="btn btn-primary btn-sm" style="margin-top: 5px;">
                            Chọn Chuyến Bay
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Lỗi lọc chuyến bay:', err);
    }
}

// Đặt lại toàn bộ bộ lọc
function resetFlightFilters() {
    const sortAsc = document.querySelector('input[name="filter_sort"][value="price_asc"]');
    if (sortAsc) sortAsc.checked = true;

    const tripAll = document.querySelector('input[name="filter_trip_type"][value="all"]');
    if (tripAll) tripAll.checked = true;

    const direct = document.getElementById('filterDirect');
    if (direct) direct.checked = true;
    const multi = document.getElementById('filterMulti');
    if (multi) multi.checked = false;

    document.querySelectorAll('input[name="filter_airline"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="filter_time_slot"]').forEach(cb => cb.checked = true);

    const cabinEco = document.querySelector('input[name="filter_cabin"][value="economy"]');
    if (cabinEco) cabinEco.checked = true;

    currentSearchParams = {};
    updateHeaderBanner();
    applyFlightFilters();
}
