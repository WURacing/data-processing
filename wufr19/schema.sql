CREATE TABLE runs (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    session_index INT UNSIGNED NOT NULL,
    dbc_version VARCHAR(10) NOT NULL,
    loc VARCHAR(100) NOT NULL,
    driver VARCHAR(50) DEFAULT 'NOT_SPECIFIED',
    metadata VARCHAR(1000) DEFAULT '',
    time_start BIGINT UNSIGNED,
    time_end BIGINT UNSIGNED,
    primary_type VARCHAR(30) DEFAULT 'NOT_SPECIFIED',
    hits INT UNSIGNED DEFAULT 0,
    signals VARCHAR(1000),
    INDEX (time_start),
    INDEX (time_end),
    INDEX (time_start, time_end),
    INDEX (loc),
    INDEX (signals)
);

CREATE TABLE readings (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    run INT UNSIGNED NOT NULL,
    log_time INT UNSIGNED NOT NULL,
    packet_name VARCHAR(32) NOT NULL,
    sig_name VARCHAR(32) NOT NULL,
    sig_value VARCHAR(64) NOT NULL,
    sig_unit VARCHAR(32) NOT NULL,
    bus VARCHAR(10),
    logger VARCHAR(30),
    FOREIGN KEY (run) REFERENCES runs(id),
    INDEX (run),
    INDEX (run, sig_name)
);