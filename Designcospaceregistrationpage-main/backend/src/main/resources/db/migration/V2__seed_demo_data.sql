INSERT INTO users (user_kind, full_name, email, password_hash, phone, role, created_at)
VALUES
    ('MEMBER', 'Demo Member', 'member@cospace.vn', '$2a$10$uoN5vXAZ9P9EUf0L3SHxReclpi9ROj2SZK0kIdKOA1Mt6NOr6VJp6', '0912345678', 'MEMBER', NOW()),
    ('ADMIN', 'Demo Admin', 'admin@cospace.vn', '$2a$10$uoN5vXAZ9P9EUf0L3SHxReclpi9ROj2SZK0kIdKOA1Mt6NOr6VJp6', '0900000000', 'ADMIN', NOW());

INSERT INTO wallets (member_id, balance)
SELECT id, 500000
FROM users
WHERE email = 'member@cospace.vn';

INSERT INTO workspaces (workspace_kind, name, type, address, floor, capacity, price_per_hour, status, image_url)
VALUES
    ('HOT_DESK', 'Desk 101', 'HOT_DESK', 'BMT Building, 32 Le Duan', '2', 1, 50000, 'AVAILABLE', NULL),
    ('MEETING_ROOM', 'Meeting Room A', 'MEETING_ROOM', 'BMT Building, 32 Le Duan', '3', 8, 150000, 'AVAILABLE', NULL),
    ('PRIVATE_OFFICE', 'Private Office 01', 'PRIVATE_OFFICE', 'BMT Building, 32 Le Duan', '4', 4, 200000, 'AVAILABLE', NULL);
