/**
 * js/cart.js - Quản lý giỏ hàng, xóa, tính tiền, đăng ký đặt vé & gửi email xác nhận
 */

let currentCartItems = [];
let currentGrandTotal = 0;

document.addEventListener('DOMContentLoaded', async () => {
    await window.db.readyPromise;

    // Nạp giỏ hàng từ SQLite
    await loadCartView();
});

// Nạp và hiển thị các mục trong giỏ hàng từ SQLite
async function loadCartView() {
    const container = document.getElementById('cartItemsContainer');
    const subtotalDisplay = document.getElementById('subtotalDisplay');
    const grandTotalDisplay = document.getElementById('grandTotalDisplay');
    const btnSubmit = document.getElementById('btnSubmitBooking');

    if (!container) return;

    try {
        currentCartItems = await window.db.getCartItems();

        if (currentCartItems.length === 0) {
            container.innerHTML = `
                <div class="empty-cart-view">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>Giỏ hàng của bạn đang trống!</h3>
                    <p>Hãy khám phá các chuyến bay giá rẻ và tour du lịch hấp dẫn của Vietjet.</p>
                    <div style="display: flex; gap: 12px; justify-content: center;">
                        <a href="flights.html" class="btn btn-primary">Tìm Chuyến Bay</a>
                        <a href="tour.html" class="btn btn-secondary">Xem Tour Du Lịch</a>
                    </div>
                </div>
            `;
            subtotalDisplay.textContent = '0 ₫';
            grandTotalDisplay.textContent = '0 ₫';
            currentGrandTotal = 0;
            if (btnSubmit) btnSubmit.disabled = true;
            return;
        }

        if (btnSubmit) btnSubmit.disabled = false;

        // Tính tổng tiền
        currentGrandTotal = currentCartItems.reduce((sum, item) => sum + Number(item.total_amount), 0);
        subtotalDisplay.textContent = formatVND(currentGrandTotal);
        grandTotalDisplay.textContent = formatVND(currentGrandTotal);

        // Render từng mục trong giỏ
        container.innerHTML = currentCartItems.map(item => {
            const isFlight = item.item_type === 'flight';
            const tagClass = isFlight ? 'tag-flight' : 'tag-tour';
            const tagText = isFlight ? '✈ Chuyến Bay' : '🏖 Tour Du Lịch';

            return `
                <div class="cart-item-row" id="cart-item-${item.id}">
                    <div class="cart-item-info">
                        <span class="cart-item-tag ${tagClass}">${tagText}</span>
                        <h4 class="cart-item-name">${item.item_name}</h4>
                        <div class="cart-item-sub">
                            <span>📅 Ngày: <strong>${item.departure_date}</strong></span>
                            ${item.flight_or_duration ? ` | ⏱ <strong>${item.flight_or_duration}</strong>` : ''}
                        </div>
                        <div style="font-size: 12px; color: #4b5563; margin-top: 2px;">
                            ${item.details || ''}
                        </div>
                    </div>

                    <div class="cart-item-controls">
                        <!-- Bộ chọn số lượng -->
                        <div class="qty-control">
                            <button type="button" class="qty-btn" onclick="updateItemQty(${item.id}, ${item.quantity - 1})">−</button>
                            <span class="qty-val">${item.quantity}</span>
                            <button type="button" class="qty-btn" onclick="updateItemQty(${item.id}, ${item.quantity + 1})">+</button>
                        </div>

                        <!-- Thành tiền -->
                        <div class="cart-item-total">
                            ${formatVND(item.total_amount)}
                        </div>

                        <!-- Nút Xóa -->
                        <button type="button" class="btn-delete-item" onclick="deleteCartItem(${item.id})" title="Xóa mục này">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Lỗi tải giỏ hàng:', err);
    }
}

// Cập nhật số lượng của mục trong giỏ
async function updateItemQty(id, newQty) {
    if (newQty <= 0) {
        return deleteCartItem(id);
    }
    await window.db.updateCartQuantity(id, newQty);
    await loadCartView();
}

// Xóa 1 mục khỏi giỏ hàng
async function deleteCartItem(id) {
    if (confirm('Bạn có chắc chắn muốn xóa mục này khỏi giỏ hàng?')) {
        await window.db.removeFromCart(id);
        showToast('Đã xóa mục khỏi giỏ hàng');
        await loadCartView();
    }
}

// Xóa sạch toàn bộ giỏ hàng
async function confirmClearCart() {
    if (currentCartItems.length === 0) {
        showToast('Giỏ hàng đã trống!', 'info');
        return;
    }
    if (confirm('Bạn có chắc chắn muốn xóa TOÀN BỘ sản phẩm trong giỏ hàng?')) {
        await window.db.clearCart();
        showToast('Đã dọn dẹp sạch giỏ hàng!');
        await loadCartView();
    }
}

// Xử lý gửi đơn hàng (Đăng ký -> Thông báo hoàn thành & Gửi email)
async function handleCheckout(e) {
    e.preventDefault();

    if (currentCartItems.length === 0) {
        showToast('Giỏ hàng đang trống, vui lòng chọn vé hoặc tour trước!', 'error');
        return;
    }

    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const idCard = document.getElementById('custIdCard').value.trim();
    const email = document.getElementById('custEmail').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const notes = document.getElementById('custNotes').value.trim();
    const payMethod = document.querySelector('input[name="pay_method"]:checked')?.value || 'VietQR';

    if (!name || !phone || !email || !idCard) {
        showToast('Vui lòng điền đầy đủ các thông tin bắt buộc (*)', 'error');
        return;
    }

    const submitBtn = document.getElementById('btnSubmitBooking');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Đang xử lý đăng ký & gửi email...';

    // Dữ liệu đơn hàng hoàn chỉnh
    const orderData = {
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        customer_id_card: idCard,
        customer_address: address,
        customer_notes: notes,
        payment_method: payMethod,
        total_amount: currentGrandTotal,
        items: currentCartItems
    };

    try {
        // 1. Lưu đơn hàng vào SQLite và nhận mã đặt chỗ PNR
        const orderResult = await window.db.createOrder(orderData);
        console.log('✅ Đã tạo đơn hàng thành công trong SQLite:', orderResult);

        // 2. Kích hoạt gửi Email xác nhận từ nvhai061993@gmail.com đến email của khách
        await sendBookingConfirmationEmail(orderResult);

        // 3. Hiển thị Modal Thông Báo Hoàn Thành
        document.getElementById('modalPnrCode').textContent = orderResult.bookingCode;
        document.getElementById('modalCustEmail').textContent = email;
        const modal = document.getElementById('successModal');
        modal.classList.add('active');

        // 4. Cập nhật lại giao diện giỏ hàng
        await loadCartView();
        showToast('Đặt vé thành công! Vui lòng kiểm tra email của bạn.');
    } catch (err) {
        console.error('Lỗi xử lý đơn hàng:', err);
        showToast('Có lỗi xảy ra khi tạo đơn hàng!', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '✓ ĐĂNG KÝ ĐẶT VÉ & TOUR';
    }
}
