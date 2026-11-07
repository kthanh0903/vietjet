/**
 * VIETJET CLIENT DATABASE (SQLITE via SQL.js WASM)
 * File: js/database.js
 * Quản lý nạp CSDL vietjet.db từ file nhị phân, bộ nhớ và lưu trữ bền vững (persistence) vào localStorage.
 */

class VietjetDatabase {
    constructor() {
        this.db = null;
        this.SQL = null;
        this.readyPromise = this.init();
    }

    async init() {
        try {
            console.log('⚡ Đang khởi động SQLite WebAssembly (SQL.js)...');
            if (typeof window.initSqlJs !== 'function') {
                console.error('SQL.js chưa được tải. Hãy chắc chắn đã nhúng script sql-wasm.js');
                return;
            }

            this.SQL = await window.initSqlJs({
                locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
            });

            // 1. Kiểm tra trong localStorage xem đã có bản SQLite lưu trước đó chưa
            const localSaved = localStorage.getItem('vietjet_sqlite_db');
            if (localSaved) {
                try {
                    const uInt8Array = new Uint8Array(JSON.parse(localSaved));
                    this.db = new this.SQL.Database(uInt8Array);
                    console.log('✅ Đã nạp thành công SQLite từ localStorage');
                    return;
                } catch (e) {
                    console.warn('Dữ liệu localStorage không hợp lệ, chuyển sang nạp từ vietjet.db...', e);
                }
            }

            // 2. Tải trực tiếp file nhị phân vietjet.db
            let dbLoaded = false;
            const dbPaths = ['sqlite/vietjet.db', 'vietjet.db', './sqlite/vietjet.db'];
            for (const path of dbPaths) {
                try {
                    const resp = await fetch(path);
                    if (resp.ok) {
                        const buffer = await resp.arrayBuffer();
                        this.db = new this.SQL.Database(new Uint8Array(buffer));
                        this.persist();
                        console.log(`✅ Đã nạp SQLite từ file ${path}`);
                        dbLoaded = true;
                        break;
                    }
                } catch (err) {
                    // Tiếp tục thử đường dẫn khác
                }
            }

            // 3. Nếu fetch thất bại (ví dụ: mở trực tiếp bằng file:///), chạy fallback khởi tạo DDL & Seed
            if (!dbLoaded) {
                console.warn('⚠️ Không thể fetch vietjet.db qua mạng, khởi tạo CSDL từ Fallback Seed SQL...');
                this.db = new this.SQL.Database();
                await this.initFallbackSchemaAndData();
                this.persist();
                console.log('✅ Đã khởi tạo thành công CSDL từ Fallback Seed!');
            }
        } catch (err) {
            console.error('Lỗi khi khởi tạo SQLite database:', err);
        }
    }

    persist() {
        if (!this.db) return;
        try {
            const binary = this.db.export();
            localStorage.setItem('vietjet_sqlite_db', JSON.stringify(Array.from(binary)));
        } catch (e) {
            console.warn('Không thể lưu CSDL vào localStorage:', e);
        }
    }

    query(sql, params = []) {
        if (!this.db) {
            console.error('CSDL SQLite chưa sẵn sàng!');
            return [];
        }
        try {
            const stmt = this.db.prepare(sql);
            stmt.bind(params);
            const rows = [];
            while (stmt.step()) {
                rows.push(stmt.getAsObject());
            }
            stmt.free();
            return rows;
        } catch (err) {
            console.error('Lỗi thực thi truy vấn SQL:', sql, err);
            return [];
        }
    }

    execute(sql, params = []) {
        if (!this.db) {
            console.error('CSDL SQLite chưa sẵn sàng!');
            return;
        }
        try {
            this.db.run(sql, params);
            this.persist();
        } catch (err) {
            console.error('Lỗi thực thi SQL Execute:', sql, err);
        }
    }

    // ==========================================
    // CÁC HÀM API TRUY VẤN DỮ LIỆU TIỆN ÍCH
    // ==========================================

    async getAirports() {
        await this.readyPromise;
        return this.query('SELECT code, name, city, country FROM airports ORDER BY (country = "Việt Nam") DESC, city ASC');
    }

    async getAirlines() {
        await this.readyPromise;
        return this.query('SELECT code, name, logo_url, website FROM airlines ORDER BY (code = "VJ") DESC, name ASC');
    }

    async getFeaturedTours() {
        await this.readyPromise;
        const sql = `
            SELECT t.*, a.name AS airline_name, a.logo_url AS airline_logo
            FROM tours t
            JOIN airlines a ON t.airline_code = a.code
            WHERE t.is_featured = 1
            ORDER BY t.id ASC
            LIMIT 8
        `;
        return this.query(sql);
    }

    async getFlights(filters = {}) {
        await this.readyPromise;
        let sql = `
            SELECT f.*, 
                   orig.name AS origin_name, orig.city AS origin_city,
                   dest.name AS dest_name, dest.city AS dest_city,
                   a.name AS airline_name, a.logo_url AS airline_logo
            FROM flights f
            JOIN airlines a ON f.airline_code = a.code
            JOIN airports orig ON f.origin_code = orig.code
            JOIN airports dest ON f.dest_code = dest.code
            WHERE 1=1
        `;
        const params = [];

        if (filters.origin) {
            sql += ` AND f.origin_code = ?`;
            params.push(filters.origin);
        }
        if (filters.destination) {
            sql += ` AND f.dest_code = ?`;
            params.push(filters.destination);
        }
        if (filters.tripType && filters.tripType !== 'all') {
            sql += ` AND f.trip_type = ?`;
            params.push(filters.tripType);
        }
        if (filters.airline && filters.airline !== 'all') {
            sql += ` AND (a.name = ? OR a.code = ?)`;
            params.push(filters.airline, filters.airline);
        }
        if (filters.timeSlots && filters.timeSlots.length > 0) {
            const placeholders = filters.timeSlots.map(() => '?').join(',');
            sql += ` AND f.time_slot IN (${placeholders})`;
            params.push(...filters.timeSlots);
        }
        if (filters.isDirect !== undefined && filters.isDirect !== null) {
            sql += ` AND f.is_direct = ?`;
            params.push(Number(filters.isDirect));
        }

        // Sắp xếp
        if (filters.sortBy === 'price_desc') {
            sql += ` ORDER BY f.price_economy DESC`;
        } else {
            sql += ` ORDER BY f.price_economy ASC`;
        }

        return this.query(sql, params);
    }

    async getFlightById(id) {
        await this.readyPromise;
        const sql = `
            SELECT f.*, 
                   orig.name AS origin_name, orig.city AS origin_city,
                   dest.name AS dest_name, dest.city AS dest_city,
                   a.name AS airline_name, a.logo_url AS airline_logo
            FROM flights f
            JOIN airlines a ON f.airline_code = a.code
            JOIN airports orig ON f.origin_code = orig.code
            JOIN airports dest ON f.dest_code = dest.code
            WHERE f.id = ?
        `;
        const res = this.query(sql, [id]);
        return res.length > 0 ? res[0] : null;
    }

    async getTours(filters = {}) {
        await this.readyPromise;
        let sql = `
            SELECT t.*, a.name AS airline_name, a.logo_url AS airline_logo
            FROM tours t
            JOIN airlines a ON t.airline_code = a.code
            WHERE 1=1
        `;
        const params = [];

        if (filters.airline && filters.airline !== 'all') {
            sql += ` AND (a.name = ? OR a.code = ?)`;
            params.push(filters.airline, filters.airline);
        }
        if (filters.timeSlot && filters.timeSlot !== 'all') {
            sql += ` AND t.departure_time_slot = ?`;
            params.push(filters.timeSlot);
        }

        // Sắp xếp
        if (filters.sortBy === 'price_desc') {
            sql += ` ORDER BY t.price DESC`;
        } else {
            sql += ` ORDER BY t.price ASC`;
        }

        return this.query(sql, params);
    }

    async getTourById(id) {
        await this.readyPromise;
        const sql = `
            SELECT t.*, a.name AS airline_name, a.logo_url AS airline_logo
            FROM tours t
            JOIN airlines a ON t.airline_code = a.code
            WHERE t.id = ?
        `;
        const res = this.query(sql, [id]);
        return res.length > 0 ? res[0] : null;
    }

    async getTourItineraries(tourId) {
        await this.readyPromise;
        const sql = `
            SELECT * FROM tour_itineraries
            WHERE tour_id = ?
            ORDER BY day_number ASC
        `;
        return this.query(sql, [tourId]);
    }

    // ==========================================
    // CÁC HÀM GIỎ HÀNG (CART API)
    // ==========================================

    async getCartItems() {
        await this.readyPromise;
        return this.query('SELECT * FROM cart_items ORDER BY id DESC');
    }

    async getCartCount() {
        await this.readyPromise;
        const res = this.query('SELECT COUNT(*) as count FROM cart_items');
        return res.length > 0 ? res[0].count : 0;
    }

    async addToCart(item) {
        await this.readyPromise;
        const total = item.price * (item.quantity || 1);
        const sql = `
            INSERT INTO cart_items (
                item_type, reference_id, item_name, ticket_class,
                departure_date, flight_or_duration, details, price, quantity, total_amount
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        this.execute(sql, [
            item.item_type,
            item.reference_id,
            item.item_name,
            item.ticket_class || null,
            item.departure_date,
            item.flight_or_duration || '',
            item.details || '',
            item.price,
            item.quantity || 1,
            total
        ]);
        window.dispatchEvent(new CustomEvent('cart-updated'));
        return true;
    }

    async updateCartQuantity(id, quantity) {
        await this.readyPromise;
        if (quantity <= 0) {
            return this.removeFromCart(id);
        }
        const item = this.query('SELECT price FROM cart_items WHERE id = ?', [id]);
        if (item.length > 0) {
            const price = item[0].price;
            this.execute('UPDATE cart_items SET quantity = ?, total_amount = ? WHERE id = ?', [quantity, price * quantity, id]);
            window.dispatchEvent(new CustomEvent('cart-updated'));
        }
    }

    async removeFromCart(id) {
        await this.readyPromise;
        this.execute('DELETE FROM cart_items WHERE id = ?', [id]);
        window.dispatchEvent(new CustomEvent('cart-updated'));
    }

    async clearCart() {
        await this.readyPromise;
        this.execute('DELETE FROM cart_items');
        window.dispatchEvent(new CustomEvent('cart-updated'));
    }

    // ==========================================
    // ĐẶT HÀNG (ORDERS API)
    // ==========================================

    async createOrder(orderData) {
        await this.readyPromise;
        const bookingCode = 'VJ-' + Math.floor(100000 + Math.random() * 900000);
        const sql = `
            INSERT INTO orders (
                booking_code, customer_name, customer_email, customer_phone,
                customer_id_card, customer_address, customer_notes,
                total_amount, payment_method, status, email_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', 'sent')
        `;
        this.execute(sql, [
            bookingCode,
            orderData.customer_name,
            orderData.customer_email,
            orderData.customer_phone,
            orderData.customer_id_card,
            orderData.customer_address || '',
            orderData.customer_notes || '',
            orderData.total_amount,
            orderData.payment_method
        ]);

        const orderIdRow = this.query('SELECT last_insert_rowid() as id');
        const orderId = orderIdRow.length > 0 ? orderIdRow[0].id : 1;

        // Lưu chi tiết order_items
        if (orderData.items && orderData.items.length > 0) {
            for (const item of orderData.items) {
                this.execute(`
                    INSERT INTO order_items (order_id, item_type, item_name, details, price, quantity, total_amount)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [
                    orderId,
                    item.item_type,
                    item.item_name,
                    item.details || '',
                    item.price,
                    item.quantity,
                    item.total_amount
                ]);
            }
        }

        // Xóa giỏ hàng sau khi đặt thành công
        await this.clearCart();

        return {
            orderId,
            bookingCode,
            ...orderData
        };
    }

    // Fallback script nếu không thể tải file nhị phân
    async initFallbackSchemaAndData() {
        const ddl = `
        CREATE TABLE IF NOT EXISTS airports (code TEXT PRIMARY KEY, name TEXT, city TEXT, country TEXT DEFAULT 'Việt Nam');
        CREATE TABLE IF NOT EXISTS airlines (code TEXT PRIMARY KEY, name TEXT, logo_url TEXT, website TEXT, country TEXT DEFAULT 'Việt Nam');
        CREATE TABLE IF NOT EXISTS flights (id INTEGER PRIMARY KEY AUTOINCREMENT, flight_number TEXT, airline_code TEXT, origin_code TEXT, dest_code TEXT, departure_time TEXT, arrival_time TEXT, duration TEXT, departure_date TEXT, return_date TEXT, price_economy INTEGER, price_business INTEGER, aircraft_type TEXT, trip_type TEXT DEFAULT 'one_way', is_direct INTEGER DEFAULT 1, time_slot TEXT, amenities TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS tours (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, destination TEXT, origin TEXT DEFAULT 'TP. Hồ Chí Minh', duration_text TEXT, duration_days INTEGER, duration_nights INTEGER, price INTEGER, airline_code TEXT, agency_name TEXT, thumbnail_url TEXT, aircraft_type TEXT, departure_time_slot TEXT, rating REAL DEFAULT 4.9, reviews_count INTEGER DEFAULT 150, highlights TEXT, included_services TEXT, is_featured INTEGER DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS tour_itineraries (id INTEGER PRIMARY KEY AUTOINCREMENT, tour_id INTEGER, day_number INTEGER, title TEXT, description TEXT, meals TEXT, stay TEXT);
        CREATE TABLE IF NOT EXISTS cart_items (id INTEGER PRIMARY KEY AUTOINCREMENT, item_type TEXT, reference_id INTEGER, item_name TEXT, ticket_class TEXT, departure_date TEXT, flight_or_duration TEXT, details TEXT, price INTEGER, quantity INTEGER DEFAULT 1, total_amount INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, booking_code TEXT UNIQUE, customer_name TEXT, customer_email TEXT, customer_phone TEXT, customer_id_card TEXT, customer_address TEXT, customer_notes TEXT, total_amount INTEGER, payment_method TEXT, status TEXT DEFAULT 'completed', email_status TEXT DEFAULT 'sent', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER, item_type TEXT, item_name TEXT, details TEXT, price INTEGER, quantity INTEGER, total_amount INTEGER);
        `;
        this.db.run(ddl);

        // Nạp airports
        this.db.run(`
            INSERT OR REPLACE INTO airports VALUES
            ('SGN', 'Sân bay Quốc tế Tân Sơn Nhất', 'TP. Hồ Chí Minh', 'Việt Nam'),
            ('HAN', 'Sân bay Quốc tế Nội Bài', 'Hà Nội', 'Việt Nam'),
            ('DAD', 'Sân bay Quốc tế Đà Nẵng', 'Đà Nẵng', 'Việt Nam'),
            ('CXR', 'Sân bay Quốc tế Cam Ranh', 'Nha Trang', 'Việt Nam'),
            ('PQC', 'Sân bay Quốc tế Phú Quốc', 'Phú Quốc', 'Việt Nam'),
            ('BKK', 'Sân bay Quốc tế Suvarnabhumi', 'Bangkok', 'Thái Lan'),
            ('ICN', 'Sân bay Quốc tế Incheon', 'Seoul', 'Hàn Quốc'),
            ('NRT', 'Sân bay Quốc tế Narita', 'Tokyo', 'Nhật Bản'),
            ('SIN', 'Sân bay Quốc tế Changi', 'Singapore', 'Singapore');
        `);

        // Nạp airlines
        this.db.run(`
            INSERT OR REPLACE INTO airlines VALUES
            ('VJ', 'VietJet Air', 'images/1794032794428_7798941419347914444_g4111106518249197050_b20246c106060b907dfe9e17d280275d.jpg', 'https://www.vietjetair.com', 'Việt Nam'),
            ('VN', 'Vietnam Airlines', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Vietnam_Airlines_logo.svg/320px-Vietnam_Airlines_logo.svg.png', 'https://www.vietnamairlines.com', 'Việt Nam'),
            ('QH', 'Bamboo Airways', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Bamboo_Airways_logo.svg/320px-Bamboo_Airways_logo.svg.png', 'https://www.bambooairways.com', 'Việt Nam'),
            ('SQ', 'Singapore Airlines', 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/320px-Singapore_Airlines_Logo_2.svg.png', 'https://www.singaporeair.com', 'Singapore'),
            ('AK', 'AirAsia', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/320px-AirAsia_New_Logo.svg.png', 'https://www.airasia.com', 'Malaysia'),
            ('QR', 'Qatar Airways', 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Qatar_Airways_Logo.svg/320px-Qatar_Airways_Logo.svg.png', 'https://www.qatarairways.com', 'Qatar');
        `);

        // Nạp 8 Tours
        this.db.run(`
            INSERT OR REPLACE INTO tours VALUES
            (1, 'Tour Phú Quốc 3N2Đ - Thiên Đường Đảo Ngọc & Cáp Treo Hòn Thơm', 'Phú Quốc', 'TP. Hồ Chí Minh', '3 Ngày 2 Đêm', 3, 2, 3890000, 'VJ', 'Vietjet Holidays', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop', 'Airbus A321neo', 'morning', 4.9, 215, 'Trải nghiệm cáp treo vượt biển 7.899m dài nhất thế giới, Grand World, lặn san hô', 'Vé máy bay Vietjet, Khách sạn resort 4*, Xe đời mới, Cáp treo Hòn Thơm', 1, CURRENT_TIMESTAMP),
            (2, 'Tour Đà Nẵng - Hội An - Bà Nà Hills 4N3Đ - Check-in Cầu Vàng', 'Đà Nẵng', 'TP. Hồ Chí Minh', '4 Ngày 3 Đêm', 4, 3, 4590000, 'VJ', 'Vietjet Travel', 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=600&h=400&fit=crop', 'Airbus A321', 'morning', 5.0, 340, 'Check-in biểu tượng Cầu Vàng, dạo phố cổ Hội An thả đèn hoa đăng, chùa Linh Ứng', 'Vé máy bay Vietjet khứ hồi, Khách sạn 4* biển Mỹ Khê, Vé cáp treo Bà Nà + Buffet', 1, CURRENT_TIMESTAMP),
            (3, 'Tour Hà Nội - Sapa - Fansipan 4N3Đ - Chinh Phục Nóc Nhà Đông Dương', 'Sapa & Hà Nội', 'TP. Hồ Chí Minh', '4 Ngày 3 Đêm', 4, 3, 4990000, 'VN', 'Vietjet Travel', 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&h=400&fit=crop', 'Boeing 787-9 Dreamliner', 'morning', 4.8, 180, 'Chinh phục đỉnh Fansipan 3.143m ngắm biển mây, dạo bản Cát Cát, thung lũng Mường Hoa', 'Vé máy bay khứ hồi, Xe Limousine, Khách sạn 4*, Vé cáp treo Fansipan', 1, CURRENT_TIMESTAMP),
            (4, 'Tour Nha Trang 3N2Đ - Khám Phá Vịnh San Hô & Thiên Đường VinWonders', 'Nha Trang', 'TP. Hồ Chí Minh', '3 Ngày 2 Đêm', 3, 2, 3490000, 'VJ', 'Vietjet Holidays', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop', 'Airbus A320', 'afternoon', 4.9, 195, 'Cano 4 đảo vịnh Nha Trang, lặn ngắm san hô Bãi Tranh, tắm bùn khoáng nóng, VinWonders', 'Vé máy bay Vietjet, Khách sạn 4* mặt biển, Cano cao tốc, Vé VinWonders', 1, CURRENT_TIMESTAMP),
            (5, 'Tour Bangkok - Pattaya 5N4Đ - Khám Phá Xứ Sở Chùa Vàng Thái Lan', 'Bangkok & Pattaya', 'TP. Hồ Chí Minh', '5 Ngày 4 Đêm', 5, 4, 6290000, 'VJ', 'Vietjet Air Tour', 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop', 'Airbus A321neo', 'morning', 4.8, 412, 'Wat Traimit Phật Vàng, dạo sông Chao Phraya, đảo San Hô Coral, buffet 86 tầng Baiyoke', 'Vé máy bay Vietjet khứ hồi, Khách sạn 4-5*, Show Alcazar, Buffet Baiyoke', 1, CURRENT_TIMESTAMP),
            (6, 'Tour Seoul - Nami - Công Viên Everland Hàn Quốc 5N4Đ Mùa Tuyệt Đẹp', 'Seoul (Hàn Quốc)', 'Hà Nội / TP.HCM', '5 Ngày 4 Đêm', 5, 4, 14990000, 'VJ', 'Vietjet Global', 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600&h=400&fit=crop', 'Airbus A330-300', 'night', 5.0, 276, 'Đảo Nami lãng mạn, công viên giải trí Everland, Cung điện Gyeongbokgung, Tháp N Seoul', 'Vé máy bay A330 khứ hồi, Visa Hàn Quốc trọn gói, Khách sạn 4*, Hanbok & Buffet BBQ', 1, CURRENT_TIMESTAMP),
            (7, 'Tour Tokyo - Núi Phú Sĩ - Làng Cổ Oshino Hakkai Nhật Bản 6N5Đ', 'Tokyo (Nhật Bản)', 'TP. Hồ Chí Minh', '6 Ngày 5 Đêm', 6, 5, 23990000, 'SQ', 'Vietjet Global', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&h=400&fit=crop', 'Boeing 787-10', 'morning', 4.9, 158, 'Núi Phú Sĩ kỳ vĩ, làng cổ Oshino Hakkai, chùa cổ Asakusa Sensoji, tắm Onsen khoáng nóng', 'Vé máy bay 5 sao, Khách sạn 4*, Tắm Onsen, Thưởng thức bò Wagyu & Cua tuyết', 1, CURRENT_TIMESTAMP),
            (8, 'Tour Liên Tuyến Singapore - Malaysia 5N4Đ Đẳng Cấp Hiện Đại', 'Singapore & Malaysia', 'TP. Hồ Chí Minh', '5 Ngày 4 Đêm', 5, 4, 9890000, 'VJ', 'Vietjet Global', 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop', 'Airbus A321', 'afternoon', 4.9, 320, 'Gardens by the Bay, tượng Merlion, Tháp đôi Petronas, động Batu & cao nguyên Genting', 'Vé máy bay khứ hồi Vietjet, Xe du lịch xuyên biên giới, Khách sạn 4* quốc tế', 1, CURRENT_TIMESTAMP);
        `);

        // Nạp flights
        this.db.run(`
            INSERT OR REPLACE INTO flights VALUES
            (1, 'VJ-120', 'VJ', 'SGN', 'HAN', '06:15', '08:25', '2h 10m', '2026-11-15', '2026-11-20', 799000, 2450000, 'Airbus A321neo', 'round_trip', 1, 'morning', '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn"}', CURRENT_TIMESTAMP),
            (2, 'VJ-134', 'VJ', 'SGN', 'HAN', '09:30', '11:40', '2h 10m', '2026-11-15', NULL, 890000, 2690000, 'Airbus A321neo', 'one_way', 1, 'morning', '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn"}', CURRENT_TIMESTAMP),
            (3, 'VJ-152', 'VJ', 'SGN', 'HAN', '14:20', '16:30', '2h 10m', '2026-11-15', NULL, 850000, 2590000, 'Airbus A330-300', 'one_way', 1, 'afternoon', '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Rộng rãi"}', CURRENT_TIMESTAMP),
            (4, 'VJ-178', 'VJ', 'SGN', 'HAN', '20:15', '22:25', '2h 10m', '2026-11-15', NULL, 720000, 2390000, 'Airbus A321', 'one_way', 1, 'night', '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn"}', CURRENT_TIMESTAMP),
            (5, 'VJ-102', 'VJ', 'SGN', 'HAN', '05:15', '07:25', '2h 10m', '2026-11-15', NULL, 690000, 2290000, 'Airbus A321neo', 'one_way', 1, 'early', '{"baggage": "7kg xách tay", "meal": "Mua thêm", "seat": "Tiêu chuẩn"}', CURRENT_TIMESTAMP),
            (6, 'VN-210', 'VN', 'SGN', 'HAN', '07:00', '09:10', '2h 10m', '2026-11-15', '2026-11-20', 1250000, 3850000, 'Boeing 787-9', 'round_trip', 1, 'morning', '{"baggage": "12kg xách tay + 23kg ký gửi", "meal": "Bữa ăn nóng", "seat": "Màn hình riêng"}', CURRENT_TIMESTAMP),
            (7, 'VN-254', 'VN', 'SGN', 'HAN', '11:15', '13:25', '2h 10m', '2026-11-15', NULL, 1350000, 4100000, 'Airbus A350-900', 'one_way', 1, 'morning', '{"baggage": "12kg xách tay + 23kg ký gửi", "meal": "Bữa ăn nóng", "seat": "Màn hình riêng"}', CURRENT_TIMESTAMP),
            (8, 'QH-202', 'QH', 'SGN', 'HAN', '08:30', '10:40', '2h 10m', '2026-11-15', NULL, 990000, 2890000, 'Boeing 787-9', 'one_way', 1, 'morning', '{"baggage": "7kg xách tay + 20kg ký gửi", "meal": "Suất ăn nhẹ", "seat": "Thoải mái"}', CURRENT_TIMESTAMP),
            (9, 'VJ-121', 'VJ', 'HAN', 'SGN', '09:00', '11:15', '2h 15m', '2026-11-16', NULL, 799000, 2450000, 'Airbus A321neo', 'one_way', 1, 'morning', '{"baggage": "7kg xách tay", "meal": "Mua thêm"}', CURRENT_TIMESTAMP),
            (10, 'VN-211', 'VN', 'HAN', 'SGN', '10:30', '12:45', '2h 15m', '2026-11-16', NULL, 1290000, 3890000, 'Boeing 787-9', 'one_way', 1, 'morning', '{"baggage": "12kg xách tay + 23kg ký gửi", "meal": "Bữa ăn nóng"}', CURRENT_TIMESTAMP),
            (11, 'VJ-622', 'VJ', 'SGN', 'DAD', '07:30', '08:50', '1h 20m', '2026-11-15', '2026-11-18', 599000, 1890000, 'Airbus A320', 'round_trip', 1, 'morning', '{"baggage": "7kg xách tay", "meal": "Mua thêm"}', CURRENT_TIMESTAMP),
            (12, 'VN-118', 'VN', 'SGN', 'DAD', '10:00', '11:20', '1h 20m', '2026-11-15', NULL, 950000, 2400000, 'Airbus A321', 'one_way', 1, 'morning', '{"baggage": "12kg xách tay + 23kg ký gửi", "meal": "Nước suối"}', CURRENT_TIMESTAMP),
            (13, 'VJ-638', 'VJ', 'SGN', 'DAD', '16:45', '18:05', '1h 20m', '2026-11-15', NULL, 550000, 1790000, 'Airbus A321', 'one_way', 1, 'afternoon', '{"baggage": "7kg xách tay", "meal": "Mua thêm"}', CURRENT_TIMESTAMP),
            (14, 'VJ-320', 'VJ', 'SGN', 'PQC', '08:00', '09:00', '1h 00m', '2026-11-15', '2026-11-18', 490000, 1690000, 'Airbus A321neo', 'round_trip', 1, 'morning', '{"baggage": "7kg xách tay", "meal": "Mua thêm"}', CURRENT_TIMESTAMP),
            (15, 'VN-1822', 'VN', 'SGN', 'PQC', '13:30', '14:35', '1h 05m', '2026-11-15', NULL, 890000, 2200000, 'Airbus A321', 'one_way', 1, 'afternoon', '{"baggage": "12kg xách tay + 23kg ký gửi"}', CURRENT_TIMESTAMP),
            (16, 'VJ-801', 'VJ', 'SGN', 'BKK', '09:15', '10:45', '1h 30m', '2026-11-15', '2026-11-20', 1190000, 3290000, 'Airbus A321', 'round_trip', 1, 'morning', '{"baggage": "7kg xách tay"}', CURRENT_TIMESTAMP),
            (17, 'AK-520', 'AK', 'SGN', 'BKK', '15:00', '16:35', '1h 35m', '2026-11-15', NULL, 1150000, 2990000, 'Airbus A320', 'one_way', 1, 'afternoon', '{"baggage": "7kg xách tay"}', CURRENT_TIMESTAMP),
            (18, 'SQ-178', 'SQ', 'SGN', 'SIN', '12:15', '15:20', '2h 05m', '2026-11-15', '2026-11-20', 2450000, 6800000, 'Boeing 787-10', 'round_trip', 1, 'afternoon', '{"baggage": "15kg xách tay + 30kg ký gửi", "meal": "Bữa ăn 5 sao"}', CURRENT_TIMESTAMP),
            (19, 'VJ-813', 'VJ', 'SGN', 'SIN', '14:10', '17:15', '2h 05m', '2026-11-15', NULL, 1390000, 3690000, 'Airbus A321neo', 'one_way', 1, 'afternoon', '{"baggage": "7kg xách tay"}', CURRENT_TIMESTAMP),
            (20, 'VJ-862', 'VJ', 'SGN', 'ICN', '23:45', '06:55 (+1)', '5h 10m', '2026-11-15', '2026-11-21', 2890000, 7500000, 'Airbus A330-300', 'round_trip', 1, 'night', '{"baggage": "7kg xách tay + 20kg ký gửi", "meal": "Suất ăn nóng"}', CURRENT_TIMESTAMP);
        `);

        // Nạp tour itineraries
        this.db.run(`
            INSERT OR REPLACE INTO tour_itineraries VALUES
            (1, 1, 1, 'TP.HCM - Phú Quốc - Khám Phá Grand World Thành Phố Không Ngủ', 'Xe và HDV đón tại sân bay Phú Quốc. Nhận phòng resort 4 sao, ăn trưa gỏi cá trích. Chiều đến Grand World ngắm kênh đào Venice, bảo tàng Gấu Teddy, xem show thực cảnh Tinh hoa Việt Nam.', 'Trưa, Tối', 'Resort 4 sao bãi biển'),
            (2, 1, 2, 'Cáp Treo Hòn Thơm - Cano 4 Đảo - Lặn Ngắm San Hô Tự Nhiên', 'Đi cano ra 4 đảo ngắm san hô. Chiều trải nghiệm cáp treo Hòn Thơm vượt biển dài nhất thế giới ngắm hoàng hôn đảo ngọc.', 'Sáng, Trưa, Tối', 'Resort 4 sao bãi biển'),
            (3, 1, 3, 'Trang Trại Ngọc Trai - Nhà Thùng Nước Mắm - Tiễn Bay Về TP.HCM', 'Tham quan trang trại ngọc trai, nhà thùng nước mắm truyền thống, vườn tiêu Suối Đá. Ra sân bay về lại TP.HCM.', 'Sáng, Trưa', 'Về điểm xuất phát'),
            (4, 2, 1, 'TP.HCM - Đà Nẵng - Bán Đảo Sơn Trà - Phố Cổ Hội An Lung Linh', 'Đáp chuyến bay tới Đà Nẵng. Viếng Chùa Linh Ứng Sơn Trà. Chiều dạo phố cổ Hội An, thả đèn hoa đăng sông Hoài.', 'Trưa, Tối', 'Khách sạn 4 sao Mỹ Khê'),
            (5, 2, 2, 'Sun World Bà Nà Hills - Check-in Cầu Vàng Kỳ Quan', 'Cáp treo lên Bà Nà Hills. Check-in Cầu Vàng lừng danh, vui chơi Fantasy Park, thưởng thức buffet 100 món.', 'Sáng, Trưa, Tối', 'Khách sạn 4 sao Mỹ Khê'),
            (6, 2, 3, 'Ngũ Hành Sơn - Làng Đá Mỹ Nghệ - Du Thuyền Sông Hàn', 'Tham quan Ngũ Hành Sơn, làng đá Non Nước. Buổi tối ngắm Cầu Rồng phun lửa trên du thuyền sông Hàn.', 'Sáng, Trưa, Tối', 'Khách sạn 4 sao Mỹ Khê'),
            (7, 2, 4, 'Tắm Biển Mỹ Khê - Mua Sắm Chợ Hàn - Tiễn Sân Bay', 'Tự do tắm biển Mỹ Khê, mua đặc sản chả bò chợ Hàn, ra sân bay về TP.HCM.', 'Sáng, Trưa', 'Về điểm xuất phát');
        `);
    }
}

// Khởi tạo đối tượng toàn cục
window.db = new VietjetDatabase();
