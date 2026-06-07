-- Demo credentials for every seeded account: 12345678
-- BCrypt hash generated with strength 10.
UPDATE users
SET password_hash = '$2a$10$5GM9vMrvQI3TxPUnpIahNe7eRCM7b8oll14tEF9sMB9wyuPZFuEdO'
WHERE email IN ('member@cospace.vn', 'admin@cospace.vn');

UPDATE users
SET full_name = 'Nguyễn Minh Anh',
    phone = '0912345678',
    is_blocked = FALSE,
    avatar = 'https://ui-avatars.com/api/?name=Nguyen+Minh+Anh&background=2563EB&color=fff'
WHERE email = 'member@cospace.vn';

UPDATE users
SET full_name = 'Quản trị CoSpace',
    phone = '0900000000',
    is_blocked = FALSE,
    avatar = 'https://ui-avatars.com/api/?name=Quan+Tri&background=111827&color=fff'
WHERE email = 'admin@cospace.vn';

INSERT INTO users (
    user_kind,
    full_name,
    email,
    password_hash,
    phone,
    role,
    created_at,
    is_blocked,
    avatar
)
VALUES
    (
        'MEMBER',
        'Trần Thu Hà',
        'premium@cospace.vn',
        '$2a$10$5GM9vMrvQI3TxPUnpIahNe7eRCM7b8oll14tEF9sMB9wyuPZFuEdO',
        '0987654321',
        'MEMBER',
        CURRENT_TIMESTAMP - INTERVAL '180 days',
        FALSE,
        'https://ui-avatars.com/api/?name=Tran+Thu+Ha&background=7C3AED&color=fff'
    ),
    (
        'MEMBER',
        'Lê Hoàng Nam',
        'newmember@cospace.vn',
        '$2a$10$5GM9vMrvQI3TxPUnpIahNe7eRCM7b8oll14tEF9sMB9wyuPZFuEdO',
        '0934567890',
        'MEMBER',
        CURRENT_TIMESTAMP - INTERVAL '3 days',
        FALSE,
        NULL
    ),
    (
        'MEMBER',
        'Phạm Gia Bảo',
        'blocked@cospace.vn',
        '$2a$10$5GM9vMrvQI3TxPUnpIahNe7eRCM7b8oll14tEF9sMB9wyuPZFuEdO',
        '0977001122',
        'MEMBER',
        CURRENT_TIMESTAMP - INTERVAL '90 days',
        TRUE,
        'https://ui-avatars.com/api/?name=Pham+Gia+Bao&background=DC2626&color=fff'
    );

UPDATE wallets
SET balance = 3500000
WHERE member_id = (SELECT id FROM users WHERE email = 'member@cospace.vn');

INSERT INTO wallets (member_id, balance)
SELECT user_data.id, user_data.balance
FROM (
    SELECT id,
           CASE email
               WHEN 'premium@cospace.vn' THEN 8000000::NUMERIC
               WHEN 'newmember@cospace.vn' THEN 0::NUMERIC
               WHEN 'blocked@cospace.vn' THEN 750000::NUMERIC
           END AS balance
    FROM users
    WHERE email IN (
        'premium@cospace.vn',
        'newmember@cospace.vn',
        'blocked@cospace.vn'
    )
) AS user_data;

UPDATE workspaces
SET name = 'Bàn linh hoạt Lê Duẩn 01',
    address = 'Tòa nhà BMT, 32 Lê Duẩn, Quận 1, TP.HCM',
    floor = 'Tầng 2',
    capacity = 1,
    price_per_hour = 50000,
    status = 'AVAILABLE',
    image_url = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'
WHERE id = 1;

UPDATE workspaces
SET name = 'Phòng họp Sài Gòn',
    address = 'Tòa nhà BMT, 32 Lê Duẩn, Quận 1, TP.HCM',
    floor = 'Tầng 3',
    capacity = 8,
    price_per_hour = 150000,
    status = 'BUSY',
    image_url = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80'
WHERE id = 2;

UPDATE workspaces
SET name = 'Văn phòng riêng Lotus 01',
    address = 'Tòa nhà BMT, 32 Lê Duẩn, Quận 1, TP.HCM',
    floor = 'Tầng 4',
    capacity = 4,
    price_per_hour = 200000,
    status = 'AVAILABLE',
    image_url = 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
WHERE id = 3;

INSERT INTO workspaces (
    workspace_kind,
    name,
    type,
    address,
    floor,
    capacity,
    price_per_hour,
    status,
    image_url
)
VALUES
    ('HOT_DESK', 'Bàn cửa sổ Lê Duẩn 02', 'HOT_DESK', 'Tòa nhà BMT, 32 Lê Duẩn, Quận 1, TP.HCM', 'Tầng 2', 1, 55000, 'AVAILABLE', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'),
    ('HOT_DESK', 'Bàn yên tĩnh Lê Duẩn 03', 'HOT_DESK', 'Tòa nhà BMT, 32 Lê Duẩn, Quận 1, TP.HCM', 'Tầng 2', 1, 60000, 'AVAILABLE', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'),
    ('HOT_DESK', 'Bàn sáng tạo Nguyễn Huệ 04', 'HOT_DESK', 'CoSpace Nguyễn Huệ, 68 Nguyễn Huệ, Quận 1, TP.HCM', 'Tầng 5', 1, 65000, 'AVAILABLE', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'),
    ('HOT_DESK', 'Bàn ban công Nguyễn Huệ 05', 'HOT_DESK', 'CoSpace Nguyễn Huệ, 68 Nguyễn Huệ, Quận 1, TP.HCM', 'Tầng 5', 1, 70000, 'BUSY', 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80'),
    ('HOT_DESK', 'Bàn tập trung Thảo Điền 06', 'HOT_DESK', 'CoSpace Thảo Điền, 15 Xuân Thủy, TP. Thủ Đức', 'Tầng 1', 1, 45000, 'AVAILABLE', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'),
    ('HOT_DESK', 'Bàn sân vườn Thảo Điền 07', 'HOT_DESK', 'CoSpace Thảo Điền, 15 Xuân Thủy, TP. Thủ Đức', 'Tầng 1', 1, 50000, 'MAINTENANCE', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'),
    ('HOT_DESK', 'Bàn linh hoạt Phú Mỹ Hưng 08', 'HOT_DESK', 'CoSpace Nam Sài Gòn, 12 Nguyễn Lương Bằng, Quận 7, TP.HCM', 'Tầng 6', 1, 55000, 'AVAILABLE', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'),
    ('HOT_DESK', 'Bàn góc Phú Mỹ Hưng 09', 'HOT_DESK', 'CoSpace Nam Sài Gòn, 12 Nguyễn Lương Bằng, Quận 7, TP.HCM', 'Tầng 6', 1, 60000, 'AVAILABLE', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'),
    ('HOT_DESK', 'Bàn mẫu đã lưu trữ 10', 'HOT_DESK', 'Kho dữ liệu CoSpace, TP.HCM', 'Tầng 1', 1, 40000, 'ARCHIVED', NULL),

    ('MEETING_ROOM', 'Phòng họp Hà Nội', 'MEETING_ROOM', 'Tòa nhà BMT, 32 Lê Duẩn, Quận 1, TP.HCM', 'Tầng 3', 4, 120000, 'AVAILABLE', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80'),
    ('MEETING_ROOM', 'Phòng họp Đà Nẵng', 'MEETING_ROOM', 'Tòa nhà BMT, 32 Lê Duẩn, Quận 1, TP.HCM', 'Tầng 3', 6, 140000, 'AVAILABLE', 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80'),
    ('MEETING_ROOM', 'Phòng họp Mekong', 'MEETING_ROOM', 'CoSpace Nguyễn Huệ, 68 Nguyễn Huệ, Quận 1, TP.HCM', 'Tầng 7', 10, 180000, 'AVAILABLE', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'),
    ('MEETING_ROOM', 'Phòng hội thảo Horizon', 'MEETING_ROOM', 'CoSpace Nguyễn Huệ, 68 Nguyễn Huệ, Quận 1, TP.HCM', 'Tầng 8', 20, 350000, 'BUSY', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'),
    ('MEETING_ROOM', 'Phòng phỏng vấn Focus', 'MEETING_ROOM', 'CoSpace Thảo Điền, 15 Xuân Thủy, TP. Thủ Đức', 'Tầng 2', 3, 90000, 'AVAILABLE', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'),
    ('MEETING_ROOM', 'Phòng đào tạo Academy', 'MEETING_ROOM', 'CoSpace Thảo Điền, 15 Xuân Thủy, TP. Thủ Đức', 'Tầng 2', 16, 280000, 'MAINTENANCE', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80'),
    ('MEETING_ROOM', 'Phòng họp Sunrise', 'MEETING_ROOM', 'CoSpace Nam Sài Gòn, 12 Nguyễn Lương Bằng, Quận 7, TP.HCM', 'Tầng 7', 8, 160000, 'AVAILABLE', 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80'),
    ('MEETING_ROOM', 'Phòng họp Boardroom', 'MEETING_ROOM', 'CoSpace Nam Sài Gòn, 12 Nguyễn Lương Bằng, Quận 7, TP.HCM', 'Tầng 8', 12, 250000, 'AVAILABLE', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'),
    ('MEETING_ROOM', 'Phòng họp cũ Legacy', 'MEETING_ROOM', 'Kho dữ liệu CoSpace, TP.HCM', 'Tầng 1', 6, 100000, 'ARCHIVED', NULL),

    ('PRIVATE_OFFICE', 'Văn phòng riêng Lotus 02', 'PRIVATE_OFFICE', 'Tòa nhà BMT, 32 Lê Duẩn, Quận 1, TP.HCM', 'Tầng 4', 2, 160000, 'AVAILABLE', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'),
    ('PRIVATE_OFFICE', 'Văn phòng riêng Lotus 03', 'PRIVATE_OFFICE', 'Tòa nhà BMT, 32 Lê Duẩn, Quận 1, TP.HCM', 'Tầng 4', 6, 260000, 'AVAILABLE', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'),
    ('PRIVATE_OFFICE', 'Văn phòng riêng Central 04', 'PRIVATE_OFFICE', 'CoSpace Nguyễn Huệ, 68 Nguyễn Huệ, Quận 1, TP.HCM', 'Tầng 9', 4, 240000, 'AVAILABLE', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'),
    ('PRIVATE_OFFICE', 'Văn phòng riêng Central 05', 'PRIVATE_OFFICE', 'CoSpace Nguyễn Huệ, 68 Nguyễn Huệ, Quận 1, TP.HCM', 'Tầng 9', 8, 380000, 'BUSY', 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80'),
    ('PRIVATE_OFFICE', 'Văn phòng riêng Garden 06', 'PRIVATE_OFFICE', 'CoSpace Thảo Điền, 15 Xuân Thủy, TP. Thủ Đức', 'Tầng 3', 3, 190000, 'AVAILABLE', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'),
    ('PRIVATE_OFFICE', 'Văn phòng riêng Garden 07', 'PRIVATE_OFFICE', 'CoSpace Thảo Điền, 15 Xuân Thủy, TP. Thủ Đức', 'Tầng 3', 10, 450000, 'MAINTENANCE', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80'),
    ('PRIVATE_OFFICE', 'Văn phòng riêng Riverside 08', 'PRIVATE_OFFICE', 'CoSpace Nam Sài Gòn, 12 Nguyễn Lương Bằng, Quận 7, TP.HCM', 'Tầng 9', 5, 280000, 'AVAILABLE', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'),
    ('PRIVATE_OFFICE', 'Văn phòng riêng Riverside 09', 'PRIVATE_OFFICE', 'CoSpace Nam Sài Gòn, 12 Nguyễn Lương Bằng, Quận 7, TP.HCM', 'Tầng 10', 12, 520000, 'AVAILABLE', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'),
    ('PRIVATE_OFFICE', 'Văn phòng riêng Executive 10', 'PRIVATE_OFFICE', 'CoSpace Nam Sài Gòn, 12 Nguyễn Lương Bằng, Quận 7, TP.HCM', 'Tầng 10', 15, 650000, 'AVAILABLE', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80');

INSERT INTO workspace_equipment (workspace_id, name)
SELECT id, 'Wi-Fi tốc độ cao'
FROM workspaces;

INSERT INTO workspace_equipment (workspace_id, name)
SELECT id, 'Điều hòa'
FROM workspaces
WHERE status <> 'ARCHIVED';

INSERT INTO workspace_equipment (workspace_id, name)
SELECT id, 'Ổ cắm điện'
FROM workspaces
WHERE type = 'HOT_DESK' AND status <> 'ARCHIVED';

INSERT INTO workspace_equipment (workspace_id, name)
SELECT id, 'Ghế công thái học'
FROM workspaces
WHERE type = 'HOT_DESK' AND status <> 'ARCHIVED';

INSERT INTO workspace_equipment (workspace_id, name)
SELECT id, 'Máy chiếu'
FROM workspaces
WHERE type = 'MEETING_ROOM' AND status <> 'ARCHIVED';

INSERT INTO workspace_equipment (workspace_id, name)
SELECT id, 'Bảng trắng'
FROM workspaces
WHERE type = 'MEETING_ROOM' AND status <> 'ARCHIVED';

INSERT INTO workspace_equipment (workspace_id, name)
SELECT id, 'Thiết bị họp trực tuyến'
FROM workspaces
WHERE type = 'MEETING_ROOM' AND capacity >= 8 AND status <> 'ARCHIVED';

INSERT INTO workspace_equipment (workspace_id, name)
SELECT id, 'Tủ khóa cá nhân'
FROM workspaces
WHERE type = 'PRIVATE_OFFICE' AND status <> 'ARCHIVED';

INSERT INTO workspace_equipment (workspace_id, name)
SELECT id, 'Màn hình ngoài'
FROM workspaces
WHERE type = 'PRIVATE_OFFICE' AND status <> 'ARCHIVED';

INSERT INTO bookings (
    member_id,
    workspace_id,
    start_time,
    end_time,
    status,
    total_amount,
    note
)
VALUES
    (
        (SELECT id FROM users WHERE email = 'member@cospace.vn'),
        (SELECT id FROM workspaces WHERE name = 'Bàn linh hoạt Lê Duẩn 01'),
        CURRENT_TIMESTAMP - INTERVAL '25 days',
        CURRENT_TIMESTAMP - INTERVAL '25 days' + INTERVAL '3 hours',
        'SUCCESS',
        150000,
        'Làm việc cá nhân theo giờ'
    ),
    (
        (SELECT id FROM users WHERE email = 'member@cospace.vn'),
        (SELECT id FROM workspaces WHERE name = 'Phòng họp Hà Nội'),
        CURRENT_TIMESTAMP + INTERVAL '1 day',
        CURRENT_TIMESTAMP + INTERVAL '1 day 2 hours',
        'CONFIRMED',
        240000,
        'Họp nhóm dự án'
    ),
    (
        (SELECT id FROM users WHERE email = 'member@cospace.vn'),
        (SELECT id FROM workspaces WHERE name = 'Văn phòng riêng Lotus 01'),
        CURRENT_TIMESTAMP - INTERVAL '10 days',
        CURRENT_TIMESTAMP - INTERVAL '10 days' + INTERVAL '2 hours',
        'CANCELLED',
        400000,
        'Đã hủy và hoàn tiền'
    ),
    (
        (SELECT id FROM users WHERE email = 'premium@cospace.vn'),
        (SELECT id FROM workspaces WHERE name = 'Phòng họp Sài Gòn'),
        CURRENT_TIMESTAMP - INTERVAL '30 minutes',
        CURRENT_TIMESTAMP + INTERVAL '90 minutes',
        'SUCCESS',
        300000,
        'Cuộc họp đang diễn ra để demo tỷ lệ lấp đầy'
    ),
    (
        (SELECT id FROM users WHERE email = 'premium@cospace.vn'),
        (SELECT id FROM workspaces WHERE name = 'Văn phòng riêng Central 04'),
        CURRENT_TIMESTAMP + INTERVAL '2 days',
        CURRENT_TIMESTAMP + INTERVAL '2 days 4 hours',
        'CONFIRMED',
        960000,
        'Làm việc cùng khách hàng'
    ),
    (
        (SELECT id FROM users WHERE email = 'premium@cospace.vn'),
        (SELECT id FROM workspaces WHERE name = 'Phòng họp Mekong'),
        CURRENT_TIMESTAMP - INTERVAL '65 days',
        CURRENT_TIMESTAMP - INTERVAL '65 days' + INTERVAL '5 hours',
        'SUCCESS',
        810000,
        'Họp chiến lược quý'
    ),
    (
        (SELECT id FROM users WHERE email = 'newmember@cospace.vn'),
        (SELECT id FROM workspaces WHERE name = 'Bàn tập trung Thảo Điền 06'),
        CURRENT_TIMESTAMP + INTERVAL '3 days',
        CURRENT_TIMESTAMP + INTERVAL '3 days 2 hours',
        'PENDING',
        90000,
        'Trường hợp chờ xử lý'
    ),
    (
        (SELECT id FROM users WHERE email = 'blocked@cospace.vn'),
        (SELECT id FROM workspaces WHERE name = 'Phòng phỏng vấn Focus'),
        CURRENT_TIMESTAMP - INTERVAL '30 days',
        CURRENT_TIMESTAMP - INTERVAL '30 days' + INTERVAL '2 hours',
        'CANCELLED',
        180000,
        'Tài khoản đã bị khóa'
    );

INSERT INTO wallet_transactions (wallet_id, amount, type, created_at)
VALUES
    ((SELECT w.id FROM wallets w JOIN users u ON u.id = w.member_id WHERE u.email = 'member@cospace.vn'), 5000000, 'RECHARGE', CURRENT_TIMESTAMP - INTERVAL '6 months'),
    ((SELECT w.id FROM wallets w JOIN users u ON u.id = w.member_id WHERE u.email = 'member@cospace.vn'), 400000, 'PAYMENT', CURRENT_TIMESTAMP - INTERVAL '5 months'),
    ((SELECT w.id FROM wallets w JOIN users u ON u.id = w.member_id WHERE u.email = 'member@cospace.vn'), 400000, 'REFUND', CURRENT_TIMESTAMP - INTERVAL '5 months' + INTERVAL '1 day'),
    ((SELECT w.id FROM wallets w JOIN users u ON u.id = w.member_id WHERE u.email = 'member@cospace.vn'), 150000, 'PAYMENT', CURRENT_TIMESTAMP - INTERVAL '25 days'),
    ((SELECT w.id FROM wallets w JOIN users u ON u.id = w.member_id WHERE u.email = 'member@cospace.vn'), 240000, 'PAYMENT', CURRENT_TIMESTAMP),
    ((SELECT w.id FROM wallets w JOIN users u ON u.id = w.member_id WHERE u.email = 'premium@cospace.vn'), 10000000, 'RECHARGE', CURRENT_TIMESTAMP - INTERVAL '5 months'),
    ((SELECT w.id FROM wallets w JOIN users u ON u.id = w.member_id WHERE u.email = 'premium@cospace.vn'), 810000, 'PAYMENT', CURRENT_TIMESTAMP - INTERVAL '65 days'),
    ((SELECT w.id FROM wallets w JOIN users u ON u.id = w.member_id WHERE u.email = 'premium@cospace.vn'), 300000, 'PAYMENT', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
    ((SELECT w.id FROM wallets w JOIN users u ON u.id = w.member_id WHERE u.email = 'premium@cospace.vn'), 960000, 'PAYMENT', CURRENT_TIMESTAMP),
    ((SELECT w.id FROM wallets w JOIN users u ON u.id = w.member_id WHERE u.email = 'blocked@cospace.vn'), 1000000, 'RECHARGE', CURRENT_TIMESTAMP - INTERVAL '3 months'),
    ((SELECT w.id FROM wallets w JOIN users u ON u.id = w.member_id WHERE u.email = 'blocked@cospace.vn'), 180000, 'PAYMENT', CURRENT_TIMESTAMP - INTERVAL '30 days'),
    ((SELECT w.id FROM wallets w JOIN users u ON u.id = w.member_id WHERE u.email = 'blocked@cospace.vn'), 180000, 'REFUND', CURRENT_TIMESTAMP - INTERVAL '29 days');

INSERT INTO recharge_requests (
    member_id,
    amount,
    status,
    created_at,
    updated_at,
    note
)
VALUES
    ((SELECT id FROM users WHERE email = 'member@cospace.vn'), 1000000, 'APPROVED', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '15 days' + INTERVAL '20 minutes', NULL),
    ((SELECT id FROM users WHERE email = 'member@cospace.vn'), 500000, 'PENDING', CURRENT_TIMESTAMP - INTERVAL '10 minutes', NULL, 'Đã chuyển khoản, chờ Admin xác nhận'),
    ((SELECT id FROM users WHERE email = 'premium@cospace.vn'), 2000000, 'REJECTED', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '5 days' + INTERVAL '1 hour', 'Không tìm thấy giao dịch chuyển khoản'),
    ((SELECT id FROM users WHERE email = 'newmember@cospace.vn'), 300000, 'PENDING', CURRENT_TIMESTAMP - INTERVAL '1 hour', NULL, 'Yêu cầu nạp tiền đầu tiên'),
    ((SELECT id FROM users WHERE email = 'blocked@cospace.vn'), 1000000, 'APPROVED', CURRENT_TIMESTAMP - INTERVAL '3 months', CURRENT_TIMESTAMP - INTERVAL '3 months' + INTERVAL '15 minutes', NULL);

INSERT INTO notifications (
    user_id,
    title,
    content,
    is_read,
    created_at
)
VALUES
    ((SELECT id FROM users WHERE email = 'member@cospace.vn'), 'Đặt chỗ thành công', 'Bạn đã đặt Bàn linh hoạt Lê Duẩn 01 thành công.', TRUE, CURRENT_TIMESTAMP - INTERVAL '25 days'),
    ((SELECT id FROM users WHERE email = 'member@cospace.vn'), 'Lịch đặt chỗ sắp tới', 'Bạn có lịch tại Phòng họp Hà Nội vào ngày mai.', FALSE, CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
    ((SELECT id FROM users WHERE email = 'member@cospace.vn'), 'Yêu cầu nạp tiền đang chờ duyệt', 'Yêu cầu nạp 500.000 VND đang chờ Admin xử lý.', FALSE, CURRENT_TIMESTAMP - INTERVAL '10 minutes'),
    ((SELECT id FROM users WHERE email = 'premium@cospace.vn'), 'Đặt chỗ thành công', 'Phòng họp Sài Gòn đang được giữ cho bạn.', FALSE, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
    ((SELECT id FROM users WHERE email = 'premium@cospace.vn'), 'Yêu cầu nạp tiền bị từ chối', 'Không tìm thấy giao dịch chuyển khoản tương ứng.', TRUE, CURRENT_TIMESTAMP - INTERVAL '5 days'),
    ((SELECT id FROM users WHERE email = 'newmember@cospace.vn'), 'Chào mừng đến CoSpace', 'Tài khoản của bạn đã sẵn sàng. Hãy nạp tiền để bắt đầu đặt chỗ.', FALSE, CURRENT_TIMESTAMP - INTERVAL '3 days'),
    ((SELECT id FROM users WHERE email = 'newmember@cospace.vn'), 'Yêu cầu nạp tiền đang chờ duyệt', 'Yêu cầu nạp 300.000 VND đang chờ Admin xử lý.', FALSE, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
    ((SELECT id FROM users WHERE email = 'blocked@cospace.vn'), 'Tài khoản bị hạn chế', 'Tài khoản hiện đang bị khóa. Vui lòng liên hệ quản trị viên.', FALSE, CURRENT_TIMESTAMP - INTERVAL '2 days'),
    ((SELECT id FROM users WHERE email = 'admin@cospace.vn'), 'Có yêu cầu nạp tiền mới', 'Hai yêu cầu nạp tiền đang chờ phê duyệt.', FALSE, CURRENT_TIMESTAMP - INTERVAL '5 minutes');
