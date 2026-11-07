# QUY CHUẨN THÀNH PHẦN GIAO DIỆN (UI_COMPONENTS.MD)

Tài liệu hướng dẫn chi tiết về phong cách thiết kế, bảng màu, mã HTML/CSS chuẩn cho từng thành phần giao diện của website Vietjet, đặc biệt là bảng chọn hạng vé "Phổ Thông & Thương Gia" theo đúng yêu cầu đề bài.

---

## 1. HỆ THỐNG MÀU SẮC & BIẾN CSS (CSS VARIABLES)

```css
:root {
    /* Màu thương hiệu Vietjet */
    --vj-primary: #ee1d23;          /* Màu đỏ chủ đạo Vietjet */
    --vj-primary-dark: #c41318;     /* Đỏ đậm khi hover */
    --vj-secondary: #ffc700;        /* Màu vàng tươi điểm xuyết */
    --vj-secondary-dark: #e0ae00;   /* Vàng đậm khi hover */
    
    /* Màu nền & Nền sáng */
    --vj-bg-main: #ffffff;          /* Nền trắng chủ đạo */
    --vj-bg-light: #f8f9fa;         /* Nền xám nhạt phân tách block */
    --vj-bg-card: #ffffff;          /* Nền thẻ trắng */
    
    /* Màu chữ & Đường viền */
    --vj-text-main: #1f2937;        /* Chữ chính đậm rõ nét */
    --vj-text-muted: #6b7280;       /* Chữ phụ, ghi chú */
    --vj-border: #e5e7eb;           /* Viền thẻ mờ */
    --vj-border-focus: #ee1d23;     /* Viền khi chọn */
    
    /* Hiệu ứng bóng đổ */
    --vj-shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
    --vj-shadow-md: 0 4px 14px rgba(0,0,0,0.1);
    --vj-shadow-lg: 0 10px 25px rgba(238,29,35,0.15);
    
    /* Bo góc */
    --vj-radius-sm: 6px;
    --vj-radius-md: 10px;
    --vj-radius-lg: 16px;
    --vj-radius-full: 9999px;
}
```

---

## 2. THÀNH PHẦN CHỌN HẠNG VÉ (TICKET CLASS SELECTOR - GIỐNG TRONG HÌNH)

Thành phần này xuất hiện trên trang **Chi tiết chuyến bay (`flight-detail.html`)**, cho phép khách hàng chuyển đổi và so sánh trực quan giữa **Hạng Phổ Thông (Economy / Eco)** và **Hạng Thương Gia (Business / SkyBoss)**.

### A. Cấu Trúc HTML Chuẩn
```html
<div class="ticket-class-container">
    <h3 class="section-title">Chọn Hạng Vé & Dịch Vụ Đi Kèm</h3>
    
    <div class="ticket-class-grid">
        <!-- 1. HẠNG PHỔ THÔNG (ECONOMY) -->
        <div class="ticket-card economy-card active" data-class="economy" onclick="selectTicketClass('economy')">
            <div class="ticket-card-header">
                <span class="badge badge-economy">TIẾT KIỆM NHẤT</span>
                <h4 class="class-name">HẠNG PHỔ THÔNG</h4>
                <p class="class-sub">Vietjet Eco / Economy Class</p>
                <div class="class-price">
                    <span class="price-val" id="price-eco">890.000</span>
                    <span class="currency">₫ / khách</span>
                </div>
            </div>
            
            <div class="ticket-features">
                <div class="feature-item included">
                    <span class="icon">✅</span>
                    <span>Hành lý xách tay: <strong>07 kg</strong></span>
                </div>
                <div class="feature-item not-included">
                    <span class="icon">❌</span>
                    <span>Hành lý ký gửi: <em>Chưa bao gồm (Mua thêm)</em></span>
                </div>
                <div class="feature-item not-included">
                    <span class="icon">❌</span>
                    <span>Suất ăn nóng: <em>Chưa bao gồm (Mua thêm)</em></span>
                </div>
                <div class="feature-item included">
                    <span class="icon">✅</span>
                    <span>Ghế ngồi tiêu chuẩn êm ái</span>
                </div>
                <div class="feature-item condition">
                    <span class="icon">⚠️</span>
                    <span>Đổi ngày bay: Thu phí + chênh lệch giá vé</span>
                </div>
                <div class="feature-item not-included">
                    <span class="icon">❌</span>
                    <span>Hoàn vé: Không áp dụng</span>
                </div>
            </div>
            
            <div class="ticket-card-action">
                <button type="button" class="btn-select-tier btn-eco">Đang Chọn Phổ Thông</button>
            </div>
        </div>

        <!-- 2. HẠNG THƯƠNG GIA (BUSINESS / SKYBOSS) -->
        <div class="ticket-card business-card" data-class="business" onclick="selectTicketClass('business')">
            <div class="ticket-card-header">
                <span class="badge badge-business">⭐ ĐẲNG CẤP THƯƠNG GIA</span>
                <h4 class="class-name">HẠNG THƯƠNG GIA</h4>
                <p class="class-sub">Vietjet SkyBoss / Business Class</p>
                <div class="class-price">
                    <span class="price-val" id="price-biz">2.690.000</span>
                    <span class="currency">₫ / khách</span>
                </div>
            </div>
            
            <div class="ticket-features">
                <div class="feature-item included">
                    <span class="icon">⭐</span>
                    <span>Hành lý xách tay: <strong>14 kg (2 kiện)</strong></span>
                </div>
                <div class="feature-item included">
                    <span class="icon">⭐</span>
                    <span>Hành lý ký gửi: <strong>30 kg - 40 kg miễn phí</strong></span>
                </div>
                <div class="feature-item included">
                    <span class="icon">⭐</span>
                    <span>Phòng chờ Thương gia <strong>VIP Lounge</strong> sang trọng</span>
                </div>
                <div class="feature-item included">
                    <span class="icon">⭐</span>
                    <span>Ưu tiên làm thủ tục tại quầy riêng & Lối đi riêng</span>
                </div>
                <div class="feature-item included">
                    <span class="icon">⭐</span>
                    <span>Xe riêng đưa đón ra tận cửa tàu bay</span>
                </div>
                <div class="feature-item included">
                    <span class="icon">⭐</span>
                    <span><strong>Ẩm thực nóng cao cấp</strong> & đồ uống tươi ngon miễn phí</span>
                </div>
                <div class="feature-item included">
                    <span class="icon">⭐</span>
                    <span>Ghế ngồi da rộng rãi, ngả phẳng thoải mái hàng đầu</span>
                </div>
                <div class="feature-item included">
                    <span class="icon">⭐</span>
                    <span><strong>Miễn phí</strong> đổi ngày bay, giờ bay, chặng bay</span>
                </div>
            </div>
            
            <div class="ticket-card-action">
                <button type="button" class="btn-select-tier btn-biz">Nâng Cấp Lên Thương Gia</button>
            </div>
        </div>
    </div>
</div>
```

### B. Đoạn CSS Định Dạng Thẻ Hạng Vé
```css
.ticket-class-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
    margin: 20px 0 30px;
}

.ticket-card {
    background: #fff;
    border: 2px solid var(--vj-border);
    border-radius: var(--vj-radius-lg);
    padding: 24px;
    cursor: pointer;
    transition: all 0.25s ease-in-out;
    position: relative;
    box-shadow: var(--vj-shadow-sm);
}

.ticket-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--vj-shadow-md);
}

/* Trạng thái khi được chọn */
.ticket-card.active {
    border-color: var(--vj-primary);
    background: #fffdfd;
    box-shadow: var(--vj-shadow-lg);
}

/* Điểm nhấn thẻ Thương Gia */
.ticket-card.business-card {
    border-top: 5px solid #ffc700;
}
.ticket-card.business-card.active {
    border-color: #ffc700;
    box-shadow: 0 10px 30px rgba(255, 199, 0, 0.25);
}

.badge-economy {
    background: #eef2f6;
    color: #475569;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: var(--vj-radius-full);
}

.badge-business {
    background: linear-gradient(135deg, #ffc700, #ff9900);
    color: #000;
    font-size: 11px;
    font-weight: 800;
    padding: 4px 12px;
    border-radius: var(--vj-radius-full);
}

.class-price .price-val {
    font-size: 28px;
    font-weight: 800;
    color: var(--vj-primary);
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    font-size: 14px;
    border-bottom: 1px dashed #f0f0f0;
}
```

---

## 3. THẺ TOUR DU LỊCH NỔI BẬT (THUMBNAIL 600x400 PX)

Thành phần hiển thị 8 tour nổi bật tại trang chủ (`index.html`) và danh sách tour (`tour.html`):

```html
<div class="tour-card">
    <div class="tour-thumbnail-wrapper">
        <!-- Thumbnail kích thước chuẩn 600x400 -->
        <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop" 
             alt="Tour Phú Quốc" 
             class="tour-thumbnail"
             width="600" 
             height="400"
             loading="lazy">
        <span class="tour-tag">Hàng Không Vietjet</span>
        <span class="tour-duration-badge">⏱ 3N2Đ</span>
    </div>
    <div class="tour-body">
        <div class="tour-airline-meta">
            <img src="images/1794032794428_7798941419347914444_g4111106518249197050_b20246c106060b907dfe9e17d280275d.jpg" class="airline-mini-logo" alt="Vietjet">
            <span class="airline-name">Vietjet Travel</span>
        </div>
        <h3 class="tour-title">Tour Phú Quốc 3N2Đ - Thiên Đường Đảo Ngọc & Cáp Treo Hòn Thơm</h3>
        <p class="tour-highlight">Trải nghiệm cáp treo vượt biển, Grand World, lặn ngắm san hô...</p>
        <div class="tour-rating">
            <span class="stars">⭐⭐⭐⭐⭐</span>
            <span class="score">4.9/5 (215 đánh giá)</span>
        </div>
        <div class="tour-footer">
            <div class="tour-price-block">
                <span class="price-label">Giá chỉ từ:</span>
                <span class="tour-price">3.890.000 ₫</span>
            </div>
            <a href="tour-detail.html?id=1" class="btn btn-primary btn-sm">Xem Chi Tiết</a>
        </div>
    </div>
</div>
```

---

## 4. LƯỚI LOGO CÁC HÃNG HÀNG KHÔNG (AIRLINES LOGOS)

Khi click vào bất kỳ logo nào, ứng dụng điều hướng sang `flights.html` kèm query lọc theo hãng tương ứng:

```html
<section class="airlines-section">
    <div class="container">
        <h2 class="section-title text-center">HÃNG HÀNG KHÔNG ĐỐI TÁC TIN CẬY</h2>
        <p class="section-subtitle text-center">Đồng hành cùng bạn trên hàng trăm đường bay an toàn và tiện lợi</p>
        
        <div class="airlines-grid">
            <a href="flights.html?airline=VietJet%20Air" class="airline-brand-item" title="VietJet Air">
                <img src="images/1794032794428_7798941419347914444_g4111106518249197050_b20246c106060b907dfe9e17d280275d.jpg" alt="VietJet Air">
                <span>VietJet Air</span>
            </a>
            
            <a href="flights.html?airline=Vietnam%20Airlines" class="airline-brand-item" title="Vietnam Airlines">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Vietnam_Airlines_logo.svg/320px-Vietnam_Airlines_logo.svg.png" alt="Vietnam Airlines">
                <span>Vietnam Airlines</span>
            </a>
            
            <a href="flights.html?airline=Bamboo%20Airways" class="airline-brand-item" title="Bamboo Airways">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Bamboo_Airways_logo.svg/320px-Bamboo_Airways_logo.svg.png" alt="Bamboo Airways">
                <span>Bamboo Airways</span>
            </a>
            
            <a href="flights.html?airline=Singapore%20Airlines" class="airline-brand-item" title="Singapore Airlines">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/320px-Singapore_Airlines_Logo_2.svg.png" alt="Singapore Airlines">
                <span>Singapore Airlines</span>
            </a>
            
            <a href="flights.html?airline=AirAsia" class="airline-brand-item" title="AirAsia">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/320px-AirAsia_New_Logo.svg.png" alt="AirAsia">
                <span>AirAsia</span>
            </a>
            
            <a href="flights.html?airline=Qatar%20Airways" class="airline-brand-item" title="Qatar Airways">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/320px-Qatar_Airways_Logo.svg.png" alt="Qatar Airways">
                <span>Qatar Airways</span>
            </a>
        </div>
    </div>
</section>
```

---

## 5. BỘ LỌC CỘT BÊN TRÁI (FILTER SIDEBAR)

Được áp dụng tại `flights.html` và `tour.html`:
```html
<aside class="filter-sidebar">
    <div class="filter-header">
        <h4>Bộ Lọc Tìm Kiếm</h4>
        <button type="button" class="btn-reset-filter" onclick="resetFilters()">Đặt lại</button>
    </div>

    <!-- Sắp xếp giá -->
    <div class="filter-group">
        <h5>Sắp Xếp Giá</h5>
        <label class="radio-label">
            <input type="radio" name="sort_price" value="asc" checked onchange="applyFilters()"> Giá tăng dần
        </label>
        <label class="radio-label">
            <input type="radio" name="sort_price" value="desc" onchange="applyFilters()"> Giá giảm dần
        </label>
    </div>

    <!-- Loại vé -->
    <div class="filter-group">
        <h5>Loại Vé</h5>
        <label class="checkbox-label">
            <input type="checkbox" name="trip_type" value="one_way" checked onchange="applyFilters()"> Vé một chiều
        </label>
        <label class="checkbox-label">
            <input type="checkbox" name="trip_type" value="round_trip" checked onchange="applyFilters()"> Vé khứ hồi
        </label>
    </div>

    <!-- Hãng hàng không -->
    <div class="filter-group">
        <h5>Hãng Hàng Không</h5>
        <label class="checkbox-label"><input type="checkbox" name="airline" value="VietJet Air" checked onchange="applyFilters()"> VietJet Air</label>
        <label class="checkbox-label"><input type="checkbox" name="airline" value="Vietnam Airlines" checked onchange="applyFilters()"> Vietnam Airlines</label>
        <label class="checkbox-label"><input type="checkbox" name="airline" value="Bamboo Airways" checked onchange="applyFilters()"> Bamboo Airways</label>
        <label class="checkbox-label"><input type="checkbox" name="airline" value="Singapore Airlines" checked onchange="applyFilters()"> Singapore Airlines</label>
    </div>

    <!-- Khung giờ cất cánh -->
    <div class="filter-group">
        <h5>Thời Gian Cất Cánh</h5>
        <label class="checkbox-label"><input type="checkbox" name="time_slot" value="early" onchange="applyFilters()"> Sáng sớm (00:00 - 06:00)</label>
        <label class="checkbox-label"><input type="checkbox" name="time_slot" value="morning" checked onchange="applyFilters()"> Buổi sáng (06:00 - 12:00)</label>
        <label class="checkbox-label"><input type="checkbox" name="time_slot" value="afternoon" checked onchange="applyFilters()"> Buổi chiều (12:00 - 18:00)</label>
        <label class="checkbox-label"><input type="checkbox" name="time_slot" value="night" onchange="applyFilters()"> Buổi tối (18:00 - 24:00)</label>
    </div>

    <!-- Hạng dịch vụ -->
    <div class="filter-group">
        <h5>Hạng Dịch Vụ</h5>
        <label class="checkbox-label"><input type="checkbox" name="cabin_class" value="economy" checked onchange="applyFilters()"> Hạng Phổ Thông</label>
        <label class="checkbox-label"><input type="checkbox" name="cabin_class" value="business" checked onchange="applyFilters()"> Hạng Thương Gia</label>
    </div>
</aside>
```
