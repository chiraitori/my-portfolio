CREATE TABLE visitors (
	visitor_id TEXT PRIMARY KEY,
	first_seen INTEGER NOT NULL,
	last_seen INTEGER NOT NULL,
	current_path TEXT NOT NULL
);

CREATE INDEX visitors_last_seen_idx ON visitors (last_seen);
CREATE INDEX visitors_path_last_seen_idx ON visitors (current_path, last_seen);

CREATE TABLE page_views (
	path TEXT PRIMARY KEY,
	views INTEGER NOT NULL DEFAULT 0,
	updated_at INTEGER NOT NULL
);

CREATE TABLE site_stats (
	id INTEGER PRIMARY KEY CHECK (id = 1),
	total_visitors INTEGER NOT NULL DEFAULT 0
);

INSERT INTO site_stats (id, total_visitors) VALUES (1, 0);
