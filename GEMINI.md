# HƯỚNG DẪN DỰ ÁN DÀNH CHO ANTIGRAVITY (GEMINI.MD)

Dự án này là website thương mại điện tử du lịch & đặt vé máy bay mang thương hiệu **Vietjet**. Tài liệu này đóng vai trò là kim chỉ nam và quy tắc ngữ cảnh (Workspace Rules) cho Antigravity khi phát triển codebase.

---

## 1. TỔNG QUAN DỰ ÁN
- **Tên website**: Vietjet
- **Lĩnh vực**: Đặt vé máy bay trực tuyến và Tour du lịch trọn gói
- **Kiến trúc kỹ thuật**: 
  - Frontend thuần: **HTML5, CSS3, JavaScript (ES6+)**
  - **Không sử dụng backend server** (No NodeJS, Python, PHP backend). Toàn bộ logic chạy hoàn toàn trên client (Browser).
  - **Cơ sở dữ liệu**: **SQLite** chạy trực tiếp trên trình duyệt thông qua **SQL.js (WebAssembly)**, lưu trữ bền vững (persistence) vào `localStorage` / `IndexedDB`.
  - **Gửi Email**: Tích hợp dịch vụ phía client **EmailJS** gửi tự động từ `nvhai061993@gmail.com` đến email khách hàng khi đặt vé/tour thành công.

---

## 2. QUY CHUẨN GIAO DIỆN & MÀU SẮC (DESIGN SYSTEM)
- **Phong cách**: Hiện đại, năng động, chuẩn hàng không thương mại điện tử quốc tế.
- **Tông màu chính (Primary Color)**: `#ee1d23` (Đỏ đặc trưng của Vietjet Air)
- **Tông màu phụ (Secondary Color)**: `#ffc700` (Vàng tươi Vietjet)
- **Màu nền (Background)**: Nền sáng / Trắng (`#ffffff`, `#f8f9fa`)
- **Màu chữ (Typography)**: 
  - Chữ chính: `#1a1a1a` hoặc `#2d3748`
  - Chữ phụ: `#718096`
  - Font chữ: `'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif`
- **Bộ nhận diện & Hình ảnh có sẵn trong thư mục `images/`**:
  - Logo chính thức: `images/1794032794428_7798941419347914444_g4111106518249197050_b20246c106060b907dfe9e17d280275d.jpg`
  - Banner tiếp viên Vietjet: `images/1794032794427_7798941419347914444_g4111106518249197050_69fd368cc2bf83bc8ead69ab8ee75135.jpg`
  - Máy bay Vietjet trên bầu trời: `images/1794032794429_7798941419347914444_g4111106518249197050_bf232832dc18edc21193682fbc503c30.jpg`

---

## 3. CẤU TRÚC THƯ MỤC CHUẨN
```
vietjet/
│
├── images/                             # Thư mục hình ảnh dự án
│   ├── 1794032794427_...jpg            # Banner tiếp viên
│   ├── 1794032794428_...jpg            # Logo Vietjet
│   ├── 1794032794429_...jpg            # Máy bay Vietjet
│   ├── airlines/                       # Logo các hãng hàng không
│   └── tours/                          # 8 hình thumbnail tour 600x400
│
├── css/
│   ├── style.css                       # CSS tổng thể, biến màu, reset, layout, components
│   ├── flights.css                     # CSS chuyên biệt cho trang Chuyến bay & Chi tiết
│   ├── tour.css                        # CSS chuyên biệt cho trang Tour & Chi tiết
│   └── cart.css                        # CSS cho Giỏ hàng, Checkout, Modal thông báo
│
├── js/
│   ├── database.js                     # Quản lý SQLite (SQL.js WASM), khởi tạo bảng & dữ liệu mẫu
│   ├── app.js                          # Tiện ích dùng chung (Navbar, giỏ hàng badge, format tiền tệ)
│   ├── home.js                         # Logic trang chủ (Tìm kiếm, hiển thị 8 tour, click hãng)
│   ├── flights.js                      # Logic lọc & hiển thị danh sách chuyến bay
│   ├── flight-detail.js                # Logic chi tiết chuyến bay & chọn hạng vé (Phổ thông / Thương gia)
│   ├── tour.js                         # Logic lọc & hiển thị tour du lịch
│   ├── tour-detail.js                  # Logic chi tiết tour, lịch trình & đặt tour
│   ├── cart.js                         # Logic giỏ hàng, xóa, tính tổng tiền, đặt đơn
│   └── email.js                        # Tích hợp EmailJS gửi thư xác nhận đặt hàng
│
├── data/
│   └── seed_data.sql                   # Mã SQL tạo bảng và nạp dữ liệu mẫu
│
├── index.html                          # Trang chủ (Home)
├── flights.html                        # Trang danh sách Chuyến bay (Flights)
├── flight-detail.html                  # Trang Chi tiết chuyến bay (Flight Detail)
├── tour.html                           # Trang danh sách Tour du lịch (Tour)
├── tour-detail.html                    # Trang Chi tiết tour (Tour Detail)
├── cart.html                           # Trang Giỏ hàng & Thanh toán (Cart)
│
├── GEMINI.md                           # Context & Rules cho Antigravity (file này)
├── PROJECT_SPEC.md                     # Đặc tả yêu cầu chi tiết (PRD)
├── DATABASE_SCHEMA.md                  # Cấu trúc CSDL SQLite & Dữ liệu mẫu
├── UI_COMPONENTS.md                    # Thiết kế chi tiết các thành phần giao diện
├── EMAIL_INTEGRATION.md                # Hướng dẫn & Code gửi Email xác nhận
├── TASKS.md                            # Kế hoạch & Danh sách các tác vụ từng bước
└── README.md                           # Giới thiệu & Hướng dẫn khởi chạy dự án
```

---

## 4. QUY TẮC PHÁT TRIỂN DÀNH CHO ANTIGRAVITY (RULES)

1. **Không tạo mã Backend**:
   - Nghiêm cấm tạo server Express, Fastify, Flask, Django hay bất kỳ backend runtime nào.
   - Toàn bộ ứng dụng phải mở được trực tiếp qua Live Server hoặc double click mở `index.html`.
2. **Quản lý CSDL SQLite Client-side**:
   - Sử dụng thư viện `sql.js` (WebAssembly) được tải từ CDN hoặc fallback sang hệ thống SQLite Client State chuẩn (lưu binary SQLite db hoặc Object Storage đồng bộ LocalStorage).
   - Truy vấn dữ liệu thực tế bằng các câu lệnh SQL chuẩn (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `JOIN`).
3. **Responsive & Trực quan**:
   - Giao diện phải tương thích hoàn hảo trên Desktop (1200px+), Tablet (768px - 1024px) và Mobile (< 768px).
   - Menu điều hướng có hiển thị badge số lượng vé/tour hiện có trong giỏ hàng.
4. **Trải nghiệm người dùng (UX)**:
   - Tất cả giá tiền hiển thị theo định dạng tiền tệ Việt Nam: `1.500.000 ₫` hoặc `1,500,000 VND`.
   - Chọn hạng vé Phổ thông và Thương gia phải trực quan, có so sánh quyền lợi rõ ràng (Hành lý xách tay, hành lý ký gửi, phòng chờ VIP, suất ăn, hoàn đổi vé).
   - Khi bấm "Đăng ký" trong giỏ hàng, kích hoạt popup modal thông báo đặt thành công kèm mã đặt vé PNR, đồng thời kích hoạt hàm gửi email xác nhận.
