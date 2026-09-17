CREATE TABLE donations (
	order_code TEXT PRIMARY KEY,
	amount INTEGER NOT NULL,
	message TEXT NOT NULL DEFAULT '',
	created_at INTEGER NOT NULL,
	paid_at INTEGER,
	notification_claimed_at INTEGER,
	notified_at INTEGER
);
