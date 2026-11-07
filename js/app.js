/**
 * js/app.js - Tiện ích và logic chung của website Vietjet
 */

// Định dạng tiền tệ Việt Nam: 1.500.000 ₫
function formatVND(amount) {
    if (isNaN(amount) || amount === null || amount === undefined) return '0 ₫';
    return Number(amount).toLocaleString('vi-VN') + ' ₫';
}

// Cập nhật số lượng hiển thị trên Badge giỏ hàng
async function updateCartBadge() {
    try {
        if (!window.db) return;
        const count = await window.db.getCartCount();
        const badges = document.querySelectorAll('.cart-badge');
        badges.forEach(badge => {
            badge.textContent = count;
            if (count > 0) {
                badge.style.display = 'inline-flex';
            } else {
                badge.style.display = 'none';
            }
        });
    } catch (e) {
        console.warn('Lỗi cập nhật badge giỏ hàng:', e);
    }
}

// Hiển thị thông báo Toast đẹp mắt
function showToast(message, type = 'success') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.position = 'fixed';
        toastContainer.style.top = '24px';
        toastContainer.style.right = '24px';
        toastContainer.style.zIndex = '99999';
        toastContainer.style.display = 'flex';
        toastContainer.style.flexDirection = 'column';
        toastContainer.style.gap = '10px';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    toast.style.background = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#ee1d23');
    toast.style.color = '#fff';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '500';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    toast.style.animation = 'fadeInRight 0.3s ease';

    const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 3200);
}

// Lắng nghe sự kiện giỏ hàng được cập nhật
window.addEventListener('cart-updated', () => {
    updateCartBadge();
});

// Tự động khởi chạy khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    // Cập nhật badge sau khi CSDL sẵn sàng
    if (window.db && window.db.readyPromise) {
        window.db.readyPromise.then(() => {
            updateCartBadge();
        });
    }

    // Toggle menu trên Mobile
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.main-nav');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Đánh dấu menu đang active dựa trên pathname
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});
