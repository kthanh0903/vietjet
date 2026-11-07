-- ====================================================================
-- HỆ THỐNG CƠ SỞ DỮ LIỆU SQLITE - WEBSITE DU LỊCH & ĐẶT VÉ VIETJET
-- File: sqlite/schema.sql
-- Định nghĩa cấu trúc bảng (DDL), khóa chính, khóa ngoại và chỉ mục (Indexes)
-- ====================================================================

PRAGMA foreign_keys = ON;

-- --------------------------------------------------------------------
-- 1. BẢNG SÂN BAY (AIRPORTS)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS airports;
CREATE TABLE airports (
    code TEXT PRIMARY KEY,                  -- Mã IATA: SGN, HAN, DAD, CXR, PQC, BKK, ICN, NRT, SIN
    name TEXT NOT NULL,                     -- Tên đầy đủ sân bay
    city TEXT NOT NULL,                     -- Tên thành phố
    country TEXT NOT NULL DEFAULT 'Việt Nam' -- Quốc gia
);

-- --------------------------------------------------------------------
-- 2. BẢNG HÃNG HÀNG KHÔNG (AIRLINES)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS airlines;
CREATE TABLE airlines (
    code TEXT PRIMARY KEY,                  -- VJ, VN, QH, SQ, AK, QR
    name TEXT NOT NULL,                     -- VietJet Air, Vietnam Airlines, Bamboo Airways...
    logo_url TEXT NOT NULL,                 -- Đường dẫn ảnh logo hãng
    website TEXT,
    country TEXT NOT NULL DEFAULT 'Việt Nam'
);

-- --------------------------------------------------------------------
-- 3. BẢNG CHUYẾN BAY (FLIGHTS)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS flights;
CREATE TABLE flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_number TEXT NOT NULL,            -- Số hiệu chuyến bay: VJ-120, VN-210, SQ-178...
    airline_code TEXT NOT NULL,             -- Mã hãng bay liên kết
    origin_code TEXT NOT NULL,              -- Mã sân bay xuất phát (SGN, HAN...)
    dest_code TEXT NOT NULL,                -- Mã sân bay điểm đến
    departure_time TEXT NOT NULL,           -- Giờ cất cánh (Định dạng HH:mm, ví dụ: '06:15')
    arrival_time TEXT NOT NULL,             -- Giờ hạ cánh (Định dạng HH:mm, ví dụ: '08:25')
    duration TEXT NOT NULL,                 -- Thời lượng bay: '2h 10m', '1h 20m'
    departure_date TEXT NOT NULL,           -- Ngày bay (YYYY-MM-DD)
    return_date TEXT,                       -- Ngày về dự kiến (nếu là vé khứ hồi)
    price_economy INTEGER NOT NULL,         -- Giá vé hạng Phổ Thông (VNĐ)
    price_business INTEGER NOT NULL,        -- Giá vé hạng Thương Gia (VNĐ)
    aircraft_type TEXT NOT NULL,            -- Loại tàu bay: 'Airbus A321neo', 'Boeing 787-9'...
    trip_type TEXT NOT NULL DEFAULT 'one_way', -- 'one_way' (Một chiều) hoặc 'round_trip' (Khứ hồi)
    is_direct INTEGER NOT NULL DEFAULT 1,   -- 1: Bay thẳng, 0: Quá cảnh / Nhiều thành phố
    time_slot TEXT NOT NULL,                -- 'early' (0-6h), 'morning' (6-12h), 'afternoon' (12-18h), 'night' (18-24h)
    amenities TEXT,                         -- Chuỗi JSON dịch vụ: hành lý, suất ăn, wifi...
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (airline_code) REFERENCES airlines(code) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (origin_code) REFERENCES airports(code) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (dest_code) REFERENCES airports(code) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- --------------------------------------------------------------------
-- 4. BẢNG TOUR DU LỊCH (TOURS) - CHUẨN 8 TOUR NỔI BẬT THUMBNAIL 600x400
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS tours;
CREATE TABLE tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,                    -- Tên tour du lịch trọn gói
    destination TEXT NOT NULL,              -- Điểm đến chính (Phú Quốc, Đà Nẵng, Bangkok...)
    origin TEXT NOT NULL DEFAULT 'TP. Hồ Chí Minh', -- Điểm khởi hành
    duration_text TEXT NOT NULL,            -- '3 Ngày 2 Đêm', '4 Ngày 3 Đêm', '5 Ngày 4 Đêm'...
    duration_days INTEGER NOT NULL,         -- Số ngày
    duration_nights INTEGER NOT NULL,       -- Số đêm
    price INTEGER NOT NULL,                 -- Giá tour trọn gói / người (VNĐ)
    airline_code TEXT NOT NULL,             -- Hãng hàng không đồng hành
    agency_name TEXT NOT NULL,              -- Hãng du lịch: Vietjet Holidays, Vietjet Travel...
    thumbnail_url TEXT NOT NULL,            -- Ảnh thumbnail tỷ lệ 600x400 px
    aircraft_type TEXT NOT NULL,            -- Loại máy bay vận chuyển trong tour
    departure_time_slot TEXT NOT NULL,      -- 'morning', 'afternoon', 'evening'
    rating REAL NOT NULL DEFAULT 4.9,       -- Đánh giá sao (4.8, 4.9, 5.0)
    reviews_count INTEGER NOT NULL DEFAULT 150, -- Số lượt đánh giá
    highlights TEXT NOT NULL,               -- Tóm tắt các điểm tham quan nổi bật
    included_services TEXT,                 -- Dịch vụ bao gồm (Khách sạn 4-5*, Vé máy bay khứ hồi...)
    is_featured INTEGER NOT NULL DEFAULT 1, -- 1: Tour nổi bật trang chủ
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (airline_code) REFERENCES airlines(code) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- --------------------------------------------------------------------
-- 5. BẢNG LỊCH TRÌNH TOUR CHI TIẾT (TOUR_ITINERARIES)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS tour_itineraries;
CREATE TABLE tour_itineraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tour_id INTEGER NOT NULL,               -- Khóa ngoại liên kết bảng tours
    day_number INTEGER NOT NULL,            -- Ngày thứ mấy (1, 2, 3...)
    title TEXT NOT NULL,                    -- Tiêu đề hoạt động trong ngày
    description TEXT NOT NULL,              -- Mô tả chi tiết hành trình
    meals TEXT,                             -- Bữa ăn: 'Sáng, Trưa, Tối'
    stay TEXT,                              -- Khách sạn / Nơi lưu trú
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- --------------------------------------------------------------------
-- 6. BẢNG GIỎ HÀNG CLIENT (CART_ITEMS)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS cart_items;
CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_type TEXT NOT NULL,                -- 'flight' (Chuyến bay) hoặc 'tour' (Tour du lịch)
    reference_id INTEGER NOT NULL,          -- ID tham chiếu trong bảng flights hoặc tours
    item_name TEXT NOT NULL,                -- Tên hiển thị (Tên chuyến bay / Tên tour)
    ticket_class TEXT,                      -- 'economy' hoặc 'business' (áp dụng cho flight)
    departure_date TEXT NOT NULL,           -- Ngày đi
    flight_or_duration TEXT,                -- 'VJ-120 (06:15 - 08:25)' hoặc '3 Ngày 2 Đêm'
    details TEXT,                           -- Chi tiết bổ sung (hành trình, quyền lợi kèm theo)
    price INTEGER NOT NULL,                 -- Đơn giá (VNĐ)
    quantity INTEGER NOT NULL DEFAULT 1,    -- Số lượng vé / khách
    total_amount INTEGER NOT NULL,          -- Thành tiền = price * quantity
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 7. BẢNG ĐƠN HÀNG (ORDERS)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT NOT NULL UNIQUE,      -- Mã PNR (Ví dụ: 'VJ-839201')
    customer_name TEXT NOT NULL,            -- Họ tên người đặt
    customer_email TEXT NOT NULL,           -- Email nhận thư xác nhận
    customer_phone TEXT NOT NULL,           -- Số điện thoại
    customer_id_card TEXT NOT NULL,         -- Số CCCD hoặc Hộ chiếu
    customer_address TEXT,                  -- Địa chỉ liên hệ
    customer_notes TEXT,                    -- Ghi chú thêm
    total_amount INTEGER NOT NULL,          -- Tổng giá trị đơn hàng (VNĐ)
    payment_method TEXT NOT NULL,           -- 'vietqr', 'card', 'bank', 'later'
    status TEXT NOT NULL DEFAULT 'completed', -- 'pending', 'completed', 'cancelled'
    email_status TEXT NOT NULL DEFAULT 'sent',-- 'sent', 'pending', 'failed'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 8. BẢNG CHI TIẾT ĐƠN HÀNG (ORDER_ITEMS)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,              -- Khóa ngoại liên kết bảng orders
    item_type TEXT NOT NULL,                -- 'flight' hoặc 'tour'
    item_name TEXT NOT NULL,
    details TEXT,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- --------------------------------------------------------------------
-- 9. TỐI ƯU HÓA TRUY VẤN VỚI INDEXES
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_flights_route ON flights(origin_code, dest_code, departure_date);
CREATE INDEX IF NOT EXISTS idx_flights_airline ON flights(airline_code);
CREATE INDEX IF NOT EXISTS idx_flights_price_eco ON flights(price_economy);
CREATE INDEX IF NOT EXISTS idx_flights_time_slot ON flights(time_slot);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(is_featured, price);
CREATE INDEX IF NOT EXISTS idx_tours_airline ON tours(airline_code);
CREATE INDEX IF NOT EXISTS idx_tour_itin_tour_id ON tour_itineraries(tour_id, day_number);
CREATE INDEX IF NOT EXISTS idx_orders_booking_code ON orders(booking_code);
