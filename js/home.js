/**
 * js/home.js - Logic cho Trang chủ Vietjet
 * Nạp dữ liệu từ SQLite (vietjet.db) và xử lý tìm kiếm chuyến bay
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Chờ CSDL SQLite khởi tạo xong
    await window.db.readyPromise;

    // 1. Nạp danh sách sân bay cho Search Box
    initAirportsDropdown();

    // 2. Thiết lập ngày mặc định
    initDefaultDates();

    // 3. Nạp 8 Tour nổi bật từ SQLite
    loadFeaturedTours();

    // 4. Nạp Logo các hãng hàng không từ SQLite
    loadAirlinesGrid();
});

// Chuyển đổi giữa Khứ hồi và Một chiều
function toggleTripType(type) {
    const returnInput = document.getElementById('searchReturnDate');
    const returnLabel = document.getElementById('returnDateLabel');
    if (type === 'one_way') {
        returnInput.disabled = true;
        returnInput.required = false;
        returnInput.style.opacity = '0.4';
        returnLabel.style.opacity = '0.4';
    } else {
        returnInput.disabled = false;
        returnInput.required = true;
        returnInput.style.opacity = '1';
        returnLabel.style.opacity = '1';
    }
}

// Khởi tạo ngày bay mặc định
function initDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 6);

    const formatDate = (d) => d.toISOString().split('T')[0];

    const departInput = document.getElementById('searchDepartDate');
    const returnInput = document.getElementById('searchReturnDate');

    if (departInput) {
        departInput.min = formatDate(today);
        departInput.value = '2026-11-15'; // Ngày mặc định theo bộ dữ liệu mẫu
    }
    if (returnInput) {
        returnInput.min = formatDate(tomorrow);
        returnInput.value = '2026-11-20';
    }
}

// Nạp các sân bay vào Select dropdowns
async function initAirportsDropdown() {
    const airports = await window.db.getAirports();
    const originSelect = document.getElementById('searchOrigin');
    const destSelect = document.getElementById('searchDestination');

    if (!originSelect || !destSelect) return;

    let optionsHtml = '';
    airports.forEach(ap => {
        optionsHtml += `<option value="${ap.code}">${ap.city} (${ap.code}) - ${ap.name}</option>`;
    });

    originSelect.innerHTML = optionsHtml;
    destSelect.innerHTML = optionsHtml;

    // Đặt mặc định TP.HCM đi Hà Nội
    originSelect.value = 'SGN';
    destSelect.value = 'HAN';
}

// Xử lý gửi form tìm kiếm
function handleSearchFlights(e) {
    e.preventDefault();

    const tripType = document.querySelector('input[name="search_trip_type"]:checked').value;
    const origin = document.getElementById('searchOrigin').value;
    const destination = document.getElementById('searchDestination').value;
    const departDate = document.getElementById('searchDepartDate').value;
    const returnDate = document.getElementById('searchReturnDate').value;
    const cabinClass = document.getElementById('searchCabinClass').value;

    if (origin === destination) {
        showToast('Điểm đến không được trùng với điểm xuất phát!', 'error');
        return;
    }

    const params = new URLSearchParams({
        from: origin,
        to: destination,
        depart: departDate,
        trip: tripType,
        cabin: cabinClass
    });

    if (tripType === 'round_trip' && returnDate) {
        params.append('return', returnDate);
    }

    // Điều hướng sang trang Chuyến bay kèm query parameters
    window.location.href = `flights.html?${params.toString()}`;
}

// Nạp 8 Tour Du Lịch Nổi Bật từ SQLite (Thumbnail 600x400)
async function loadFeaturedTours() {
    const container = document.getElementById('featuredToursGrid');
    if (!container) return;

    try {
        const tours = await window.db.getFeaturedTours();
        if (tours.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center;">Chưa có dữ liệu tour.</div>';
            return;
        }

        container.innerHTML = tours.map(tour => `
            <div class="tour-card">
                <div class="tour-thumbnail-wrap">
                    <img src="${tour.thumbnail_url}" 
                         alt="${tour.title}" 
                         class="tour-thumbnail"
                         width="600"
                         height="400"
                         loading="lazy">
                    <span class="tour-duration-tag">⏱ ${tour.duration_text}</span>
                </div>
                <div class="tour-card-body">
                    <div class="tour-agency-meta">
                        <span>✈️ ${tour.agency_name}</span>
                    </div>
                    <h3 class="tour-title" title="${tour.title}">${tour.title}</h3>
                    <div class="tour-rating">
                        <span>⭐ ${tour.rating.toFixed(1)}/5</span>
                        <span style="color: #9ca3af;">(${tour.reviews_count} đánh giá)</span>
                    </div>
                    <div class="tour-card-footer">
                        <div class="tour-price-group">
                            <span class="tour-price-label">Trọn gói từ:</span>
                            <span class="tour-price-num">${formatVND(tour.price)}</span>
                        </div>
                        <a href="tour-detail.html?id=${tour.id}" class="btn btn-primary btn-sm">Xem Tour</a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Lỗi nạp tour:', err);
    }
}

// Nạp Logo các Hãng hàng không đối tác từ SQLite
async function loadAirlinesGrid() {
    const container = document.getElementById('airlinesGrid');
    if (!container) return;

    try {
        const airlines = await window.db.getAirlines();
        container.innerHTML = airlines.map(airline => `
            <a href="flights.html?airline=${encodeURIComponent(airline.name)}" class="airline-card" title="Xem chuyến bay của ${airline.name}">
                <img src="${airline.logo_url}" alt="${airline.name}" loading="lazy">
                <span>${airline.name}</span>
            </a>
        `).join('');
    } catch (err) {
        console.error('Lỗi nạp danh sách hãng hàng không:', err);
    }
}
