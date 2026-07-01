CREATE TABLE daily_analytics (
	day TEXT NOT NULL,
	path TEXT NOT NULL,
	visitors INTEGER NOT NULL DEFAULT 0,
	views INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY (day, path)
);

CREATE INDEX daily_analytics_path_day_idx ON daily_analytics (path, day);
