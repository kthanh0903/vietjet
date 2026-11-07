# HƯỚNG DẪN TÍCH HỢP GỬI EMAIL XÁC NHẬN (EMAIL_INTEGRATION.MD)

Tài liệu hướng dẫn cấu hình và triển khai tính năng tự động gửi email xác nhận đặt vé/tour từ địa chỉ **`nvhai061993@gmail.com`** đến email của khách hàng khi hoàn tất đặt hàng trong Giỏ hàng mà không cần backend server.

---

## 1. GIẢI PHÁP KỸ THUẬT: EMAILJS (ZERO-BACKEND)

Do website xây dựng hoàn toàn bằng HTML/CSS/JavaScript thuần không có backend, giải pháp tối ưu và an toàn nhất là sử dụng **EmailJS SDK**:
- Thư viện CDN:
  ```html
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
  ```
- **Nguyên lý hoạt động**:
  1. Người dùng bấm nút "Đăng Ký Đặt Vé & Tour" trên trang `cart.html`.
  2. JavaScript thu thập thông tin khách hàng (Tên, SĐT, Email), mã đặt chỗ PNR (ví dụ: `VJ-829104`) và danh sách chuyến bay / tour trong giỏ hàng.
  3. Kích hoạt hàm `sendBookingConfirmationEmail()` gọi API của EmailJS.
  4. EmailJS kết nối với dịch vụ Gmail đã liên kết với `nvhai061993@gmail.com` để gửi email trực tiếp tới hòm thư của khách hàng.

---

## 2. CÁC BƯỚC CẤU HÌNH TÀI KHOẢN EMAILJS (3 PHÚT)

1. Đăng ký tài khoản miễn phí tại: [https://www.emailjs.com/](https://www.emailjs.com/)
2. Tại mục **Email Services**: Bấm **Add New Service** ➔ Chọn **Gmail** ➔ Đăng nhập và ủy quyền tài khoản `nvhai061993@gmail.com` ➔ Lưu lại `SERVICE_ID` (ví dụ: `service_vietjet`).
3. Tại mục **Email Templates**: Bấm **Create New Template** ➔ Đặt tên là `Vietjet Booking Confirmation` ➔ Lưu lại `TEMPLATE_ID` (ví dụ: `template_vietjet_booking`).
4. Tại mục **Account ➔ API Keys**: Lấy `PUBLIC_KEY` (ví dụ: `user_xxxxxxxxxxxx`).

---

## 3. MẪU EMAIL XÁC NHẬN (HTML EMAIL TEMPLATE)

Trong giao diện cấu hình Template trên EmailJS, dán mẫu HTML sau để email gửi tới khách hàng mang đậm bản sắc Vietjet:

```html
<div style="max-width: 650px; margin: 0 auto; font-family: 'Segoe UI', Arial, sans-serif; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
    <!-- Header Đỏ Vietjet -->
    <div style="background-color: #ee1d23; padding: 25px 20px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 1px;">VIETJET AIRWAYS</h1>
        <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Xác Nhận Đặt Chỗ Chuyến Bay & Tour Du Lịch Thành Công</p>
    </div>

    <!-- Nội dung chính -->
    <div style="padding: 25px 30px; background-color: #ffffff; color: #333333; line-height: 1.6;">
        <p style="font-size: 16px;">Kính gửi <strong>{{customer_name}}</strong>,</p>
        <p>Cảm ơn Quý khách đã tin tưởng và lựa chọn dịch vụ của Vietjet. Yêu cầu đặt chỗ của Quý khách đã được tiếp nhận và xử lý thành công.</p>
        
        <!-- Hộp Mã Đặt Chỗ PNR -->
        <div style="background-color: #fff9e6; border: 2px dashed #ffc700; border-radius: 6px; padding: 15px; margin: 20px 0; text-align: center;">
            <span style="font-size: 13px; color: #666; text-transform: uppercase;">MÃ ĐẶT CHỖ (PNR):</span><br>
            <strong style="font-size: 28px; color: #ee1d23; letter-spacing: 2px;">{{booking_code}}</strong>
        </div>

        <!-- Thông Tin Khách Hàng -->
        <h3 style="color: #ee1d23; border-bottom: 2px solid #ee1d23; padding-bottom: 5px; margin-top: 25px;">THÔNG TIN HÀNH KHÁCH</h3>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #666;">Họ và tên:</td><td><strong>{{customer_name}}</strong></td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Số điện thoại:</td><td><strong>{{customer_phone}}</strong></td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Email:</td><td><strong>{{customer_email}}</strong></td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Số CCCD/Hộ chiếu:</td><td><strong>{{customer_id_card}}</strong></td></tr>
        </table>

        <!-- Chi Tiết Dịch Vụ Đã Đặt -->
        <h3 style="color: #ee1d23; border-bottom: 2px solid #ee1d23; padding-bottom: 5px; margin-top: 25px;">DANH SÁCH VÉ & TOUR ĐÃ ĐẶT</h3>
        <div style="background: #fdfdfd; padding: 10px; border: 1px solid #eee; border-radius: 4px; font-size: 14px;">
            {{{order_summary_html}}}
        </div>

        <!-- Tổng Thanh Toán -->
        <div style="text-align: right; margin-top: 20px; font-size: 16px;">
            <span>Tổng cộng thanh toán: </span>
            <strong style="font-size: 22px; color: #ee1d23;">{{total_amount}} ₫</strong>
        </div>
        <p style="font-size: 13px; color: #777; text-align: right;">Phương thức: {{payment_method}}</p>

        <!-- Lời nhắc -->
        <div style="background: #f0f7ff; border-left: 4px solid #0066cc; padding: 12px; margin: 25px 0; font-size: 13px; color: #444;">
            ℹ️ <strong>Lưu ý quan trọng:</strong> Quý khách vui lòng có mặt tại sân bay ít nhất <strong>02 tiếng</strong> trước giờ khởi hành đối với chuyến bay nội địa và <strong>03 tiếng</strong> đối với chuyến bay quốc tế. Mang theo CCCD hoặc Hộ chiếu còn hạn.
        </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f7f7f7; padding: 20px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eeeeee;">
        <p style="margin: 0 0 5px;">Thư được gửi tự động từ hệ thống Vietjet Booking: <strong>nvhai061993@gmail.com</strong></p>
        <p style="margin: 0;">Tổng đài hỗ trợ 24/7: <strong style="color: #ee1d23;">1900 1886</strong> | Email: support@vietjetair.com</p>
    </div>
</div>
```

---

## 4. CODE JAVASCRIPT GỬI EMAIL CHUẨN (`js/email.js`)

File này cài đặt sẵn hàm gửi thư, có tích hợp cơ chế mô phỏng tự động thông minh (nếu người dùng chưa điền API Key thực tế thì vẫn hiển thị thông báo thành công đẹp mắt mà không bao giờ bị lỗi crash ứng dụng):

```javascript
/**
 * js/email.js - Module gửi Email xác nhận qua EmailJS
 */
const EMAIL_CONFIG = {
    SERVICE_ID: 'service_vietjet',      // Thay bằng Service ID thực tế của EmailJS
    TEMPLATE_ID: 'template_vietjet',    // Thay bằng Template ID thực tế của EmailJS
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY',      // Thay bằng Public Key từ EmailJS Dashboard
    SENDER_EMAIL: 'nvhai061993@gmail.com'
};

// Khởi tạo EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
    }
})();

/**
 * Gửi email xác nhận đặt vé/tour
 * @param {Object} orderData - Dữ liệu đơn hàng và khách hàng
 * @returns {Promise<boolean>}
 */
async function sendBookingEmail(orderData) {
    console.log(`📧 Đang khởi tạo gửi email từ ${EMAIL_CONFIG.SENDER_EMAIL} đến ${orderData.customer_email}...`);

    // Chuẩn bị dữ liệu truyền vào template
    const templateParams = {
        from_email: EMAIL_CONFIG.SENDER_EMAIL,
        to_email: orderData.customer_email,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        customer_email: orderData.customer_email,
        customer_id_card: orderData.customer_id_card,
        booking_code: orderData.booking_code,
        total_amount: orderData.total_amount.toLocaleString('vi-VN'),
        payment_method: orderData.payment_method,
        order_summary_html: orderData.items.map(item => `
            <div style="padding: 6px 0; border-bottom: 1px solid #eee;">
                <strong>${item.item_name}</strong> (${item.details || ''})<br>
                Số lượng: ${item.quantity} | Giá: ${item.price.toLocaleString('vi-VN')} ₫
            </div>
        `).join('')
    };

    // Kiểm tra xem đã thiết lập API Key hợp lệ chưa
    if (typeof emailjs !== 'undefined' && EMAIL_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        try {
            const response = await emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATE_ID, templateParams);
            console.log('✅ Gửi email thành công qua EmailJS:', response.status, response.text);
            return true;
        } catch (error) {
            console.warn('⚠️ Lỗi gửi email thực tế qua EmailJS:', error);
            // Vẫn tiếp tục quy trình để người dùng không bị gián đoạn trải nghiệm
            return false;
        }
    } else {
        // Chế độ mô phỏng chuyên nghiệp cho môi trường Local / Demo
        console.log('⚡ Chế độ Demo: Đã mô phỏng gửi thành công email từ nvhai061993@gmail.com tới:', orderData.customer_email);
        console.table(templateParams);
        return true;
    }
}
```
