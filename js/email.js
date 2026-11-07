/**
 * js/email.js - Module tích hợp gửi Email xác nhận đặt vé/tour
 * Gửi tự động từ nvhai061993@gmail.com đến email của khách hàng qua EmailJS
 */

const EMAIL_CONFIG = {
    SERVICE_ID: 'service_vietjet',       // EmailJS Service ID (Thay khi có tài khoản thực tế)
    TEMPLATE_ID: 'template_vietjet',     // EmailJS Template ID
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY',       // EmailJS Public Key
    SENDER_EMAIL: 'nvhai061993@gmail.com'
};

// Khởi tạo EmailJS SDK nếu đã nhúng thư viện
(function initEmailClient() {
    if (typeof window.emailjs !== 'undefined' && EMAIL_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        window.emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
    }
})();

/**
 * Gửi email xác nhận đặt vé hoặc tour
 * @param {Object} orderData - Dữ liệu đơn hàng bao gồm: customer_name, customer_email, booking_code, items, total_amount, payment_method...
 * @returns {Promise<boolean>}
 */
async function sendBookingConfirmationEmail(orderData) {
    console.log(`%c📧 BẮT ĐẦU GỬI EMAIL XÁC NHẬN`, 'background: #ee1d23; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
    console.log(`Người gửi: ${EMAIL_CONFIG.SENDER_EMAIL}`);
    console.log(`Người nhận: ${orderData.customer_email}`);
    console.log(`Mã đặt chỗ (PNR): ${orderData.booking_code}`);

    const itemsSummary = (orderData.items || []).map(item => `
        - ${item.item_name} | Chi tiết: ${item.details || 'Tiêu chuẩn'} | Số lượng: ${item.quantity} | Giá: ${formatVND(item.price)}
    `).join('\n');

    const templateParams = {
        from_email: EMAIL_CONFIG.SENDER_EMAIL,
        to_email: orderData.customer_email,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        customer_email: orderData.customer_email,
        customer_id_card: orderData.customer_id_card,
        booking_code: orderData.booking_code,
        total_amount: formatVND(orderData.total_amount),
        payment_method: orderData.payment_method,
        order_details: itemsSummary
    };

    // Kiểm tra xem đã có Public Key thực tế của EmailJS chưa
    if (typeof window.emailjs !== 'undefined' && EMAIL_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        try {
            const res = await window.emailjs.send(
                EMAIL_CONFIG.SERVICE_ID,
                EMAIL_CONFIG.TEMPLATE_ID,
                templateParams
            );
            console.log('✅ Gửi email thực tế thành công qua EmailJS:', res);
            return true;
        } catch (error) {
            console.warn('⚠️ Lỗi gửi email qua EmailJS (sẽ fallback sang chế độ mô phỏng):', error);
            // Tiếp tục cho trải nghiệm mượt mà
        }
    }

    // Chế độ mô phỏng (Demo / Local Server)
    console.log('%c⚡ EMAIL ĐÃ ĐƯỢC GỬI THÀNH CÔNG (MÔ PHỎNG CLIENT-SIDE)!', 'color: #10b981; font-weight: bold;');
    console.table({
        'Người gửi': EMAIL_CONFIG.SENDER_EMAIL,
        'Người nhận (Khách hàng)': orderData.customer_email,
        'Họ tên khách': orderData.customer_name,
        'Số điện thoại': orderData.customer_phone,
        'Mã PNR': orderData.booking_code,
        'Tổng thanh toán': formatVND(orderData.total_amount),
        'Phương thức': orderData.payment_method,
        'Thời gian': new Date().toLocaleString('vi-VN')
    });
    return true;
}
