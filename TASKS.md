# KẾ HOẠCH TRIỂN KHAI & CÂU LỆNH MẪU CHO ANTIGRAVITY (TASKS.MD)

Tài liệu này chia dự án thành các giai đoạn (Phases) và tác vụ (Tasks) cụ thể kèm theo **mẫu câu lệnh (Prompts)** bạn có thể copy trực tiếp gửi cho Antigravity để tạo ra từng file code.

---

## BẢNG TIẾN ĐỘ TỔNG QUAN

| Giai đoạn | Tác vụ | File liên quan | Trạng thái |
| :--- | :--- | :--- | :--- |
| **P1** | Khởi tạo CSDL SQLite Client | `js/database.js`, `data/seed_data.sql` | ⏳ Sẵn sàng |
| **P2** | Hệ thống CSS & Layout chung | `css/style.css` | ⏳ Sẵn sàng |
| **P3** | Trang chủ & Tìm chuyến bay & 8 Tour | `index.html`, `js/home.js` | ⏳ Sẵn sàng |
| **P4** | Trang Chuyến bay & Bộ lọc đa năng | `flights.html`, `css/flights.css`, `js/flights.js` | ⏳ Sẵn sàng |
| **P5** | Trang Chi tiết Chuyến bay & Chọn hạng vé | `flight-detail.html`, `js/flight-detail.js` | ⏳ Sẵn sàng |
| **P6** | Trang Danh sách Tour du lịch | `tour.html`, `css/tour.css`, `js/tour.js` | ⏳ Sẵn sàng |
| **P7** | Trang Chi tiết Tour & Lịch trình | `tour-detail.html`, `js/tour-detail.js` | ⏳ Sẵn sàng |
| **P8** | Giỏ hàng, Đặt vé & Gửi Email | `cart.html`, `css/cart.css`, `js/cart.js`, `js/email.js` | ⏳ Sẵn sàng |
| **P9** | Kiểm thử & Hoàn thiện | Toàn bộ dự án | ⏳ Sẵn sàng |

---

## CHI TIẾT TỪNG BƯỚC & PROMPT DÀNH CHO ANTIGRAVITY

### BƯỚC 1: XÂY DỰNG CƠ SỞ DỮ LIỆU SQLITE CLIENT (`js/database.js`)
> **Mục tiêu**: Tạo lớp trừu tượng `VietjetDB` nạp thư viện `sql.js` (WebAssembly), tự động tạo bảng và nạp dữ liệu mẫu (8 tour, danh sách hãng bay, chuyến bay mẫu) và đồng bộ với `localStorage`.

**Mẫu Prompt gửi cho Antigravity:**
```text
Hãy dựa vào file DATABASE_SCHEMA.md để tạo file data/seed_data.sql và js/database.js.
Yêu cầu:
- Tích hợp SQL.js (WebAssembly) chạy trực tiếp trên trình duyệt từ CDN.
- Tự động nạp dữ liệu mẫu khi người dùng mở trang lần đầu và lưu trạng thái vào localStorage.
- Cung cấp các hàm API query(sql, params), execute(sql, params), getFlights(filter), getTours(filter), addToCart(item), getCartItems(), removeCartItem(id), clearCart(), createOrder(orderData).
```

---

### BƯỚC 2: THIẾT KẾ HỆ THỐNG GIAO DIỆN & CSS CHUẨN VIETJET (`css/style.css`)
> **Mục tiêu**: Thiết lập bộ nhận diện thương hiệu Vietjet (Màu đỏ `#ee1d23`, vàng `#ffc700`, nền trắng `#ffffff`), Header, Thanh menu kèm badge Giỏ hàng, Footer, các nút bấm chuẩn và hiệu ứng hover.

**Mẫu Prompt gửi cho Antigravity:**
```text
Hãy dựa vào file UI_COMPONENTS.md và GEMINI.md để tạo file css/style.css và js/app.js.
Yêu cầu:
- Khai báo đầy đủ các biến màu sắc Vietjet chuẩn.
- Thiết kế thanh Navbar cố định (Header) gồm: Logo Vietjet Air (dẫn từ images/1794032794428_...jpg), menu Trang chủ, Chuyến bay, Tour, Hotline 1900 1886, và nút Giỏ hàng có Badge tròn đỏ hiển thị số lượng mục.
- Thiết kế Footer đầy đủ thông tin liên hệ, bản quyền Vietjet.
- js/app.js quản lý cập nhật số lượng giỏ hàng trên badge ở mọi trang, định dạng tiền tệ vi-VN.
```

---

### BƯỚC 3: XÂY DỰNG TRANG CHỦ (`index.html` & `js/home.js`)
> **Mục tiêu**: 
> 1. Hero banner hình ảnh tiếp viên Vietjet (`images/1794032794427_...jpg`) và máy bay (`images/1794032794429_...jpg`).
> 2. Box tìm kiếm chuyến bay (Khứ hồi / Một chiều, Nơi đi, Nơi đến, Ngày bay, Hành khách) -> Chuyển hướng `flights.html`.
> 3. Hiển thị đúng 8 Tour nổi bật (ảnh thumbnail 600x400 px, hãng du lịch, số ngày đêm, giá tour, rating) -> Chuyển hướng trang Tour.
> 4. Phần Logo các hãng bay (VietJet Air, Vietnam Airlines, Bamboo Airways, Singapore Airlines, AirAsia...) -> Click lọc chuyến bay theo hãng.

**Mẫu Prompt gửi cho Antigravity:**
```text
Hãy dựa vào PROJECT_SPEC.md để tạo file index.html và js/home.js.
Yêu cầu:
- Tạo Banner Hero đẹp mắt sử dụng các ảnh trong thư mục images/.
- Tạo Hộp tìm kiếm chuyến bay chuẩn hàng không: chọn khứ hồi/một chiều, điểm đi/đến từ danh sách sân bay trong SQLite, khi bấm 'Tìm Kiếm' sẽ dẫn đến flights.html kèm query parameters.
- Hiển thị danh sách 8 tour du lịch nổi bật lấy từ CSDL SQLite, có ảnh 600x400, số ngày/đêm, giá tiền, hãng du lịch. Click vào tour dẫn đến trang chi tiết tour.
- Hiển thị lưới logo các hãng bay (VietJet Air, Vietnam Airlines, Singapore Airlines...). Click vào logo chuyển sang flights.html đã được lọc theo hãng đó.
```

---

### BƯỚC 4: XÂY DỰNG TRANG CHUYẾN BAY & BỘ LỌC (`flights.html`, `js/flights.js`, `css/flights.css`)
> **Mục tiêu**: Bố cục 2 cột tiêu chuẩn:
> - Cột trái: Bộ lọc sắp xếp giá tăng/giảm dần, vé khứ hồi/một chiều, bay thẳng/nhiều điểm dừng, hãng hàng không, khung giờ bay (sáng sớm, sáng, chiều, tối), hạng dịch vụ (phổ thông/thương gia).
> - Cột phải: Danh sách chuyến bay lấy từ CSDL SQLite, hiển thị giờ bay, thời lượng, giá tiền, dịch vụ. Click chuyến bay chuyển đến trang chi tiết chuyến bay.

**Mẫu Prompt gửi cho Antigravity:**
```text
Hãy dựa vào PROJECT_SPEC.md để tạo file flights.html, css/flights.css và js/flights.js.
Yêu cầu:
- Tiếp nhận các tham số tìm kiếm từ URL (from, to, date, trip, airline).
- Cột bên trái là bộ lọc đầy đủ: Sắp xếp giá tăng/giảm, Loại vé (khứ hồi/một chiều), Hãng bay, Khung giờ cất cánh, Hạng dịch vụ. Khi thay đổi bộ lọc, danh sách tự động cập nhật realtime từ SQLite.
- Cột bên phải hiển thị các thẻ chuyến bay đẹp mắt, đầy đủ mã chuyến bay, giờ đi - đến, thời gian bay, loại máy bay, giá từ.
- Bấm nút 'Chọn chuyến bay' chuyển sang trang flight-detail.html?id=[id].
```

---

### BƯỚC 5: TRANG CHI TIẾT CHUYẾN BAY & BẢNG CHỌN HẠNG VÉ (`flight-detail.html`, `js/flight-detail.js`)
> **Mục tiêu**:
> - Hiển thị chi tiết hành trình: Điểm đi, điểm đến, thời gian bay, hãng bay, loại máy bay (Boeing, Airbus...).
> - **Chọn giá vé: Hạng Phổ Thông, Hạng Thương Gia (giống trong hình và theo UI_COMPONENTS.md)**.
> - Bấm chọn chuyến bay sẽ lưu vào Giỏ Hàng trong SQLite và chuyển sang `cart.html`.

**Mẫu Prompt gửi cho Antigravity:**
```text
Hãy dựa vào UI_COMPONENTS.md và PROJECT_SPEC.md để tạo file flight-detail.html và js/flight-detail.js.
Yêu cầu:
- Lấy thông tin chuyến bay từ SQLite theo id trên URL.
- Hiển thị thông tin hành trình chi tiết, hãng bay, loại máy bay (Airbus A321neo / Boeing 787).
- Thiết kế 2 thẻ chọn hạng vé: Hạng Phổ Thông (Eco) và Hạng Thương Gia (SkyBoss) với so sánh chi tiết quyền lợi (hành lý, phòng chờ VIP, suất ăn, hoàn đổi vé).
- Khi người dùng click chọn hạng vé và bấm 'Lưu vào Giỏ Hàng', lưu vào CSDL SQLite / localStorage, cập nhật badge giỏ hàng và mở thông báo toast hoặc chuyển đến cart.html.
```

---

### BƯỚC 6: TRANG DANH SÁCH TOUR DU LỊCH (`tour.html`, `js/tour.js`, `css/tour.css`)
> **Mục tiêu**: 
> - Cột trái: Bộ lọc giá tăng/giảm dần, hãng hàng không, thời gian cất cánh.
> - Cột phải: Danh sách các tour, hãng bay, ngày cất cánh, thời gian bay, giá tiền, dịch vụ. Click chọn tour đến trang chi tiết tour.

**Mẫu Prompt gửi cho Antigravity:**
```text
Hãy tạo file tour.html, css/tour.css và js/tour.js theo đặc tả trong PROJECT_SPEC.md.
Yêu cầu:
- Bố cục 2 cột: Cột trái có bộ lọc giá tăng/giảm, hãng bay liên kết, khung giờ xuất phát.
- Cột phải hiển thị danh sách các tour du lịch với hình ảnh 600x400, tên tour, ngày khởi hành, thời gian tour, giá trọn gói và các dịch vụ bao gồm.
- Bấm 'Chi Tiết Tour' dẫn đến tour-detail.html?id=[id].
```

---

### BƯỚC 7: TRANG CHI TIẾT TOUR & LỊCH TRÌNH (`tour-detail.html`, `js/tour-detail.js`)
> **Mục tiêu**:
> - Điểm đi, điểm đến, thời gian bay, hãng bay, loại máy bay (Boeing, Airbus...).
> - Lịch trình chuyến đi chi tiết (Day 1, Day 2, Day 3...).
> - Chọn tour sẽ được lưu vào Giỏ Hàng.

**Mẫu Prompt gửi cho Antigravity:**
```text
Hãy tạo file tour-detail.html và js/tour-detail.js theo đặc tả trong PROJECT_SPEC.md.
Yêu cầu:
- Hiển thị đầy đủ thông tin tour từ SQLite: điểm đi, điểm đến, hãng hàng không đồng hành, loại máy bay vận chuyển, tiêu chuẩn khách sạn.
- Hiển thị Lịch trình chuyến đi chi tiết theo dạng dòng thời gian (Timeline) từng ngày.
- Bộ chọn số lượng hành khách (người lớn, trẻ em) và tính tổng tiền tự động.
- Nút 'Đặt Tour / Thêm Vào Giỏ Hàng' lưu mục vào SQLite và chuyển đến cart.html.
```

---

### BƯỚC 8: GIỎ HÀNG, ĐẶT HÀNG & GỬI EMAIL (`cart.html`, `js/cart.js`, `js/email.js`, `css/cart.css`)
> **Mục tiêu**:
> - Xem danh sách chuyến bay, tour đã chọn; có nút Xóa từng mục và Xóa toàn bộ giỏ hàng.
> - Form nhập thông tin cá nhân khách hàng (Họ tên, SĐT, Email, CCCD, địa chỉ, phương thức thanh toán).
> - Nút Đăng ký -> Thông báo hoàn thành (Popup Modal chuyên nghiệp).
> - Tự động kích hoạt gửi một email xác nhận từ `nvhai061993@gmail.com` đến email khách hàng (EmailJS theo `EMAIL_INTEGRATION.md`).

**Mẫu Prompt gửi cho Antigravity:**
```text
Hãy tạo file cart.html, css/cart.css, js/cart.js và js/email.js theo đặc tả trong PROJECT_SPEC.md và EMAIL_INTEGRATION.md.
Yêu cầu:
- Hiển thị bảng danh sách các vé máy bay và tour đã chọn từ SQLite. Có tính năng xóa từng mục, xóa toàn bộ, tính tổng tiền tự động.
- Form nhập thông tin cá nhân khách hàng đầy đủ và có kiểm tra hợp lệ (validation).
- Khi bấm 'Đăng Ký Đặt Vé & Tour', tạo mã đặt vé PNR, lưu đơn hàng vào SQLite, xóa giỏ hàng, mở Modal thông báo đặt chỗ hoàn tất.
- Gọi hàm gửi email xác nhận đặt hàng từ nvhai061993@gmail.com đến địa chỉ email mà khách vừa nhập bằng EmailJS.
```
