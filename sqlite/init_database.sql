-- ====================================================================
-- MASTER INITIALIZATION SCRIPT CHO SQLITE (WEBSITE VIETJET)
-- File: sqlite/init_database.sql
-- Hợp nhất toàn bộ Schema (DDL) và Dữ liệu mẫu (Seed Data)
-- Cách chạy: sqlite3 vietjet.db < sqlite/init_database.sql
-- ====================================================================

PRAGMA foreign_keys = ON;

-- 1. BẢNG SÂN BAY
DROP TABLE IF EXISTS airports;
CREATE TABLE airports (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Việt Nam'
);

-- 2. BẢNG HÃNG HÀNG KHÔNG
DROP TABLE IF EXISTS airlines;
CREATE TABLE airlines (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    website TEXT,
    country TEXT NOT NULL DEFAULT 'Việt Nam'
);

-- 3. BẢNG CHUYẾN BAY
DROP TABLE IF EXISTS flights;
CREATE TABLE flights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_number TEXT NOT NULL,
    airline_code TEXT NOT NULL,
    origin_code TEXT NOT NULL,
    dest_code TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    duration TEXT NOT NULL,
    departure_date TEXT NOT NULL,
    return_date TEXT,
    price_economy INTEGER NOT NULL,
    price_business INTEGER NOT NULL,
    aircraft_type TEXT NOT NULL,
    trip_type TEXT NOT NULL DEFAULT 'one_way',
    is_direct INTEGER NOT NULL DEFAULT 1,
    time_slot TEXT NOT NULL,
    amenities TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (airline_code) REFERENCES airlines(code) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (origin_code) REFERENCES airports(code) ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (dest_code) REFERENCES airports(code) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 4. BẢNG TOUR DU LỊCH (ĐỦ 8 TOUR 600x400)
DROP TABLE IF EXISTS tours;
CREATE TABLE tours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    origin TEXT NOT NULL DEFAULT 'TP. Hồ Chí Minh',
    duration_text TEXT NOT NULL,
    duration_days INTEGER NOT NULL,
    duration_nights INTEGER NOT NULL,
    price INTEGER NOT NULL,
    airline_code TEXT NOT NULL,
    agency_name TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    aircraft_type TEXT NOT NULL,
    departure_time_slot TEXT NOT NULL,
    rating REAL NOT NULL DEFAULT 4.9,
    reviews_count INTEGER NOT NULL DEFAULT 150,
    highlights TEXT NOT NULL,
    included_services TEXT,
    is_featured INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (airline_code) REFERENCES airlines(code) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 5. BẢNG LỊCH TRÌNH TOUR CHI TIẾT
DROP TABLE IF EXISTS tour_itineraries;
CREATE TABLE tour_itineraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tour_id INTEGER NOT NULL,
    day_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    meals TEXT,
    stay TEXT,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- 6. BẢNG GIỎ HÀNG CLIENT
DROP TABLE IF EXISTS cart_items;
CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_type TEXT NOT NULL,
    reference_id INTEGER NOT NULL,
    item_name TEXT NOT NULL,
    ticket_class TEXT,
    departure_date TEXT NOT NULL,
    flight_or_duration TEXT,
    details TEXT,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_amount INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. BẢNG ĐƠN HÀNG
DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_id_card TEXT NOT NULL,
    customer_address TEXT,
    customer_notes TEXT,
    total_amount INTEGER NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    email_status TEXT NOT NULL DEFAULT 'sent',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. BẢNG CHI TIẾT ĐƠN HÀNG
DROP TABLE IF EXISTS order_items;
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    item_type TEXT NOT NULL,
    item_name TEXT NOT NULL,
    details TEXT,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 9. CHỈ MỤC (INDEXES)
CREATE INDEX IF NOT EXISTS idx_flights_route ON flights(origin_code, dest_code, departure_date);
CREATE INDEX IF NOT EXISTS idx_flights_airline ON flights(airline_code);
CREATE INDEX IF NOT EXISTS idx_flights_price_eco ON flights(price_economy);
CREATE INDEX IF NOT EXISTS idx_flights_time_slot ON flights(time_slot);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(is_featured, price);
CREATE INDEX IF NOT EXISTS idx_tours_airline ON tours(airline_code);
CREATE INDEX IF NOT EXISTS idx_tour_itin_tour_id ON tour_itineraries(tour_id, day_number);
CREATE INDEX IF NOT EXISTS idx_orders_booking_code ON orders(booking_code);

-- ====================================================================
-- NẠP DỮ LIỆU BAN ĐẦU (SEED DATA)
-- ====================================================================

-- Sân bay
INSERT INTO airports (code, name, city, country) VALUES
('SGN', 'Sân bay Quốc tế Tân Sơn Nhất', 'TP. Hồ Chí Minh', 'Việt Nam'),
('HAN', 'Sân bay Quốc tế Nội Bài', 'Hà Nội', 'Việt Nam'),
('DAD', 'Sân bay Quốc tế Đà Nẵng', 'Đà Nẵng', 'Việt Nam'),
('CXR', 'Sân bay Quốc tế Cam Ranh', 'Nha Trang', 'Việt Nam'),
('PQC', 'Sân bay Quốc tế Phú Quốc', 'Phú Quốc', 'Việt Nam'),
('BKK', 'Sân bay Quốc tế Suvarnabhumi', 'Bangkok', 'Thái Lan'),
('ICN', 'Sân bay Quốc tế Incheon', 'Seoul', 'Hàn Quốc'),
('NRT', 'Sân bay Quốc tế Narita', 'Tokyo', 'Nhật Bản'),
('SIN', 'Sân bay Quốc tế Changi', 'Singapore', 'Singapore');

-- Hãng bay
INSERT INTO airlines (code, name, logo_url, website, country) VALUES
('VJ', 'VietJet Air', 'images/1794032794428_7798941419347914444_g4111106518249197050_b20246c106060b907dfe9e17d280275d.jpg', 'https://www.vietjetair.com', 'Việt Nam'),
('VN', 'Vietnam Airlines', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Vietnam_Airlines_logo.svg/320px-Vietnam_Airlines_logo.svg.png', 'https://www.vietnamairlines.com', 'Việt Nam'),
('QH', 'Bamboo Airways', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Bamboo_Airways_logo.svg/320px-Bamboo_Airways_logo.svg.png', 'https://www.bambooairways.com', 'Việt Nam'),
('SQ', 'Singapore Airlines', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/320px-Singapore_Airlines_Logo_2.svg.png', 'https://www.singaporeair.com', 'Singapore'),
('AK', 'AirAsia', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/320px-AirAsia_New_Logo.svg.png', 'https://www.airasia.com', 'Malaysia'),
('QR', 'Qatar Airways', 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/320px-Qatar_Airways_Logo.svg.png', 'https://www.qatarairways.com', 'Qatar');

-- 8 Tour nổi bật (Chuẩn thumbnail 600x400)
INSERT INTO tours (
    id, title, destination, origin, duration_text, duration_days, duration_nights,
    price, airline_code, agency_name, thumbnail_url, aircraft_type,
    departure_time_slot, rating, reviews_count, highlights, included_services, is_featured
) VALUES
(
    1,
    'Tour Phú Quốc 3N2Đ - Thiên Đường Đảo Ngọc & Cáp Treo Hòn Thơm',
    'Phú Quốc',
    'TP. Hồ Chí Minh',
    '3 Ngày 2 Đêm',
    3, 2,
    3890000,
    'VJ',
    'Vietjet Holidays',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop',
    'Airbus A321neo',
    'morning',
    4.9, 215,
    'Trải nghiệm cáp treo vượt biển 7.899m dài nhất thế giới, Grand World thành phố không ngủ, tắm biển Bãi Sao & lặn ngắm san hô 4 đảo',
    'Vé máy bay khứ hồi Vietjet, Khách sạn resort 4 sao, Xe du lịch đời mới, Các bữa ăn theo lịch trình, Vé cáp treo Hòn Thơm, Bảo hiểm du lịch 50 triệu/vụ',
    1
),
(
    2,
    'Tour Đà Nẵng - Hội An - Bà Nà Hills 4N3Đ - Check-in Cầu Vàng',
    'Đà Nẵng',
    'TP. Hồ Chí Minh',
    '4 Ngày 3 Đêm',
    4, 3,
    4590000,
    'VJ',
    'Vietjet Travel',
    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop',
    'Airbus A321',
    'morning',
    5.0, 340,
    'Check-in biểu tượng Cầu Vàng Bà Nà Hills, dạo thuyền thả hoa đăng phố cổ Hội An, viếng chùa Linh Ứng Bán Đảo Sơn Trà, du thuyền ngắm cầu Rồng phun lửa',
    'Vé máy bay Vietjet Air khứ hồi (gồm 7kg xách tay), Khách sạn 4 sao gần biển Mỹ Khê, Vé cáp treo Bà Nà + Buffet thượng hạng, Vé tham quan phố cổ Hội An',
    1
),
(
    3,
    'Tour Hà Nội - Sapa - Fansipan 4N3Đ - Chinh Phục Nóc Nhà Đông Dương',
    'Sapa & Hà Nội',
    'TP. Hồ Chí Minh',
    '4 Ngày 3 Đêm',
    4, 3,
    4990000,
    'VN',
    'Vietjet Travel',
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&h=400&fit=crop',
    'Boeing 787-9 Dreamliner',
    'morning',
    4.8, 180,
    'Chinh phục đỉnh Fansipan 3.143m ngắm biển mây bồng bềnh, dạo bản Cát Cát của người H''Mông, khám phá thung lũng Mường Hoa và 36 phố phường Hà Nội',
    'Vé máy bay khứ hồi tiêu chuẩn, Xe limousine khứ hồi Hà Nội - Sapa, Khách sạn trung tâm Sapa 4 sao, Vé cáp treo Fansipan Sun World, Hướng dẫn viên địa phương nhiệt tình',
    1
),
(
    4,
    'Tour Nha Trang 3N2Đ - Khám Phá Vịnh San Hô & Thiên Đường VinWonders',
    'Nha Trang',
    'TP. Hồ Chí Minh',
    '3 Ngày 2 Đêm',
    3, 2,
    3490000,
    'VJ',
    'Vietjet Holidays',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
    'Airbus A320',
    'afternoon',
    4.9, 195,
    'Du ngoạn cano cao tốc 4 đảo vịnh Nha Trang, lặn ngắm rặng san hô tự nhiên Bãi Tranh, tắm bùn khoáng nóng I-Resort hồi phục sức khỏe, quẩy hết mình tại VinWonders',
    'Vé máy bay Vietjet, Khách sạn 4 sao mặt tiền biển đường Trần Phú, Cano cao tốc riêng tham quan đảo, Vé vào cổng VinWonders không giới hạn trò chơi',
    1
),
(
    5,
    'Tour Bangkok - Pattaya 5N4Đ - Khám Phá Xứ Sở Chùa Vàng Thái Lan',
    'Bangkok & Pattaya (Thái Lan)',
    'TP. Hồ Chí Minh',
    '5 Ngày 4 Đêm',
    5, 4,
    6290000,
    'VJ',
    'Vietjet Air Tour',
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop',
    'Airbus A321neo',
    'morning',
    4.8, 412,
    'Chiêm bái Chùa Phật Vàng Wat Traimit, dạo thuyền trên sông huyền thoại Chao Phraya, đảo San Hô Coral Island Pattaya, thưởng thức buffet 86 tầng Baiyoke Sky',
    'Vé máy bay khứ hồi Vietjet quốc tế + 20kg ký gửi, Khách sạn 4-5 sao trung tâm, Toàn bộ bữa ăn chất lượng (Buffet lẩu Suki, Baiyoke Sky), Show nghệ thuật Alcazar Colosseum',
    1
),
(
    6,
    'Tour Seoul - Nami - Công Viên Everland Hàn Quốc 5N4Đ Mùa Tuyệt Đẹp',
    'Seoul & Gyeonggi (Hàn Quốc)',
    'Hà Nội / TP.HCM',
    '5 Ngày 4 Đêm',
    5, 4,
    14990000,
    'VJ',
    'Vietjet Global',
    'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600&h=400&fit=crop',
    'Airbus A330-300 Widebody',
    'night',
    5.0, 276,
    'Dạo bước trên đảo Nami lãng mạn phim Bản Tình Ca Mùa Đông, công viên giải trí hàng đầu Everland, Cung điện hoàng gia Gyeongbokgung, check-in Tháp N Seoul',
    'Vé máy bay khứ hồi máy bay thân rộng A330, Visa nhập cảnh Hàn Quốc trọn gói, Khách sạn 4 sao chuẩn Hàn Quốc, Trải nghiệm mặc Hanbok miễn phí, Thưởng thức gà hầm sâm & BBQ Hàn Quốc',
    1
),
(
    7,
    'Tour Tokyo - Núi Phú Sĩ - Làng Cổ Oshino Hakkai Nhật Bản 6N5Đ',
    'Tokyo & Yamanashi (Nhật Bản)',
    'TP. Hồ Chí Minh',
    '6 Ngày 5 Đêm',
    6, 5,
    23990000,
    'SQ',
    'Vietjet Global',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&h=400&fit=crop',
    'Boeing 787-10 Dreamliner',
    'morning',
    4.9, 158,
    'Chạm tay vào Núi Phú Sĩ biểu tượng xứ Phù Tang, dạo bước làng cổ Oshino Hakkai thanh bình dưới chân núi, chùa cổ Asakusa Sensoji, phố Shibuya sầm uất',
    'Vé máy bay tiêu chuẩn quốc tế 5 sao (hành lý 2 kiện 46kg), Khách sạn 4 sao Nhật Bản, Trải nghiệm tắm suối khoáng nóng tự nhiên Onsen, Bữa ăn bò Wagyu và cua tuyết hảo hạng',
    1
),
(
    8,
    'Tour Liên Tuyến Singapore - Malaysia 5N4Đ Đẳng Cấp Hiện Đại',
    'Singapore & Kuala Lumpur',
    'TP. Hồ Chí Minh',
    '5 Ngày 4 Đêm',
    5, 4,
    9890000,
    'VJ',
    'Vietjet Global',
    'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop',
    'Airbus A321',
    'afternoon',
    4.9, 320,
    'Chiêm ngưỡng siêu cây ánh sáng Gardens by the Bay Singapore, check-in tượng Merlion, Tháp đôi Petronas Malaysia, chinh phục động huyền bí Batu & cao nguyên Genting',
    'Vé máy bay khứ hồi (bay đến Singapore - bay về từ Kuala Lumpur), Xe du lịch máy lạnh chất lượng cao xuyên biên giới, Khách sạn 4 sao tiêu chuẩn quốc tế, Trọn gói các vé thắng cảnh',
    1
);

-- Lịch trình chi tiết các tour tiêu biểu
INSERT INTO tour_itineraries (tour_id, day_number, title, description, meals, stay) VALUES
(1, 1, 'TP.HCM - Phú Quốc - Khám Phá Grand World Thành Phố Không Ngủ', 'Sáng xe và HDV đón quý khách tại Sân bay Phú Quốc. Xe đưa đoàn về nhận phòng khách sạn 4 sao nghỉ ngơi. Chiều di chuyển đến Grand World: check-in kênh đào Venice thơ mộng, bảo tàng Gấu Teddy, show diễn thực cảnh Tinh hoa Việt Nam.', 'Trưa, Tối', 'Resort 4 sao bãi biển'),
(1, 2, 'Cáp Treo Hòn Thơm - Cano 4 Đảo - Lặn Ngắm San Hô Tự Nhiên', 'Sau bữa sáng buffet, đoàn lên cano cao tốc tham quan Hòn Móng Tay, Hòn Gầm Ghì, Hòn Mây Rút. Trải nghiệm lặn ngắm rặng san hô đa sắc màu. Chiều trải nghiệm cáp treo Hòn Thơm vượt biển dài nhất thế giới ngắm toàn cảnh hoàng hôn biển Tây Nam.', 'Sáng, Trưa, Tối', 'Resort 4 sao bãi biển'),
(1, 3, 'Trang Trại Ngọc Trai - Nhà Thùng Nước Mắm - Tiễn Bay Về TP.HCM', 'Đoàn ăn sáng và tự do tắm biển bãi cát trắng mịn. Xe đưa đoàn tham quan trang trại ngọc trai Phú Quốc, nhà thùng nước mắm truyền thống lâu đời, vườn tiêu Suối Đá. Sau bữa trưa, đoàn ra sân bay làm thủ tục bay về TP.HCM.', 'Sáng, Trưa', 'Về điểm xuất phát'),

(2, 1, 'TP.HCM - Đà Nẵng - Bán Đảo Sơn Trà - Phố Cổ Hội An Lung Linh', 'Đoàn đáp chuyến bay đến Đà Nẵng. Xe đón đoàn viếng Chùa Linh Ứng Bán đảo Sơn Trà chiêm bái tượng Phật Bà 67m. Buổi chiều về phố cổ Hội An: tham quan Chùa Cầu, nhà cổ Tấn Ký, thả hoa đăng trên dòng sông Hoài thơ mộng.', 'Trưa, Tối', 'Khách sạn 4 sao biển Mỹ Khê'),
(2, 2, 'Khu Du Lịch Sun World Bà Nà Hills - Check-in Cầu Vàng Kỳ Quan', 'Khởi hành lên đỉnh Bà Nà Hills bằng tuyến cáp treo đạt nhiều kỷ lục thế giới. Dạo bước trên Cầu Vàng lừng danh thế giới được nâng đỡ bởi bàn tay khổng lồ, làng Pháp cổ kính, vui chơi tại Fantasy Park. Thưởng thức buffet quốc tế hơn 100 món.', 'Sáng, Trưa, Tối', 'Khách sạn 4 sao biển Mỹ Khê'),
(2, 3, 'Ngũ Hành Sơn - Làng Đá Mỹ Nghệ Non Nước - Du Thuyền Sông Hàn', 'Tham quan danh thắng Ngũ Hành Sơn huyền ảo với động Huyền Không, Vọng Giang Đài. Mua sắm tại làng đá điêu khắc Non Nước. Buổi tối lên du thuyền ngắm Cầu Rồng phun lửa và phun nước đặc sắc.', 'Sáng, Trưa, Tối', 'Khách sạn 4 sao biển Mỹ Khê'),
(2, 4, 'Tắm Biển Mỹ Khê - Chợ Hàn Mua Đặc Sản - Tiễn Sân Bay', 'Tự do tắm biển Mỹ Khê một trong những bãi biển đẹp nhất hành tinh. Mua sắm đặc sản chả bò, mực rim me tại Chợ Hàn. Xe đưa đoàn ra sân bay Đà Nẵng làm thủ tục về lại TP.HCM.', 'Sáng, Trưa', 'Về điểm xuất phát');

-- Dữ liệu Chuyến Bay
INSERT INTO flights (
    id, flight_number, airline_code, origin_code, dest_code,
    departure_time, arrival_time, duration, departure_date, return_date,
    price_economy, price_business, aircraft_type, trip_type, is_direct, time_slot, amenities
) VALUES
-- Tuyến SGN -> HAN
(1, 'VJ-120', 'VJ', 'SGN', 'HAN', '06:15', '08:25', '2h 10m', '2026-11-15', '2026-11-20', 799000, 2450000, 'Airbus A321neo', 'round_trip', 1, 'morning', '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn"}'),
(2, 'VJ-134', 'VJ', 'SGN', 'HAN', '09:30', '11:40', '2h 10m', '2026-11-15', NULL, 890000, 2690000, 'Airbus A321neo', 'one_way', 1, 'morning', '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn"}'),
(3, 'VJ-152', 'VJ', 'SGN', 'HAN', '14:20', '16:30', '2h 10m', '2026-11-15', NULL, 850000, 2590000, 'Airbus A330-300', 'one_way', 1, 'afternoon', '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Rộng rãi"}'),
(4, 'VJ-178', 'VJ', 'SGN', 'HAN', '20:15', '22:25', '2h 10m', '2026-11-15', NULL, 720000, 2390000, 'Airbus A321', 'one_way', 1, 'night', '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn"}'),
(5, 'VJ-102', 'VJ', 'SGN', 'HAN', '05:15', '07:25', '2h 10m', '2026-11-15', NULL, 690000, 2290000, 'Airbus A321neo', 'one_way', 1, 'early', '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn"}'),
(6, 'VN-210', 'VN', 'SGN', 'HAN', '07:00', '09:10', '2h 10m', '2026-11-15', '2026-11-20', 1250000, 3850000, 'Boeing 787-9', 'round_trip', 1, 'morning', '{"baggage": "12kg xách tay + 23kg ký gửi", "meal": "Bữa ăn nóng", "seat": "Màn hình riêng"}'),
(7, 'VN-254', 'VN', 'SGN', 'HAN', '11:15', '13:25', '2h 10m', '2026-11-15', NULL, 1350000, 4100000, 'Airbus A350-900', 'one_way', 1, 'morning', '{"baggage": "12kg xách tay + 23kg ký gửi", "meal": "Bữa ăn nóng", "seat": "Màn hình riêng"}'),
(8, 'QH-202', 'QH', 'SGN', 'HAN', '08:30', '10:40', '2h 10m', '2026-11-15', NULL, 990000, 2890000, 'Boeing 787-9', 'one_way', 1, 'morning', '{"baggage": "7kg xách tay + 20kg ký gửi", "meal": "Suất ăn nhẹ", "seat": "Thoải mái"}'),

-- Tuyến HAN -> SGN
(9, 'VJ-121', 'VJ', 'HAN', 'SGN', '09:00', '11:15', '2h 15m', '2026-11-16', NULL, 799000, 2450000, 'Airbus A321neo', 'one_way', 1, 'morning', '{"baggage": "7kg xách tay", "meal": "Mua thêm"}'),
(10, 'VN-211', 'VN', 'HAN', 'SGN', '10:30', '12:45', '2h 15m', '2026-11-16', NULL, 1290000, 3890000, 'Boeing 787-9', 'one_way', 1, 'morning', '{"baggage": "12kg xách tay + 23kg ký gửi", "meal": "Bữa ăn nóng"}'),

-- Tuyến SGN -> DAD
(11, 'VJ-622', 'VJ', 'SGN', 'DAD', '07:30', '08:50', '1h 20m', '2026-11-15', '2026-11-18', 599000, 1890000, 'Airbus A320', 'round_trip', 1, 'morning', '{"baggage": "7kg xách tay", "meal": "Mua thêm"}'),
(12, 'VN-118', 'VN', 'SGN', 'DAD', '10:00', '11:20', '1h 20m', '2026-11-15', NULL, 950000, 2400000, 'Airbus A321', 'one_way', 1, 'morning', '{"baggage": "12kg xách tay + 23kg ký gửi", "meal": "Nước suối"}'),
(13, 'VJ-638', 'VJ', 'SGN', 'DAD', '16:45', '18:05', '1h 20m', '2026-11-15', NULL, 550000, 1790000, 'Airbus A321', 'one_way', 1, 'afternoon', '{"baggage": "7kg xách tay", "meal": "Mua thêm"}'),

-- Tuyến SGN -> PQC
(14, 'VJ-320', 'VJ', 'SGN', 'PQC', '08:00', '09:00', '1h 00m', '2026-11-15', '2026-11-18', 490000, 1690000, 'Airbus A321neo', 'round_trip', 1, 'morning', '{"baggage": "7kg xách tay", "meal": "Mua thêm"}'),
(15, 'VN-1822', 'VN', 'SGN', 'PQC', '13:30', '14:35', '1h 05m', '2026-11-15', NULL, 890000, 2200000, 'Airbus A321', 'one_way', 1, 'afternoon', '{"baggage": "12kg xách tay + 23kg ký gửi"}'),

-- Tuyến Quốc tế
(16, 'VJ-801', 'VJ', 'SGN', 'BKK', '09:15', '10:45', '1h 30m', '2026-11-15', '2026-11-20', 1190000, 3290000, 'Airbus A321', 'round_trip', 1, 'morning', '{"baggage": "7kg xách tay"}'),
(17, 'AK-520', 'AK', 'SGN', 'BKK', '15:00', '16:35', '1h 35m', '2026-11-15', NULL, 1150000, 2990000, 'Airbus A320', 'one_way', 1, 'afternoon', '{"baggage": "7kg xách tay"}'),
(18, 'SQ-178', 'SQ', 'SGN', 'SIN', '12:15', '15:20', '2h 05m', '2026-11-15', '2026-11-20', 2450000, 6800000, 'Boeing 787-10', 'round_trip', 1, 'afternoon', '{"baggage": "15kg xách tay + 30kg ký gửi", "meal": "Bữa ăn 5 sao"}'),
(19, 'VJ-813', 'VJ', 'SGN', 'SIN', '14:10', '17:15', '2h 05m', '2026-11-15', NULL, 1390000, 3690000, 'Airbus A321neo', 'one_way', 1, 'afternoon', '{"baggage": "7kg xách tay"}'),
(20, 'VJ-862', 'VJ', 'SGN', 'ICN', '23:45', '06:55 (+1)', '5h 10m', '2026-11-15', '2026-11-21', 2890000, 7500000, 'Airbus A330-300', 'round_trip', 1, 'night', '{"baggage": "7kg xách tay + 20kg ký gửi", "meal": "Suất ăn nóng"}');
