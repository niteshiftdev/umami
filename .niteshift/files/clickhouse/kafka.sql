-- Kafka ingestion pipeline for the local dev stack (not part of Umami's own schema).
--
-- With KAFKA_URL/KAFKA_BROKER set, Umami publishes tracked events to the `event`,
-- `event_data` and `session_data` topics instead of inserting into ClickHouse
-- (see src/queries/sql/events/saveEvent.ts). These Kafka-engine tables consume
-- those topics and materialized views move the rows into the real tables, the
-- way a hosted Umami + Kafka deployment does. Every statement is idempotent.

CREATE TABLE IF NOT EXISTS umami.website_event_queue
(
    website_id UUID,
    session_id UUID,
    visit_id UUID,
    event_id UUID,
    hostname String,
    browser String,
    os String,
    device String,
    screen String,
    language String,
    country String,
    region String,
    city String,
    url_path String,
    url_query String,
    utm_source String,
    utm_medium String,
    utm_campaign String,
    utm_content String,
    utm_term String,
    referrer_path String,
    referrer_query String,
    referrer_domain String,
    page_title String,
    gclid String,
    fbclid String,
    msclkid String,
    ttclid String,
    li_fat_id String,
    twclid String,
    event_type UInt32,
    event_name String,
    tag String,
    distinct_id String,
    created_at DateTime('UTC')
)
ENGINE = Kafka
SETTINGS kafka_broker_list = 'localhost:9092',
         kafka_topic_list = 'event',
         kafka_group_name = 'umami_clickhouse_event',
         kafka_format = 'JSONEachRow',
         kafka_skip_broken_messages = 100,
         kafka_flush_interval_ms = 1000;

CREATE MATERIALIZED VIEW IF NOT EXISTS umami.website_event_queue_mv
TO umami.website_event
AS SELECT * FROM umami.website_event_queue;

CREATE TABLE IF NOT EXISTS umami.event_data_queue
(
    website_id UUID,
    session_id UUID,
    event_id UUID,
    url_path String,
    event_name String,
    data_key String,
    string_value Nullable(String),
    number_value Nullable(Decimal(22, 4)),
    date_value Nullable(DateTime('UTC')),
    data_type UInt32,
    created_at DateTime('UTC')
)
ENGINE = Kafka
SETTINGS kafka_broker_list = 'localhost:9092',
         kafka_topic_list = 'event_data',
         kafka_group_name = 'umami_clickhouse_event_data',
         kafka_format = 'JSONEachRow',
         kafka_skip_broken_messages = 100,
         kafka_flush_interval_ms = 1000;

CREATE MATERIALIZED VIEW IF NOT EXISTS umami.event_data_queue_mv
TO umami.event_data
AS SELECT * FROM umami.event_data_queue;

CREATE TABLE IF NOT EXISTS umami.session_data_queue
(
    website_id UUID,
    session_id UUID,
    data_key String,
    string_value Nullable(String),
    number_value Nullable(Decimal(22, 4)),
    date_value Nullable(DateTime('UTC')),
    data_type UInt32,
    distinct_id String,
    created_at DateTime('UTC')
)
ENGINE = Kafka
SETTINGS kafka_broker_list = 'localhost:9092',
         kafka_topic_list = 'session_data',
         kafka_group_name = 'umami_clickhouse_session_data',
         kafka_format = 'JSONEachRow',
         kafka_skip_broken_messages = 100,
         kafka_flush_interval_ms = 1000;

CREATE MATERIALIZED VIEW IF NOT EXISTS umami.session_data_queue_mv
TO umami.session_data
AS SELECT * FROM umami.session_data_queue;
