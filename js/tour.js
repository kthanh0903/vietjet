/**
 * js/tour.js - Logic hiển thị và lọc danh sách Tour du lịch từ SQLite
 */

document.addEventListener('DOMContentLoaded', async () => {
    await window.db.readyPromise;

    // Nạp danh sách hãng hàng không liên kết vào bộ lọc tour
    await initTourAirlineFilters();

    // Lọc và render tour
    await applyTourFilters();
});

// Nạp checkbox hãng hàng không
async function initTourAirlineFilters() {
    const container = document.getElementById('tourAirlinesFilterList');
    if (!container) return;

    const airlines = await window.db.getAirlines();
    container.innerHTML = airlines.map(al => `
        <label class="filter-item-label">
            <input type="checkbox" name="tour_airline" value="${al.name}" onchange="applyTourFilters()">
            ${al.name}
        </label>
    `).join('');
}

// Áp dụng bộ lọc và render danh sách tour
async function applyTourFilters() {
    const listContainer = document.getElementById('tourResultsList');
    const countDisplay = document.getElementById('tourResultCount');

    // Sắp xếp giá
    const sortBy = document.querySelector('input[name="tour_sort_price"]:checked')?.value || 'price_asc';

    // Hãng bay
    const selectedAirlines = Array.from(document.querySelectorAll('input[name="tour_airline"]:checked')).map(el => el.value);

    // Khung giờ cất cánh
    const timeSlot = document.querySelector('input[name="tour_time_slot"]:checked')?.value || 'all';

    try {
        let tours = await window.db.getTours({
            sortBy: sortBy,
            timeSlot: timeSlot
        });

        if (selectedAirlines.length > 0) {
            tours = tours.filter(t => selectedAirlines.includes(t.airline_name));
        }

        countDisplay.textContent = tours.length;

        if (tours.length === 0) {
            listContainer.innerHTML = `
                <div style="background: #ffffff; border: 1px dashed #d1d5db; border-radius: 12px; padding: 40px; text-align: center;">
                    <div style="font-size: 40px; margin-bottom: 12px;">🏖️</div>
                    <h3 style="font-size: 18px; margin-bottom: 8px;">Không tìm thấy tour phù hợp</h3>
                    <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">Vui lòng thử điều chỉnh lại bộ lọc để xem các tour du lịch khác.</p>
                    <button class="btn btn-primary btn-sm" onclick="resetTourFilters()">Đặt lại bộ lọc</button>
                </div>
            `;
            return;
        }

        // Render từng tour dạng thẻ ngang đẹp mắt
        listContainer.innerHTML = tours.map(tour => `
            <div class="tour-item-row">
                <!-- Thumbnail 600x400 -->
                <div class="tour-row-thumb-wrap">
                    <img src="${tour.thumbnail_url}" alt="${tour.title}" class="tour-row-thumb" loading="lazy">
                    <span class="tour-duration-tag">⏱ ${tour.duration_text}</span>
                </div>

                <!-- Nội dung thông tin tour -->
                <div class="tour-row-content">
                    <div class="tour-meta-header">
                        <span class="tour-agency-badge">
                            <img src="${tour.airline_logo}" alt="${tour.airline_name}" style="height: 18px; vertical-align: middle;">
                            ${tour.agency_name} (${tour.airline_name})
                        </span>
                        <div style="font-size: 12px; color: #4b5563;">
                            ⭐ <strong>${tour.rating.toFixed(1)}/5</strong> (${tour.reviews_count} đánh giá)
                        </div>
                    </div>

                    <h3 class="tour-item-title">${tour.title}</h3>
                    <p class="tour-item-highlights">${tour.highlights}</p>

                    <!-- Thông số chuyến bay & dịch vụ -->
                    <div class="tour-item-specs">
                        <span class="spec-pill">📍 Điểm đi: <strong>${tour.origin}</strong></span>
                        <span class="spec-pill">🎯 Điểm đến: <strong>${tour.destination}</strong></span>
                        <span class="spec-pill">✈ Máy bay: <strong>${tour.aircraft_type}</strong></span>
                        <span class="spec-pill">🏨 Khách sạn: <strong>4 - 5 sao</strong></span>
                    </div>

                    <!-- Footer giá & Nút đặt -->
                    <div class="tour-row-footer">
                        <div>
                            <span style="font-size: 12px; color: #6b7280;">Giá trọn gói / khách:</span>
                            <div class="tour-row-price-num">${formatVND(tour.price)}</div>
                        </div>
                        <a href="tour-detail.html?id=${tour.id}" class="btn btn-primary">
                            Xem Chi Tiết Tour
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Lỗi lọc tour:', err);
    }
}

// Đặt lại bộ lọc tour
function resetTourFilters() {
    const sortAsc = document.querySelector('input[name="tour_sort_price"][value="price_asc"]');
    if (sortAsc) sortAsc.checked = true;

    const slotAll = document.querySelector('input[name="tour_time_slot"][value="all"]');
    if (slotAll) slotAll.checked = true;

    document.querySelectorAll('input[name="tour_airline"]').forEach(cb => cb.checked = false);

    applyTourFilters();
}
