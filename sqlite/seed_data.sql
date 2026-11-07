-- ====================================================================
-- HỆ THỐNG CƠ SỞ DỮ LIỆU SQLITE - WEBSITE DU LỊCH & ĐẶT VÉ VIETJET
-- File: sqlite/seed_data.sql
-- Nạp dữ liệu mẫu (Seed Data): Sân bay, Hãng bay, 8 Tour nổi bật, Chuyến bay
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. DỮ LIỆU CÁC SÂN BAY (AIRPORTS)
-- --------------------------------------------------------------------
INSERT OR REPLACE INTO airports (code, name, city, country) VALUES
('SGN', 'Sân bay Quốc tế Tân Sơn Nhất', 'TP. Hồ Chí Minh', 'Việt Nam'),
('HAN', 'Sân bay Quốc tế Nội Bài', 'Hà Nội', 'Việt Nam'),
('DAD', 'Sân bay Quốc tế Đà Nẵng', 'Đà Nẵng', 'Việt Nam'),
('CXR', 'Sân bay Quốc tế Cam Ranh', 'Nha Trang', 'Việt Nam'),
('PQC', 'Sân bay Quốc tế Phú Quốc', 'Phú Quốc', 'Việt Nam'),
('BKK', 'Sân bay Quốc tế Suvarnabhumi', 'Bangkok', 'Thái Lan'),
('ICN', 'Sân bay Quốc tế Incheon', 'Seoul', 'Hàn Quốc'),
('NRT', 'Sân bay Quốc tế Narita', 'Tokyo', 'Nhật Bản'),
('SIN', 'Sân bay Quốc tế Changi', 'Singapore', 'Singapore');

-- --------------------------------------------------------------------
-- 2. DỮ LIỆU CÁC HÃNG HÀNG KHÔNG ĐỐI TÁC (AIRLINES)
-- --------------------------------------------------------------------
INSERT OR REPLACE INTO airlines (code, name, logo_url, website, country) VALUES
('VJ', 'VietJet Air', 'images/1794032794428_7798941419347914444_g4111106518249197050_b20246c106060b907dfe9e17d280275d.jpg', 'https://www.vietjetair.com', 'Việt Nam'),
('VN', 'Vietnam Airlines', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Vietnam_Airlines_logo.svg/320px-Vietnam_Airlines_logo.svg.png', 'https://www.vietnamairlines.com', 'Việt Nam'),
('QH', 'Bamboo Airways', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Bamboo_Airways_logo.svg/320px-Bamboo_Airways_logo.svg.png', 'https://www.bambooairways.com', 'Việt Nam'),
('SQ', 'Singapore Airlines', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/320px-Singapore_Airlines_Logo_2.svg.png', 'https://www.singaporeair.com', 'Singapore'),
('AK', 'AirAsia', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/320px-AirAsia_New_Logo.svg.png', 'https://www.airasia.com', 'Malaysia'),
('QR', 'Qatar Airways', 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/320px-Qatar_Airways_Logo.svg.png', 'https://www.qatarairways.com', 'Qatar');

-- --------------------------------------------------------------------
-- 3. DỮ LIỆU 8 TOUR DU LỊCH NỔI BẬT (THUMBNAIL 600x400 PX CHUẨN)
-- --------------------------------------------------------------------
INSERT OR REPLACE INTO tours (
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

-- --------------------------------------------------------------------
-- 4. DỮ LIỆU LỊCH TRÌNH CHI TIẾT TỪNG TOUR (TOUR_ITINERARIES)
-- --------------------------------------------------------------------
-- Lịch trình Tour Phú Quốc 3N2Đ (Tour ID = 1)
INSERT OR REPLACE INTO tour_itineraries (tour_id, day_number, title, description, meals, stay) VALUES
(1, 1, 'TP.HCM - Phú Quốc - Khám Phá Grand World Thành Phố Không Ngủ', 'Sáng xe và HDV đón quý khách tại Sân bay Phú Quốc. Xe đưa đoàn về nhận phòng khách sạn 4 sao nghỉ ngơi. Chiều di chuyển đến Grand World: check-in kênh đào Venice thơ mộng, bảo tàng Gấu Teddy, show diễn thực cảnh Tinh hoa Việt Nam.', 'Trưa, Tối', 'Resort 4 sao bãi biển'),
(1, 2, 'Cáp Treo Hòn Thơm - Cano 4 Đảo - Lặn Ngắm San Hô Tự Nhiên', 'Sau bữa sáng buffet, đoàn lên cano cao tốc tham quan Hòn Móng Tay, Hòn Gầm Ghì, Hòn Mây Rút. Trải nghiệm lặn ngắm rặng san hô đa sắc màu. Chiều trải nghiệm cáp treo Hòn Thơm vượt biển dài nhất thế giới ngắm toàn cảnh hoàng hôn biển Tây Nam.', 'Sáng, Trưa, Tối', 'Resort 4 sao bãi biển'),
(1, 3, 'Trang Trại Ngọc Trai - Nhà Thùng Nước Mắm - Tiễn Bay Về TP.HCM', 'Đoàn ăn sáng và tự do tắm biển bãi cát trắng mịn. Xe đưa đoàn tham quan trang trại ngọc trai Phú Quốc, nhà thùng nước mắm truyền thống lâu đời, vườn tiêu Suối Đá. Sau bữa trưa, đoàn ra sân bay làm thủ tục bay về TP.HCM.', 'Sáng, Trưa', 'Về điểm xuất phát');

-- Lịch trình Tour Đà Nẵng - Hội An (Tour ID = 2)
INSERT OR REPLACE INTO tour_itineraries (tour_id, day_number, title, description, meals, stay) VALUES
(2, 1, 'TP.HCM - Đà Nẵng - Bán Đảo Sơn Trà - Phố Cổ Hội An Lung Linh', 'Đoàn đáp chuyến bay đến Đà Nẵng. Xe đón đoàn viếng Chùa Linh Ứng Bán đảo Sơn Trà chiêm bái tượng Phật Bà 67m. Buổi chiều về phố cổ Hội An: tham quan Chùa Cầu, nhà cổ Tấn Ký, thả hoa đăng trên dòng sông Hoài thơ mộng.', 'Trưa, Tối', 'Khách sạn 4 sao biển Mỹ Khê'),
(2, 2, 'Khu Du Lịch Sun World Bà Nà Hills - Check-in Cầu Vàng Kỳ Quan', 'Khởi hành lên đỉnh Bà Nà Hills bằng tuyến cáp treo đạt nhiều kỷ lục thế giới. Dạo bước trên Cầu Vàng lừng danh thế giới được nâng đỡ bởi bàn tay khổng lồ, làng Pháp cổ kính, vui chơi tại Fantasy Park. Thưởng thức buffet quốc tế hơn 100 món.', 'Sáng, Trưa, Tối', 'Khách sạn 4 sao biển Mỹ Khê'),
(2, 3, 'Ngũ Hành Sơn - Làng Đá Mỹ Nghệ Non Nước - Du Thuyền Sông Hàn', 'Tham quan danh thắng Ngũ Hành Sơn huyền ảo với động Huyền Không, Vọng Giang Đài. Mua sắm tại làng đá điêu khắc Non Nước. Buổi tối lên du thuyền ngắm Cầu Rồng phun lửa và phun nước đặc sắc.', 'Sáng, Trưa, Tối', 'Khách sạn 4 sao biển Mỹ Khê'),
(2, 4, 'Tắm Biển Mỹ Khê - Chợ Hàn Mua Đặc Sản - Tiễn Sân Bay', 'Tự do tắm biển Mỹ Khê một trong những bãi biển đẹp nhất hành tinh. Mua sắm đặc sản chả bò, mực rim me tại Chợ Hàn. Xe đưa đoàn ra sân bay Đà Nẵng làm thủ tục về lại TP.HCM.', 'Sáng, Trưa', 'Về điểm xuất phát');

-- Lịch trình Tour Bangkok - Pattaya (Tour ID = 5)
INSERT OR REPLACE INTO tour_itineraries (tour_id, day_number, title, description, meals, stay) VALUES
(5, 1, 'TP.HCM - Bangkok - Thành Phố Biển Pattaya Sôi Động', 'Đoàn tập trung tại sân bay Tân Sơn Nhất, bay chuyến bay Vietjet sang Bangkok. Xe đón đoàn di chuyển về thành phố biển Pattaya. Dạo chợ nổi 4 miền Thái Lan thưởng thức ẩm thực đường phố.', 'Trưa, Tối', 'Khách sạn 4 sao Pattaya'),
(5, 2, 'Đảo San Hô Coral Island - Trân Bảo Phật Sơn Khao Chee Chan', 'Lên cano cao tốc ra Đảo San Hô Coral, tham gia các trò chơi dù bay, lặn biển ngắm san hô. Chiều viếng Trân Bảo Phật Sơn tượng Phật khắc vàng 24K khổng lồ trên vách núi đá. Tối xem Alcazar Show đẳng cấp quốc tế.', 'Sáng, Trưa, Tối', 'Khách sạn 4 sao Pattaya'),
(5, 3, 'Pattaya - Bangkok - Trung Tâm Nghiên Cứu Rắn Hoàng Gia', 'Rời Pattaya về thủ đô Bangkok. Trên đường ghé trung tâm nghiên cứu nọc rắn Hoàng Gia Thái Lan, trại nuôi ong Big Bee. Thưởng thức lẩu Suki truyền thống Thái Lan.', 'Sáng, Trưa, Tối', 'Khách sạn 4 sao Bangkok'),
(5, 4, 'Chùa Phật Vàng Wat Traimit - Dạo Thuyền Sông Chao Phraya - Buffet Baiyoke Sky', 'Viếng Wat Traimit chiêm ngưỡng tượng Phật bằng vàng nguyên khối nặng 5.5 tấn. Dạo thuyền ngắm cá nổi trên sông mẹ Chao Phraya. Ăn trưa buffet tại toà nhà cao nhất Thái Lan Baiyoke Sky 86 tầng. Chiều tự do shopping tại IconSiam.', 'Sáng, Trưa, Tối', 'Khách sạn 4 sao Bangkok'),
(5, 5, 'Chùa Thuyền Wat Yannawa - Mua Sắm Big C - Tiễn Sân Bay Về TP.HCM', 'Viếng Chùa Thuyền độc đáo Wat Yannawa. Xe đưa đoàn đi mua sắm quà lưu niệm tại trung tâm thương mại Big C Pratunam. Ra sân bay Suvarnabhumi làm thủ tục bay về Việt Nam.', 'Sáng, Trưa', 'Về điểm xuất phát');

-- --------------------------------------------------------------------
-- 5. DỮ LIỆU CÁC CHUYẾN BAY THỰC TẾ (FLIGHTS)
-- Đầy đủ các khung giờ, tuyến bay trong nước & quốc tế, giá Phổ thông / Thương gia
-- --------------------------------------------------------------------
INSERT OR REPLACE INTO flights (
    id, flight_number, airline_code, origin_code, dest_code,
    departure_time, arrival_time, duration, departure_date, return_date,
    price_economy, price_business, aircraft_type, trip_type, is_direct, time_slot, amenities
) VALUES
-- Tuyến SGN -> HAN (TP.HCM đi Hà Nội)
(
    1, 'VJ-120', 'VJ', 'SGN', 'HAN',
    '06:15', '08:25', '2h 10m', '2026-11-15', '2026-11-20',
    799000, 2450000, 'Airbus A321neo', 'round_trip', 1, 'morning',
    '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn", "wifi": "Không"}'
),
(
    2, 'VJ-134', 'VJ', 'SGN', 'HAN',
    '09:30', '11:40', '2h 10m', '2026-11-15', NULL,
    890000, 2690000, 'Airbus A321neo', 'one_way', 1, 'morning',
    '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn", "wifi": "Không"}'
),
(
    3, 'VJ-152', 'VJ', 'SGN', 'HAN',
    '14:20', '16:30', '2h 10m', '2026-11-15', NULL,
    850000, 2590000, 'Airbus A330-300 Widebody', 'one_way', 1, 'afternoon',
    '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Rộng rãi", "wifi": "Có phí"}'
),
(
    4, 'VJ-178', 'VJ', 'SGN', 'HAN',
    '20:15', '22:25', '2h 10m', '2026-11-15', NULL,
    720000, 2390000, 'Airbus A321', 'one_way', 1, 'night',
    '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn", "wifi": "Không"}'
),
(
    5, 'VJ-102', 'VJ', 'SGN', 'HAN',
    '05:15', '07:25', '2h 10m', '2026-11-15', NULL,
    690000, 2290000, 'Airbus A321neo', 'one_way', 1, 'early',
    '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn", "wifi": "Không"}'
),
(
    6, 'VN-210', 'VN', 'SGN', 'HAN',
    '07:00', '09:10', '2h 10m', '2026-11-15', '2026-11-20',
    1250000, 3850000, 'Boeing 787-9 Dreamliner', 'round_trip', 1, 'morning',
    '{"baggage": "12kg xách tay + 23kg ký gửi", "meal": "Bữa ăn nóng miễn phí", "seat": "Màn hình riêng", "wifi": "Có"}'
),
(
    7, 'VN-254', 'VN', 'SGN', 'HAN',
    '11:15', '13:25', '2h 10m', '2026-11-15', NULL,
    1350000, 4100000, 'Airbus A350-900', 'one_way', 1, 'morning',
    '{"baggage": "12kg xách tay + 23kg ký gửi", "meal": "Bữa ăn nóng miễn phí", "seat": "Màn hình riêng", "wifi": "Có"}'
),
(
    8, 'QH-202', 'QH', 'SGN', 'HAN',
    '08:30', '10:40', '2h 10m', '2026-11-15', NULL,
    990000, 2890000, 'Boeing 787-9 Dreamliner', 'one_way', 1, 'morning',
    '{"baggage": "7kg xách tay + 20kg ký gửi", "meal": "Suất ăn nhẹ", "seat": "Thoải mái", "wifi": "Không"}'
),

-- Tuyến HAN -> SGN (Hà Nội đi TP.HCM)
(
    9, 'VJ-121', 'VJ', 'HAN', 'SGN',
    '09:00', '11:15', '2h 15m', '2026-11-16', NULL,
    799000, 2450000, 'Airbus A321neo', 'one_way', 1, 'morning',
    '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn", "wifi": "Không"}'
),
(
    10, 'VN-211', 'VN', 'HAN', 'SGN',
    '10:30', '12:45', '2h 15m', '2026-11-16', NULL,
    1290000, 3890000, 'Boeing 787-9', 'one_way', 1, 'morning',
    '{"baggage": "12kg xách tay + 23kg ký gửi", "meal": "Bữa ăn nóng", "seat": "Tiện nghi", "wifi": "Có"}'
),

-- Tuyến SGN -> DAD (TP.HCM đi Đà Nẵng)
(
    11, 'VJ-622', 'VJ', 'SGN', 'DAD',
    '07:30', '08:50', '1h 20m', '2026-11-15', '2026-11-18',
    599000, 1890000, 'Airbus A320', 'round_trip', 1, 'morning',
    '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn", "wifi": "Không"}'
),
(
    12, 'VN-118', 'VN', 'SGN', 'DAD',
    '10:00', '11:20', '1h 20m', '2026-11-15', NULL,
    950000, 2400000, 'Airbus A321', 'one_way', 1, 'morning',
    '{"baggage": "12kg xách tay + 23kg ký gửi", "meal": "Nước suối + khăn lạnh", "seat": "Tiêu chuẩn", "wifi": "Không"}'
),
(
    13, 'VJ-638', 'VJ', 'SGN', 'DAD',
    '16:45', '18:05', '1h 20m', '2026-11-15', NULL,
    550000, 1790000, 'Airbus A321', 'one_way', 1, 'afternoon',
    '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn", "wifi": "Không"}'
),

-- Tuyến SGN -> PQC (TP.HCM đi Phú Quốc)
(
    14, 'VJ-320', 'VJ', 'SGN', 'PQC',
    '08:00', '09:00', '1h 00m', '2026-11-15', '2026-11-18',
    490000, 1690000, 'Airbus A321neo', 'round_trip', 1, 'morning',
    '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn", "wifi": "Không"}'
),
(
    15, 'VN-1822', 'VN', 'SGN', 'PQC',
    '13:30', '14:35', '1h 05m', '2026-11-15', NULL,
    890000, 2200000, 'Airbus A321', 'one_way', 1, 'afternoon',
    '{"baggage": "12kg xách tay + 23kg ký gửi", "meal": "Nước suối", "seat": "Tiêu chuẩn", "wifi": "Không"}'
),

-- Tuyến Quốc tế: SGN -> BKK (TP.HCM đi Bangkok Thái Lan)
(
    16, 'VJ-801', 'VJ', 'SGN', 'BKK',
    '09:15', '10:45', '1h 30m', '2026-11-15', '2026-11-20',
    1190000, 3290000, 'Airbus A321', 'round_trip', 1, 'morning',
    '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn", "wifi": "Không"}'
),
(
    17, 'AK-520', 'AK', 'SGN', 'BKK',
    '15:00', '16:35', '1h 35m', '2026-11-15', NULL,
    1150000, 2990000, 'Airbus A320', 'one_way', 1, 'afternoon',
    '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn", "wifi": "Không"}'
),

-- Tuyến Quốc tế: SGN -> SIN (TP.HCM đi Singapore)
(
    18, 'SQ-178', 'SQ', 'SGN', 'SIN',
    '12:15', '15:20', '2h 05m', '2026-11-15', '2026-11-20',
    2450000, 6800000, 'Boeing 787-10 Dreamliner', 'round_trip', 1, 'afternoon',
    '{"baggage": "15kg xách tay + 30kg ký gửi", "meal": "Bữa ăn 5 sao cao cấp", "seat": "Hạng thương gia cao cấp", "wifi": "Miễn phí"}'
),
(
    19, 'VJ-813', 'VJ', 'SGN', 'SIN',
    '14:10', '17:15', '2h 05m', '2026-11-15', NULL,
    1390000, 3690000, 'Airbus A321neo', 'one_way', 1, 'afternoon',
    '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn", "wifi": "Không"}'
),

-- Tuyến Quốc tế: SGN -> ICN (TP.HCM đi Seoul Hàn Quốc)
(
    20, 'VJ-862', 'VJ', 'SGN', 'ICN',
    '23:45', '06:55 (+1)', '5h 10m', '2026-11-15', '2026-11-21',
    2890000, 7500000, 'Airbus A330-300 Widebody', 'round_trip', 1, 'night',
    '{"baggage": "7kg xách tay + 20kg ký gửi", "meal": "Suất ăn nóng", "seat": "Ghế ngả thoải mái", "wifi": "Có"}'
);
