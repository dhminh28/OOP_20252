CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    user_kind VARCHAR(31) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(30) NOT NULL,
    created_at TIMESTAMP
);

CREATE TABLE workspaces (
    id BIGSERIAL PRIMARY KEY,
    workspace_kind VARCHAR(31) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(30) NOT NULL,
    address VARCHAR(500) NOT NULL,
    floor VARCHAR(100),
    capacity INTEGER,
    price_per_hour NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) NOT NULL,
    image_url TEXT
);

CREATE TABLE workspace_equipment (
    id BIGSERIAL PRIMARY KEY,
    workspace_id BIGINT REFERENCES workspaces(id),
    name VARCHAR(100)
);

CREATE TABLE wallets (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    balance NUMERIC(12, 2) NOT NULL DEFAULT 0
);

CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT NOT NULL REFERENCES users(id),
    workspace_id BIGINT NOT NULL REFERENCES workspaces(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(30) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    note TEXT
);

CREATE INDEX idx_bookings_member_id ON bookings(member_id);
CREATE INDEX idx_bookings_workspace_time ON bookings(workspace_id, start_time, end_time);

CREATE TABLE wallet_transactions (
    id BIGSERIAL PRIMARY KEY,
    wallet_id BIGINT NOT NULL REFERENCES wallets(id),
    amount NUMERIC(12, 2) NOT NULL,
    type VARCHAR(30) NOT NULL,
    created_at TIMESTAMP
);

CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
