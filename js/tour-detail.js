/**
 * js/tour-detail.js - Logic Chi tiết Tour du lịch, Lịch trình & Đặt tour vào Giỏ Hàng
 */

let currentTour = null;
let adultCount = 1;
let childCount = 0;

document.addEventListener('DOMContentLoaded', async () => {
    await window.db.readyPromise;

    const urlParams = new URLSearchParams(window.location.search);
    const tourId = urlParams.get('id');

    if (!tourId) {
        showToast('Không tìm thấy thông tin tour!', 'error');
        setTimeout(() => window.location.href = 'tour.html', 1500);
        return;
    }

    // Lấy thông tin tour từ SQLite
    currentTour = await window.db.getTourById(tourId);
    if (!currentTour) {
        showToast('Tour du lịch không tồn tại!', 'error');
        setTimeout(() => window.location.href = 'tour.html', 1500);
        return;
    }

    // 1. Render Hero Banner
    renderTourHero(currentTour);

    // 2. Render Thông tin vận chuyển & Chuyến bay
    renderFlightTransportationMeta(currentTour);

    // 3. Render Lịch trình chi tiết các ngày (Itineraries)
    await renderTourItineraries(currentTour.id);

    // 4. Khởi tạo giá và bộ đếm
    updateTourPricing();
});

// Render Hero Banner
function renderTourHero(tour) {
    const heroBox = document.getElementById('tourHeroSection');
    if (!heroBox) return;

    heroBox.innerHTML = `
        <img src="${tour.thumbnail_url}" alt="${tour.title}" class="tour-detail-banner-img">
        <div class="tour-detail-hero-overlay">
            <span class="tour-duration-tag" style="position: static; margin-bottom: 12px; width: fit-content;">
                ⏱ ${tour.duration_text}
            </span>
            <h1 class="tour-detail-hero-title">${tour.title}</h1>
            <div class="tour-detail-quick-meta">
                <span>📍 Xuất phát: ${tour.origin}</span>
                <span>🎯 Điểm đến: ${tour.destination}</span>
                <span>⭐ ${tour.rating.toFixed(1)}/5 (${tour.reviews_count} đánh giá)</span>
                <span>✈️ Hãng bay: ${tour.agency_name} (${tour.airline_name})</span>
            </div>
        </div>
    `;
}

// Render thông tin vận chuyển & Hãng bay
function renderFlightTransportationMeta(tour) {
    const metaBox = document.getElementById('flightTourMeta');
    if (!metaBox) return;

    metaBox.innerHTML = `
        <div style="background: #f9fafb; padding: 14px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 12px;">Hãng Hàng Không Vận Chuyển:</div>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                <img src="${tour.airline_logo}" alt="${tour.airline_name}" style="height: 24px;">
                <strong style="color: #111827;">${tour.airline_name}</strong>
            </div>
        </div>

        <div style="background: #f9fafb; padding: 14px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 12px;">Loại Tàu Bay Phục Vụ:</div>
            <div style="margin-top: 4px;">
                <strong style="color: var(--vj-primary);">✈ ${tour.aircraft_type}</strong>
            </div>
        </div>

        <div style="background: #f9fafb; padding: 14px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 12px;">Hành Trình Bay:</div>
            <div style="margin-top: 4px;">
                <strong>${tour.origin} ⇄ ${tour.destination}</strong> (Khứ hồi)
            </div>
        </div>

        <div style="background: #f9fafb; padding: 14px; border-radius: 8px; border: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 12px;">Thời Gian Cất Cánh Dự Kiến:</div>
            <div style="margin-top: 4px;">
                <strong>${tour.departure_time_slot === 'morning' ? 'Buổi sáng (06:00 - 08:30)' : (tour.departure_time_slot === 'afternoon' ? 'Buổi chiều (13:00 - 15:30)' : 'Buổi tối (19:00 - 23:00)')}</strong>
            </div>
        </div>
    `;
}

// Render Lịch trình chi tiết các ngày (Itinerary Timeline)
async function renderTourItineraries(tourId) {
    const timelineBox = document.getElementById('tourItineraryTimeline');
    if (!timelineBox) return;

    const itineraries = await window.db.getTourItineraries(tourId);

    if (itineraries.length === 0) {
        // Lịch trình mẫu mặc định nếu tour chưa có record chi tiết
        timelineBox.innerHTML = `
            <div class="timeline-day-card">
                <span class="day-badge">NGÀY 1</span>
                <h4 class="day-title">Đón Khách Tại Sân Bay - Khởi Hành Hành Trình</h4>
                <p class="day-desc">Xe và Hướng dẫn viên đón quý khách tại sân bay, làm thủ tục chuyến bay Vietjet. Đến nơi, nhận phòng khách sạn tiêu chuẩn 4-5 sao nghỉ ngơi và ăn tối đặc sản địa phương.</p>
                <div class="day-meta-tags">
                    <span>🍽 Bữa ăn: Trưa, Tối</span>
                    <span>🏨 Lưu trú: Khách sạn 4-5 sao</span>
                </div>
            </div>
            <div class="timeline-day-card">
                <span class="day-badge">NGÀY 2</span>
                <h4 class="day-title">Khám Phá Các Danh Thắng Nổi Tiếng & Ẩm Thực</h4>
                <p class="day-desc">Đoàn dùng buffet sáng, sau đó lên xe khởi hành tham quan các địa danh du lịch biểu tượng, trải nghiệm văn hóa truyền thống, vui chơi giải trí và ngắm hoàng hôn rực rỡ.</p>
                <div class="day-meta-tags">
                    <span>🍽 Bữa ăn: Sáng, Trưa, Tối</span>
                    <span>🏨 Lưu trú: Khách sạn 4-5 sao</span>
                </div>
            </div>
            <div class="timeline-day-card">
                <span class="day-badge">NGÀY 3</span>
                <h4 class="day-title">Mua Sắm Đặc Sản - Chuyến Bay Về Điểm Xuất Phát</h4>
                <p class="day-desc">Tự do dạo chợ mua quà lưu niệm và đặc sản địa phương. Xe đưa đoàn ra sân bay làm thủ tục chuyến bay về lại điểm xuất phát. Kết thúc hành trình vui vẻ.</p>
                <div class="day-meta-tags">
                    <span>🍽 Bữa ăn: Sáng, Trưa</span>
                    <span>🏨 Lưu trú: Về điểm xuất phát</span>
                </div>
            </div>
        `;
        return;
    }

    timelineBox.innerHTML = itineraries.map(itin => `
        <div class="timeline-day-card">
            <span class="day-badge">NGÀY ${itin.day_number}</span>
            <h4 class="day-title">${itin.title}</h4>
            <p class="day-desc">${itin.description}</p>
            <div class="day-meta-tags">
                <span>🍽 Bữa ăn: ${itin.meals || 'Theo chương trình'}</span>
                <span>🏨 Lưu trú: ${itin.stay || 'Khách sạn tiêu chuẩn'}</span>
            </div>
        </div>
    `).join('');
}

// Thay đổi số lượng khách (Người lớn / Trẻ em)
function changeGuestCount(type, delta) {
    if (type === 'adult') {
        adultCount = Math.max(1, adultCount + delta);
        document.getElementById('adultCount').textContent = adultCount;
    } else if (type === 'child') {
        childCount = Math.max(0, childCount + delta);
        document.getElementById('childCount').textContent = childCount;
    }
    updateTourPricing();
}

// Tính toán lại tổng tiền tour
function updateTourPricing() {
    if (!currentTour) return;

    const basePrice = currentTour.price;
    const childPrice = Math.round(basePrice * 0.75);

    const total = (adultCount * basePrice) + (childCount * childPrice);

    document.getElementById('tourPriceDisplay').textContent = formatVND(basePrice);
    document.getElementById('tourTotalCalcPrice').textContent = formatVND(total);
}

// Thêm Tour vào Giỏ Hàng trong SQLite
async function saveTourToCart() {
    if (!currentTour) return;

    const basePrice = currentTour.price;
    const childPrice = Math.round(basePrice * 0.75);
    const total = (adultCount * basePrice) + (childCount * childPrice);
    const totalPassengers = adultCount + childCount;

    const passengersDetail = `${adultCount} Người lớn` + (childCount > 0 ? `, ${childCount} Trẻ em` : '');

    const cartItem = {
        item_type: 'tour',
        reference_id: currentTour.id,
        item_name: currentTour.title,
        ticket_class: 'tour_package',
        departure_date: 'Khởi hành hàng tuần',
        flight_or_duration: currentTour.duration_text,
        details: `Hành khách: ${passengersDetail} | Hãng bay: ${currentTour.airline_name} (${currentTour.aircraft_type}) | Điểm đi: ${currentTour.origin}`,
        price: basePrice,
        quantity: totalPassengers,
        total_amount: total
    };

    try {
        await window.db.addToCart(cartItem);
        showToast(`Đã thêm ${currentTour.title} vào Giỏ Hàng!`);
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1000);
    } catch (e) {
        console.error('Lỗi thêm tour vào giỏ hàng:', e);
        showToast('Không thể thêm vào giỏ hàng!', 'error');
    }
}
