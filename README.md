# DỰ ÁN WEBSITE DU LỊCH & ĐẶT VÉ MÁY BAY VIETJET

Chào mừng bạn đến với dự án website du lịch thương mại điện tử **Vietjet**. Bộ tài liệu Markdown (.MD) này được thiết kế và chuẩn hóa chuyên biệt để bạn và AI Agent **Antigravity** có thể lập trình, xây dựng và quản trị toàn bộ website một cách chuẩn xác nhất.

---

## 1. DANH MỤC CÁC FILE TÀI LIỆU .MD DÀNH CHO ANTIGRAVITY

Trong thư mục gốc của dự án, các file tài liệu Markdown sau đã được khởi tạo hoàn chỉnh:

| Tên File | Vai trò & Mục đích |
| :--- | :--- |
| **`GEMINI.md`** | **Bộ quy tắc không gian làm việc (Workspace Context & Rules)** cho Antigravity. Định nghĩa kiến trúc không backend, quy tắc màu sắc, cấu trúc thư mục và chuẩn mực code. |
| **`PROJECT_SPEC.md`** | **Bản đặc tả yêu cầu sản phẩm chi tiết (PRD)** cho tất cả 6 trang: Trang chủ, Chuyến bay, Chi tiết chuyến bay, Tour, Chi tiết tour, Giỏ hàng & Thanh toán. |
| **`DATABASE_SCHEMA.md`** | **Thiết kế cơ sở dữ liệu SQLite client-side (sql.js WASM)**, đầy đủ câu lệnh tạo bảng (DDL), dữ liệu mẫu (Seed Data) cho 8 tour, các hãng hàng không và chuyến bay. |
| **`UI_COMPONENTS.md`** | **Quy chuẩn thành phần giao diện & Design System**: Bảng màu (#ee1d23 đỏ Vietjet, #ffc700 vàng, #ffffff nền trắng), thẻ chọn hạng vé Phổ thông & Thương gia ("giống trong hình"), layout 8 tour (thumbnail 600x400), lưới logo hãng bay. |
| **`EMAIL_INTEGRATION.md`** | **Hướng dẫn & Code tích hợp gửi Email tự động** từ `nvhai061993@gmail.com` đến email khách hàng bằng EmailJS (chạy thuần trên client không cần backend). |
| **`TASKS.md`** | **Kế hoạch triển khai & Bộ câu lệnh mẫu (Prompts)** theo từng giai đoạn giúp bạn copy trực tiếp gửi cho Antigravity để sinh mã nguồn từng trang. |
| **`README.md`** | Tài liệu tổng quan và hướng dẫn sử dụng (file này). |

---

## 2. TỔNG QUAN YÊU CẦU DỰ ÁN

- **Tên thương hiệu**: Vietjet
- **Công nghệ**: HTML5, CSS3, JavaScript ES6+ thuần (Vanilla JS), **không sử dụng backend**.
- **Cơ sở dữ liệu**: **SQLite** chạy trực tiếp trong trình duyệt thông qua **SQL.js (WebAssembly)**, lưu trữ bền vững vào `localStorage`.
- **Màu sắc chủ đạo**:
  - Đỏ Vietjet: `#ee1d23`
  - Vàng tươi: `#ffc700`
  - Nền: Sáng / Trắng tinh (`#ffffff`)
- **Hình ảnh có sẵn trong thư mục `images/`**:
  - Banner tiếp viên Vietjet: `images/1794032794427_...jpg`
  - Logo chính thức Vietjet: `images/1794032794428_...jpg`
  - Máy bay Vietjet trên bầu trời: `images/1794032794429_...jpg`

---

## 3. CÁCH SỬ DỤNG VỚI ANTIGRAVITY ĐỂ TẠO TOÀN BỘ CODE

Bạn có 2 cách cực kỳ thuận tiện để yêu cầu Antigravity hoàn thành website:

### Cách 1: Yêu cầu Antigravity làm toàn bộ website tự động (Nhanh nhất)
Bạn chỉ cần gửi yêu cầu tiếp theo trong cửa sổ chat này:
> *"Dựa vào các file .MD đã tạo (GEMINI.md, PROJECT_SPEC.md, DATABASE_SCHEMA.md, UI_COMPONENTS.md, EMAIL_INTEGRATION.md), hãy tiến hành code hoàn chỉnh toàn bộ website Vietjet cho tôi: gồm CSDL SQLite, CSS, Trang chủ, Chuyến bay, Chi tiết chuyến bay, Tour, Chi tiết tour, Giỏ hàng và tính năng gửi email."*

Antigravity sẽ tự động đọc các file đặc tả và sinh ra toàn bộ mã nguồn HTML/CSS/JS hoạt động ngay lập tức.

### Cách 2: Triển khai theo từng giai đoạn (Kiểm soát chi tiết)
Mở file **`TASKS.md`**, copy từng mẫu prompt ở Bước 1, Bước 2, Bước 3... và gửi cho Antigravity theo tiến độ mong muốn của bạn.

---

## 4. HƯỚNG DẪN CHẠY VÀ XEM THỬ WEBSITE

Khi mã nguồn đã được tạo:
1. Bạn có thể sử dụng tiện ích mở rộng **Live Server** trên IDE (Visual Studio Code / Antigravity IDE) và bấm **Go Live**.
2. Hoặc mở trực tiếp file `index.html` bằng trình duyệt Chrome, Edge, Cốc Cốc, Firefox.
3. Khi đặt vé trong Giỏ hàng, hệ thống sẽ tự động thông báo hoàn thành và gửi email xác nhận từ `nvhai061993@gmail.com` tới email bạn nhập.
