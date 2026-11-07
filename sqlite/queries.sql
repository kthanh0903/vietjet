-- ====================================================================
-- CÁC CÂU LỆNH TRUY VẤN MẪU CHO WEBSITE VIETJET (QUERIES.SQL)
-- File: sqlite/queries.sql
-- Danh sách các câu lệnh SELECT, INSERT, UPDATE, DELETE phục vụ giao diện
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. TRANG CHỦ (HOME PAGE)
-- --------------------------------------------------------------------

-- Lấy danh sách tất cả sân bay cho dropdown Điểm đi & Điểm đến
SELECT code, name, city FROM airports ORDER BY country DESC, city ASC;

-- Lấy đúng 8 Tour nổi bật hiển thị ở Trang chủ
SELECT 
    t.id, t.title, t.destination, t.duration_text, t.duration_days, t.duration_nights,
    t.price, t.thumbnail_url, t.rating, t.reviews_count, t.highlights,
    a.name AS airline_name, a.logo_url AS airline_logo
FROM tours t
JOIN airlines a ON t.airline_code = a.code
WHERE t.is_featured = 1
ORDER BY t.id ASC
LIMIT 8;

-- Lấy danh sách các Hãng hàng không hiển thị Logo ở Trang chủ
SELECT code, name, logo_url, website FROM airlines ORDER BY (code = 'VJ') DESC, name ASC;


-- --------------------------------------------------------------------
-- 2. TRANG CHUYẾN BAY (FLIGHTS LIST & ADVANCED FILTERS)
-- --------------------------------------------------------------------

-- Truy vấn tìm kiếm và lọc chuyến bay đa tiêu chí
-- Tham số động: origin_code, dest_code, trip_type, airlines, time_slots, min_price, max_price
SELECT 
    f.id, f.flight_number, f.departure_time, f.arrival_time, f.duration,
    f.departure_date, f.price_economy, f.price_business, f.aircraft_type,
    f.trip_type, f.is_direct, f.time_slot, f.amenities,
    orig.name AS origin_name, orig.city AS origin_city, f.origin_code,
    dest.name AS dest_name, dest.city AS dest_city, f.dest_code,
    a.name AS airline_name, a.logo_url AS airline_logo
FROM flights f
JOIN airlines a ON f.airline_code = a.code
JOIN airports orig ON f.origin_code = orig.code
JOIN airports dest ON f.dest_code = dest.code
WHERE 1=1
    -- Điều kiện lọc theo điểm đi/đến (nếu có)
    AND (f.origin_code = 'SGN' OR 'SGN' IS NULL)
    AND (f.dest_code = 'HAN' OR 'HAN' IS NULL)
    -- Lọc loại vé (one_way / round_trip)
    AND (f.trip_type = 'round_trip' OR f.trip_type = 'one_way')
    -- Lọc theo danh sách hãng bay
    AND a.name IN ('VietJet Air', 'Vietnam Airlines')
    -- Lọc theo khung giờ bay
    AND f.time_slot IN ('morning', 'afternoon')
-- Sắp xếp giá tăng dần (hoặc DESC nếu giảm dần)
ORDER BY f.price_economy ASC;


-- --------------------------------------------------------------------
-- 3. TRANG CHI TIẾT CHUYẾN BAY (FLIGHT DETAIL)
-- --------------------------------------------------------------------

-- Lấy thông tin chuyến bay cụ thể theo ID
SELECT 
    f.id, f.flight_number, f.departure_time, f.arrival_time, f.duration,
    f.departure_date, f.return_date, f.price_economy, f.price_business,
    f.aircraft_type, f.trip_type, f.is_direct, f.amenities,
    orig.name AS origin_name, orig.city AS origin_city, orig.code AS origin_code,
    dest.name AS dest_name, dest.city AS dest_city, dest.code AS dest_code,
    a.name AS airline_name, a.logo_url AS airline_logo
FROM flights f
JOIN airlines a ON f.airline_code = a.code
JOIN airports orig ON f.origin_code = orig.code
JOIN airports dest ON f.dest_code = dest.code
WHERE f.id = 1;


-- --------------------------------------------------------------------
-- 4. TRANG DANH SÁCH TOUR DU LỊCH (TOUR LIST & FILTERS)
-- --------------------------------------------------------------------

-- Lấy danh sách tour kèm bộ lọc sắp xếp giá và hãng bay
SELECT 
    t.id, t.title, t.destination, t.origin, t.duration_text, t.price,
    t.agency_name, t.thumbnail_url, t.aircraft_type, t.departure_time_slot,
    t.rating, t.reviews_count, t.highlights, t.included_services,
    a.name AS airline_name, a.logo_url AS airline_logo
FROM tours t
JOIN airlines a ON t.airline_code = a.code
WHERE 1=1
    -- Lọc theo hãng
    -- AND a.name = 'VietJet Air'
    -- Lọc theo khung giờ
    -- AND t.departure_time_slot = 'morning'
ORDER BY t.price ASC;


-- --------------------------------------------------------------------
-- 5. TRANG CHI TIẾT TOUR (TOUR DETAIL & ITINERARIES)
-- --------------------------------------------------------------------

-- Lấy thông tin chi tiết tour theo ID
SELECT 
    t.*, a.name AS airline_name, a.logo_url AS airline_logo
FROM tours t
JOIN airlines a ON t.airline_code = a.code
WHERE t.id = 1;

-- Lấy lịch trình các ngày của tour
SELECT 
    day_number, title, description, meals, stay
FROM tour_itineraries
WHERE tour_id = 1
ORDER BY day_number ASC;


-- --------------------------------------------------------------------
-- 6. GIỎ HÀNG (CART OPERATIONS)
-- --------------------------------------------------------------------

-- Lấy toàn bộ sản phẩm trong giỏ hàng
SELECT * FROM cart_items ORDER BY id DESC;

-- Thêm chuyến bay vào giỏ hàng
INSERT INTO cart_items (
    item_type, reference_id, item_name, ticket_class,
    departure_date, flight_or_duration, details, price, quantity, total_amount
) VALUES (
    'flight', 1, 'Vé máy bay: SGN - HAN (VJ-120)', 'business',
    '2026-11-15', '06:15 - 08:25', 'Hạng Thương Gia (SkyBoss) - 14kg xách tay, 30kg ký gửi, phòng chờ VIP',
    2450000, 1, 2450000
);

-- Thêm tour vào giỏ hàng
INSERT INTO cart_items (
    item_type, reference_id, item_name, ticket_class,
    departure_date, flight_or_duration, details, price, quantity, total_amount
) VALUES (
    'tour', 1, 'Tour Phú Quốc 3N2Đ - Thiên Đường Đảo Ngọc', 'tour_standard',
    '2026-11-20', '3 Ngày 2 Đêm', 'Người lớn (Resort 4*, Cáp treo Hòn Thơm)',
    3890000, 2, 7780000
);

-- Tính tổng tiền trong giỏ hàng
SELECT COUNT(*) AS total_items, COALESCE(SUM(total_amount), 0) AS grand_total FROM cart_items;

-- Cập nhật số lượng của 1 mục trong giỏ
UPDATE cart_items 
SET quantity = 2, total_amount = price * 2 
WHERE id = 1;

-- Xóa 1 mục khỏi giỏ hàng
DELETE FROM cart_items WHERE id = 1;

-- Xóa sạch toàn bộ giỏ hàng
DELETE FROM cart_items;


-- --------------------------------------------------------------------
-- 7. ĐẶT HÀNG & LƯU ĐƠN (CHECKOUT & ORDERS)
-- --------------------------------------------------------------------

-- Thêm đơn hàng mới khi khách bấm Đăng ký
INSERT INTO orders (
    booking_code, customer_name, customer_email, customer_phone,
    customer_id_card, customer_address, customer_notes,
    total_amount, payment_method, status, email_status
) VALUES (
    'VJ-839210', 'Nguyễn Văn Hải', 'nvhai061993@gmail.com', '0901234567',
    '079093001234', 'Quận 1, TP. Hồ Chí Minh', 'Yêu cầu chỗ ngồi cạnh cửa sổ',
    6340000, 'vietqr', 'completed', 'sent'
);

-- Lấy lại thông tin đơn hàng vừa đặt theo Mã PNR
SELECT * FROM orders WHERE booking_code = 'VJ-839210';
