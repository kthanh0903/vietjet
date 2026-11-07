# ĐẶC TẢ YÊU CẦU DỰ ÁN WEBSITE DU LỊCH VIETJET (PROJECT_SPEC.MD)

Tài liệu đặc tả chi tiết toàn bộ tính năng, giao diện, luồng người dùng (User Flows) và logic nghiệp vụ cho website Vietjet.

---

## 1. MỤC TIÊU & ĐỊNH HƯỚNG DỰ ÁN
Website được xây dựng nhằm cung cấp trải nghiệm đặt vé máy bay và tour du lịch trọn gói trực tuyến với giao diện chuẩn nhận diện Vietjet Air:
- **Tông màu chủ đạo**: Đỏ rực rỡ (`#ee1d23`), Vàng kim (`#ffc700`), Nền trắng tinh khiết (`#ffffff`).
- **Nền tảng**: 100% Frontend (HTML, CSS, JS thuần), cơ sở dữ liệu SQLite chạy client-side, hỗ trợ gửi email tự động khi hoàn tất đặt vé.

---

## 2. CHI TIẾT TỪNG TRANG & CHỨC NĂNG

### 2.1. TRANG CHỦ (`index.html`)

#### A. Thanh Header & Navigation
- **Logo Vietjet Air**: Hiển thị ảnh logo chuẩn tại `images/1794032794428_...jpg`. Click vào logo luôn đưa về trang chủ.
- **Menu chính**:
  - Trang chủ
  - Chuyến bay (`flights.html`)
  - Tour du lịch (`tour.html`)
  - Giỏ hàng (`cart.html`) kèm theo Badge đỏ hiển thị số lượng mục đã chọn (cập nhật realtime).
- **Khu vực Hotline**: `1900 1886` kèm icon tai nghe / hỗ trợ 24/7.

#### B. Hero Section & Hộp Tìm Kiếm Chuyến Bay (Flight Search Box)
- **Hình nền Banner**: Sử dụng hình ảnh tiếp viên Vietjet (`images/1794032794427_...jpg`) và máy bay Vietjet (`images/1794032794429_...jpg`).
- **Bộ điều khiển loại vé**:
  - Radio button / Tabs chọn: **Khứ hồi (Round-trip)** hoặc **Một chiều (One-way)**.
  - Khi chọn "Một chiều", ô "Ngày về" tự động mờ đi (disabled) và không bắt buộc.
- **Các trường nhập liệu tìm kiếm**:
  1. **Điểm xuất phát (Departure)**: Dropdown danh sách các sân bay lớn (TP. Hồ Chí Minh - SGN, Hà Nội - HAN, Đà Nẵng - DAD, Nha Trang - CXR, Phú Quốc - PQC, Bangkok - BKK, Seoul - ICN, Tokyo - NRT, Singapore - SIN...).
  2. **Điểm đến (Destination)**: Dropdown tương ứng, có cơ chế validation ngăn chọn điểm đến trùng điểm đi.
  3. **Ngày đi (Departure Date)**: Datepicker (mặc định ngày hiện tại hoặc ngày mai, không cho chọn ngày quá khứ).
  4. **Ngày về (Return Date)**: Datepicker (chỉ kích hoạt khi chọn Khứ hồi, phải >= Ngày đi).
  5. **Số lượng hành khách**: Người lớn (12+ tuổi), Trẻ em (2-11 tuổi), Em bé (< 2 tuổi).
  6. **Hạng ghế mặc định**: Phổ thông (Economy) hoặc Thương gia (Business).
- **Hành động**:
  - Nút **"Tìm Kiếm"** (màu đỏ `#ee1d23`, hover có hiệu ứng nổi bật):
  - Thu thập toàn bộ tham số tìm kiếm và chuyển hướng sang `flights.html` kèm query string, ví dụ:
    `flights.html?from=SGN&to=HAN&depart=2026-11-10&trip=roundtrip`

#### C. Phần Tour Du Lịch Nổi Bật (Featured Tours)
- **Tiêu đề**: "Tour Du Lịch Hấp Dẫn Nhất 2026" kèm slogan cuốn hút.
- **Danh sách hiển thị**: **Đúng 8 tour du lịch nổi bật nhất**:
  1. Tour Phú Quốc 3N2Đ - Thiên đường đảo ngọc - Vietjet Holidays
  2. Tour Đà Nẵng - Hội An - Bà Nà Hills 4N3Đ - Vietjet Travel
  3. Tour Hà Nội - Sapa - Fansipan 4N3Đ - Vietjet Travel
  4. Tour Nha Trang - Vịnh San Hô 3N2Đ - Vietjet Holidays
  5. Tour Bangkok - Pattaya Thái Lan 5N4Đ - Vietjet Air Tour
  6. Tour Seoul - Đảo Nami - Everland Hàn Quốc 5N4Đ - Vietjet Global
  7. Tour Tokyo - Núi Phú Sĩ Nhật Bản 6N5Đ - Vietjet Global
  8. Tour Singapore - Malaysia 5N4Đ - Vietjet Global
- **Cấu trúc mỗi thẻ tour (Card)**:
  - Hình ảnh thumbnail kích thước chuẩn **600x400 px** sắc nét, có hiệu ứng zoom nhẹ khi hover.
  - Tên hãng du lịch / hàng không đồng hành (Vietjet Travel, Vietjet Holidays,...).
  - Thời gian: Số ngày / đêm (ví dụ: `4 Ngày 3 Đêm`).
  - Giá tour: Hiển thị giá nổi bật màu đỏ (ví dụ: `4.590.000 ₫`).
  - Đánh giá sao (⭐⭐⭐⭐⭐ 4.9/5) và số lượt đặt.
  - Nút **"Xem chi tiết"**: Click vào dẫn thẳng đến trang `tour-detail.html?id=[tour_id]`.
- Nút phụ dưới cùng: "Xem tất cả tour" -> chuyển đến `tour.html`.

#### D. Phần Đối Tác Hàng Không (Airlines Logos)
- **Tiêu đề**: "Các Hãng Hàng Không Đối Tác Tin Cậy".
- **Lưới logo các hãng**:
  - **VietJet Air** (Logo chính thức của hãng `images/1794032794428_...jpg`)
  - **Vietnam Airlines**
  - **Singapore Airlines**
  - **Bamboo Airways**
  - **AirAsia**
  - **Qatar Airways**
- **Hành động click**:
  - Click vào logo hãng nào sẽ tự động chuyển hướng đến trang Chuyến bay với bộ lọc hãng đó:
    Ví dụ: Click VietJet Air -> `flights.html?airline=VietJet%20Air`
    Click Vietnam Airlines -> `flights.html?airline=Vietnam%20Airlines`
    Click Singapore Airlines -> `flights.html?airline=Singapore%20Airlines`

---

### 2.2. TRANG DANH SÁCH CHUYẾN BAY (`flights.html`)

Trang hiển thị theo bố cục 2 cột tiêu chuẩn của các trang OTA lớn (Agoda, Traveloka, Skyscanner):

#### A. Cột bên trái: Bộ Lọc Nâng Cao (Filters Sidebar)
1. **Sắp xếp giá vé**:
   - Giá tăng dần (Mặc định)
   - Giá giảm dần
2. **Loại vé**:
   - Tất cả
   - Vé một chiều
   - Vé khứ hồi
3. **Số chặng bay**:
   - Bay thẳng (Non-stop)
   - Nhiều thành phố / 1 điểm dừng
4. **Hãng hàng không**:
   - Checkbox: VietJet Air, Vietnam Airlines, Singapore Airlines, Bamboo Airways, Vietravel Airlines.
5. **Thời gian cất cánh (Khung giờ)**:
   - Sáng sớm (00:00 - 06:00)
   - Buổi sáng (06:00 - 12:00)
   - Buổi chiều (12:00 - 18:00)
   - Buổi tối (18:00 - 24:00)
6. **Hạng dịch vụ**:
   - Hạng Phổ Thông (Economy)
   - Hạng Thương Gia (Business)
7. **Nút "Xóa bộ lọc" (Reset filter)**: Đưa các tiêu chí về mặc định.

#### B. Cột bên phải: Danh Sách Chuyến Bay (Flight List Cards)
- Hiển thị số lượng chuyến bay tìm thấy tương ứng.
- **Thông tin chi tiết trên mỗi thẻ chuyến bay**:
  - Logo và tên hãng hàng không (VietJet Air, Vietnam Airlines,...).
  - Mã chuyến bay (VJ-182, VN-246, SQ-178,...).
  - Giờ cất cánh & Giờ hạ cánh (kèm mã sân bay đi/đến, ví dụ: `06:30 SGN` ➔ `08:40 HAN`).
  - Thời gian bay tổng cộng (ví dụ: `2h 10m`).
  - Loại chuyến bay: "Bay thẳng".
  - Dịch vụ bao gồm: Icon hành lý 7kg, nước suối, giải trí...
  - Mức giá khởi điểm tốt nhất (ví dụ: `799.000 ₫/khách`).
  - Nút **"Chọn chuyến bay"**: Chuyển hướng người dùng sang `flight-detail.html?id=[flight_id]`.

---

### 2.3. TRANG CHI TIẾT CHUYẾN BAY (`flight-detail.html`)

#### A. Thông Tin Chặng Bay Đầy Đủ
- Điểm đi - Điểm đến: Tên sân bay chi tiết và thành phố.
- Ngày khởi hành và giờ cất cánh, giờ hạ cánh dự kiến.
- Thời gian bay tổng cộng.
- Tên hãng hàng không & Số hiệu chuyến bay.
- **Loại tàu bay thực hiện**: Hiển thị rõ loại máy bay (ví dụ: `Airbus A321neo`, `Airbus A330-300`, `Boeing 787-9 Dreamliner`).

#### B. Khối Chọn Hạng Vé (Ticket Class Selector - "Giống Trong Hình")
Gồm 2 thẻ so sánh hạng vé trực quan, hiện đại:
1. **Thẻ Hạng Phổ Thông (Economy / Eco)**:
   - Giá vé cơ bản (ví dụ: `890.000 ₫`).
   - Huy hiệu (Badge): "Tiết kiệm nhất".
   - Quyền lợi chi tiết:
     - ✅ Hành lý xách tay: 7kg
     - ❌ Chưa bao gồm hành lý ký gửi (mua thêm tùy nhu cầu)
     - ❌ Suất ăn nóng: Mua thêm
     - ⚠️ Đổi ngày bay/giờ bay: Thu phí đổi + chênh lệch giá vé
     - ❌ Hoàn vé / Hủy vé: Không áp dụng
     - ✅ Ghế ngồi tiêu chuẩn êm ái
2. **Thẻ Hạng Thương Gia (Business / SkyBoss)**:
   - Giá vé cao cấp (ví dụ: `2.690.000 ₫`).
   - Huy hiệu (Badge) vàng kim: "Đẳng cấp & Tiện nghi vượt trội".
   - Quyền lợi chi tiết:
     - ⭐ Hành lý xách tay: 14kg (2 kiện)
     - ⭐ Hành lý ký gửi: 30kg - 40kg miễn phí
     - ⭐ Sử dụng Phòng chờ Thương gia sang trọng (VIP Lounge)
     - ⭐ Ưu tiên làm thủ tục tại quầy riêng, lối đi an ninh ưu tiên
     - ⭐ Xe riêng đưa đón ra tàu bay
     - ⭐ Phục vụ ẩm thực nóng tươi ngon & đồ uống miễn phí suốt chuyến bay
     - ⭐ Miễn phí chọn chỗ ngồi hàng đầu rộng rãi
     - ⭐ Miễn phí đổi ngày bay, giờ bay, chặng bay

#### C. Hành Động
- Người dùng chọn 1 trong 2 hạng vé (radio hoặc click trực tiếp vào thẻ để active).
- Nút **"Thêm Vào Giỏ Hàng"** (màu đỏ lớn):
  - Lưu thông tin chuyến bay đã kèm hạng vé đã chọn vào SQLite / `localStorage`.
  - Hiển thị Toast thông báo thành công.
  - Tự động chuyển hướng hoặc cung cấp nút "Xem giỏ hàng" (`cart.html`).

---

### 2.4. TRANG DANH SÁCH TOUR DU LỊCH (`tour.html`)

#### A. Cột bên trái: Bộ Lọc Tour (Filters Sidebar)
1. **Sắp xếp giá tour**: Tăng dần / Giảm dần.
2. **Hãng hàng không / Đơn vị tổ chức**: Vietjet Air, Vietnam Airlines, Vietjet Travel, Vietjet Holidays...
3. **Thời gian cất cánh / Khung giờ xuất phát**: Sáng, Trưa, Chiều, Tối.
4. **Thời lượng tour**: 3N2Đ, 4N3Đ, 5N4Đ, 6N5Đ...

#### B. Cột bên phải: Danh Sách Tour (Tour List Cards)
- Hình ảnh tour sắc nét (tỷ lệ 600x400 px).
- Tên tour đầy đủ, địa danh du lịch.
- Hãng hàng không vận chuyển (kèm logo).
- Ngày khởi hành (hàng tuần hoặc ngày cụ thể).
- Thời gian hành trình (ví dụ: `4 Ngày 3 Đêm`).
- Dịch vụ bao gồm: Vé máy bay khứ hồi, Khách sạn 4-5 sao, Xe đưa đón đời mới, Hướng dẫn viên, Vé tham quan, Bảo hiểm du lịch.
- Giá tiền trọn gói nổi bật (màu đỏ).
- Nút **"Chi Tiết Tour"**: Dẫn sang `tour-detail.html?id=[tour_id]`.

---

### 2.5. TRANG CHI TIẾT TOUR (`tour-detail.html`)

#### A. Thông Tin Chuyến Đi & Chuyến Bay Đi Kèm
- Tên tour du lịch và địa điểm xuất phát, điểm đến.
- Hãng hàng không đồng hành & Loại máy bay vận chuyển (Boeing 787, Airbus A321...).
- Thời gian bay & ngày đi, ngày về.
- Khách sạn tiêu chuẩn (4 sao / 5 sao).

#### B. Lịch Trình Chuyến Đi Chi Tiết (Tour Itinerary Timeline)
Hiển thị dạng dòng thời gian (Timeline) trực quan:
- **Ngày 1**: Đón đoàn tại sân bay - Bay đến điểm du lịch - Nhận phòng khách sạn - Ăn tối & Khám phá đêm.
- **Ngày 2**: Tham quan các danh lam thắng cảnh nổi tiếng - Trải nghiệm văn hóa & Ẩm thực đặc sản.
- **Ngày 3**: Hoạt động ngoài trời (Tắm biển / Vui chơi công viên giải trí / Leo núi / Cáp treo) - Tự do mua sắm.
- **Ngày 4**: Trả phòng - Mua sắm quà lưu niệm - Ra sân bay về lại điểm xuất phát - Kết thúc tour.

#### C. Bảng Đặt Tour & Hành Động
- Chọn số lượng hành khách: Người lớn, Trẻ em (giá trẻ em = 75% giá người lớn).
- Tính tổng chi phí tạm tính.
- Nút **"Đặt Tour / Lưu Vào Giỏ Hàng"**:
  - Ghi nhận thông tin tour vào giỏ hàng CSDL SQLite.
  - Chuyển hướng người dùng sang trang Giỏ Hàng (`cart.html`).

---

### 2.6. TRANG GIỎ HÀNG & THANH TOÁN (`cart.html`)

#### A. Danh Sách Mục Đã Chọn Trong Giỏ Hàng
- Bảng hiển thị danh sách các Chuyến bay và Tour đã chọn:
  - Cột: Loại mục (Vé máy bay / Tour du lịch), Tên chi tiết (Hành trình, Hạng vé, Ngày bay), Đơn giá, Số lượng, Thành tiền, Thao tác.
  - Nút **"Xóa"** từng mục: Xóa mục tương ứng và cập nhật lại giỏ hàng realtime.
  - Nút **"Xóa toàn bộ giỏ hàng"**: Dọn dẹp sạch giỏ hàng với thông báo xác nhận.
- **Bảng tổng kết tài chính**:
  - Tạm tính: Tổng tiền hàng.
  - Thuế GTGT & Phí dịch vụ sân bay: 10% (hoặc miễn phí).
  - **TỔNG CỘNG THANH TOÁN**: Chữ đỏ lớn, định dạng rõ ràng (ví dụ: `5.480.000 ₫`).

#### B. Form Nhập Thông Tin Khách Hàng
Các trường bắt buộc:
1. **Họ và tên**: (Ví dụ: Nguyễn Văn Hải)
2. **Số điện thoại**: (Kiểm tra định dạng SĐT Việt Nam 10 chữ số)
3. **Địa chỉ Email**: (Email của khách để nhận thư xác nhận vé)
4. **Số CCCD / Hộ chiếu**: (Thông tin đăng ký bay chuẩn hàng không)
5. **Địa chỉ liên hệ**: (Tỉnh/Thành phố)
6. **Ghi chú đặc biệt**: (Yêu cầu suất ăn chay, ghế ngồi gần cửa sổ...)
7. **Phương thức thanh toán**:
   - Chuyển khoản ngân hàng qua mã VietQR (Tự động tạo QR code thanh toán nhanh)
   - Thẻ tín dụng / Ghi nợ quốc tế (Visa, Mastercard, JCB)
   - Thẻ ATM nội địa / Internet Banking
   - Thanh toán giữ chỗ (Thanh toán tại đại lý trong vòng 24h)

#### C. Nút "Đăng Ký Đặt Vé & Tour"
- Bấm nút kích hoạt chuỗi xử lý:
  1. Validate kiểm tra form thông tin khách hàng.
  2. Tạo mã đặt vé ngẫu nhiên (Mã PNR), ví dụ: `VJ-893271`.
  3. Lưu đơn hàng thành công vào bảng `orders` của CSDL SQLite.
  4. Gửi email xác nhận từ `nvhai061993@gmail.com` đến địa chỉ email khách hàng vừa nhập.
  5. Xóa giỏ hàng hiện tại.
  6. Mở **Modal Popup "Thông Báo Hoàn Thành"** sang trọng:
     - Biểu tượng check xanh thành công.
     - Dòng chữ: "Đặt Chỗ Thành Công! Cảm ơn Quý khách đã lựa chọn Vietjet."
     - Mã đặt chỗ (PNR): `VJ-XXXXXX`.
     - Thông báo: "Thư xác nhận chi tiết vé đã được gửi từ nvhai061993@gmail.com đến email của bạn."
     - Nút "Về Trang Chủ" và "Xem Lại Đơn Hàng".
