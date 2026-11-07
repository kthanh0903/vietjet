/**
 * js/flight-detail.js - Logic Chi tiết chuyến bay & Bảng chọn hạng vé
 */

let currentFlight = null;
let selectedTier = 'economy';

document.addEventListener('DOMContentLoaded', async () => {
    await window.db.readyPromise;

    // Lấy flight id và cabin từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const flightId = urlParams.get('id');
    const initialCabin = urlParams.get('cabin') || 'economy';

    if (!flightId) {
        showToast('Không tìm thấy mã chuyến bay!', 'error');
        setTimeout(() => window.location.href = 'flights.html', 1500);
        return;
    }

    // Lấy chi tiết từ SQLite
    currentFlight = await window.db.getFlightById(flightId);
    if (!currentFlight) {
        showToast('Chuyến bay không tồn tại!', 'error');
        setTimeout(() => window.location.href = 'flights.html', 1500);
        return;
    }

    // Render thông tin tổng quan
    renderFlightOverview(currentFlight);

    // Cập nhật giá vé lên 2 thẻ
    document.getElementById('ecoPriceVal').textContent = formatVND(currentFlight.price_economy);
    document.getElementById('bizPriceVal').textContent = formatVND(currentFlight.price_business);

    // Kích hoạt hạng vé mặc định
    selectTier(initialCabin);
});

// Render khung tổng quan hành trình
function renderFlightOverview(flight) {
    const box = document.getElementById('flightOverviewBox');
    if (!box) return;

    box.innerHTML = `
        <div class="route-header-banner">
            <div>
                <div class="route-cities">${flight.origin_city} ➔ ${flight.dest_city}</div>
                <div style="font-size: 14px; color: #6b7280; margin-top: 4px;">
                    ${flight.origin_name} (${flight.origin_code}) đến ${flight.dest_name} (${flight.dest_code})
                </div>
            </div>
            <div class="aircraft-type-highlight">
                ✈ ${flight.aircraft_type}
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 200px 1fr; gap: 24px; align-items: center;">
            <div style="display: flex; align-items: center; gap: 14px;">
                <img src="${flight.airline_logo}" alt="${flight.airline_name}" style="height: 50px; object-fit: contain;">
                <div>
                    <strong style="font-size: 16px;">${flight.airline_name}</strong>
                    <div style="font-size: 13px; color: #6b7280;">Số hiệu: <span style="color: var(--vj-primary); font-weight: 700;">${flight.flight_number}</span></div>
                </div>
            </div>

            <div style="display: flex; justify-content: space-around; align-items: center; background: #f9fafb; padding: 16px 20px; border-radius: 12px; border: 1px solid #e5e7eb;">
                <div style="text-align: center;">
                    <div style="font-size: 22px; font-weight: 800;">${flight.departure_time}</div>
                    <div style="font-size: 13px; color: #6b7280;">${flight.origin_code}</div>
                    <div style="font-size: 12px; color: #9ca3af;">${flight.departure_date}</div>
                </div>

                <div style="text-align: center;">
                    <span style="font-size: 12px; font-weight: 600; color: #4b5563;">Thời gian bay: ${flight.duration}</span>
                    <div style="width: 120px; height: 2px; background: #d1d5db; margin: 4px auto; position: relative;">
                        <span style="position: absolute; top: -8px; left: 50%; transform: translateX(-50%); background: #f9fafb; padding: 0 4px; font-size: 12px; color: var(--vj-primary);">✈</span>
                    </div>
                    <span style="font-size: 11px; color: #10b981; font-weight: 700;">Bay thẳng</span>
                </div>

                <div style="text-align: center;">
                    <div style="font-size: 22px; font-weight: 800;">${flight.arrival_time}</div>
                    <div style="font-size: 13px; color: #6b7280;">${flight.dest_code}</div>
                    <div style="font-size: 12px; color: #9ca3af;">${flight.departure_date}</div>
                </div>
            </div>
        </div>
    `;
}

// Chuyển đổi chọn Hạng Phổ Thông hoặc Hạng Thương Gia
function selectTier(tier) {
    selectedTier = tier;
    const cardEco = document.getElementById('cardEco');
    const cardBiz = document.getElementById('cardBiz');
    const btnEcoLabel = document.getElementById('btnEcoLabel');
    const btnBizLabel = document.getElementById('btnBizLabel');
    const actionPrice = document.getElementById('actionTotalPrice');
    const actionTierText = document.getElementById('actionSelectedTierText');

    if (tier === 'economy') {
        cardEco.classList.add('active');
        cardBiz.classList.remove('active');
        btnEcoLabel.textContent = '✓ Đang Chọn Phổ Thông';
        btnBizLabel.textContent = 'Nâng Cấp Lên Thương Gia';
        if (currentFlight) {
            actionPrice.textContent = formatVND(currentFlight.price_economy);
            actionTierText.textContent = 'Đã chọn: Hạng Phổ Thông (Eco) - 7kg xách tay';
        }
    } else {
        cardBiz.classList.add('active');
        cardEco.classList.remove('active');
        btnEcoLabel.textContent = 'Chọn Hạng Phổ Thông';
        btnBizLabel.textContent = '✓ Đang Chọn Thương Gia';
        if (currentFlight) {
            actionPrice.textContent = formatVND(currentFlight.price_business);
            actionTierText.textContent = 'Đã chọn: Hạng Thương Gia (SkyBoss) - 14kg xách tay + 30kg ký gửi + Phòng chờ VIP Lounge';
        }
    }
}

// Lưu chuyến bay vào Giỏ Hàng trong SQLite
async function saveFlightToCart() {
    if (!currentFlight) return;

    const price = selectedTier === 'business' ? currentFlight.price_business : currentFlight.price_economy;
    const tierName = selectedTier === 'business' ? 'Hạng Thương Gia (SkyBoss)' : 'Hạng Phổ Thông (Eco)';
    const tierDetails = selectedTier === 'business' 
        ? '14kg xách tay + 30kg ký gửi, Phòng chờ VIP, Suất ăn nóng, Miễn phí đổi vé' 
        : '7kg xách tay tiêu chuẩn, Ghế bọc da êm ái';

    const cartItem = {
        item_type: 'flight',
        reference_id: currentFlight.id,
        item_name: `Vé máy bay: ${currentFlight.origin_city} (${currentFlight.origin_code}) ➔ ${currentFlight.dest_city} (${currentFlight.dest_code})`,
        ticket_class: selectedTier,
        departure_date: currentFlight.departure_date,
        flight_or_duration: `${currentFlight.flight_number} (${currentFlight.departure_time} - ${currentFlight.arrival_time})`,
        details: `${tierName} | ${tierDetails} | Tàu bay: ${currentFlight.aircraft_type}`,
        price: price,
        quantity: 1
    };

    try {
        await window.db.addToCart(cartItem);
        showToast(`Đã thêm chuyến bay ${currentFlight.flight_number} (${tierName}) vào Giỏ Hàng!`);
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1000);
    } catch (e) {
        console.error('Lỗi thêm giỏ hàng:', e);
        showToast('Không thể thêm vào giỏ hàng!', 'error');
    }
}
