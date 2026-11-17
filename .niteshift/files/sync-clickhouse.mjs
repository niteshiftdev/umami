#!/usr/bin/env node
// Mirror analytics rows from Postgres (DATABASE_URL) into the local ClickHouse
// (CLICKHOUSE_URL), so dashboards served from ClickHouse show the same data the
// test-data generator writes to Postgres. Only reads from Postgres.
//
//   node .niteshift/files/sync-clickhouse.mjs             # replace ClickHouse analytics with Postgres
//   node .niteshift/files/sync-clickhouse.mjs --if-empty  # only when ClickHouse has no events yet
//
// Run it through `ns secrets exec --env DATABASE_URL=DATABASE_URL -- ...` so DATABASE_URL is set.
import { createClient } from '@clickhouse/client';
import pg from 'pg';

const BATCH = 10000;
const ifEmpty = process.argv.includes('--if-empty');
const chUrl = new URL(process.env.CLICKHOUSE_URL || 'http://umami:umami@localhost:8123/umami');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const ch = createClient({
  url: `${chUrl.protocol}//${chUrl.hostname}:${chUrl.port}`,
  username: decodeURIComponent(chUrl.username || 'default'),
  password: decodeURIComponent(chUrl.password || ''),
  database: chUrl.pathname.replace('/', ''),
  clickhouse_settings: { input_format_null_as_default: 1, date_time_input_format: 'best_effort' },
});
const pgClient = new pg.Client({ connectionString: process.env.DATABASE_URL });

const s = v => (v === null || v === undefined ? '' : String(v));
const dt = v => (v ? new Date(v).toISOString().slice(0, 19).replace('T', ' ') : null);

async function count(table) {
  const rs = await ch.query({ query: `SELECT count() c FROM ${table}`, format: 'JSONEachRow' });
  return Number((await rs.json())[0].c);
}

// Keyset-paginate a Postgres query ordered by (created_at, id) and insert each page.
async function copy(label, sql, table, map) {
  let cursor = [new Date(0), '00000000-0000-0000-0000-000000000000'];
  let total = 0;
  for (;;) {
    const { rows } = await pgClient.query(sql, [...cursor, BATCH]);
    if (!rows.length) break;
    await ch.insert({ table, values: rows.map(map), format: 'JSONEachRow' });
    total += rows.length;
    const last = rows[rows.length - 1];
    cursor = [last._created_at, last._id];
  }
  console.log(`  ${label}: ${total} rows`);
}

await pgClient.connect();

if (ifEmpty && (await count('website_event')) > 0) {
  console.log('ClickHouse already has events; skipping sync.');
} else {
  console.log('Syncing Postgres analytics into ClickHouse...');
  for (const t of [
    'website_event',
    'event_data',
    'session_data',
    'website_revenue',
    'website_event_stats_hourly',
  ]) {
    await ch.command({ query: `TRUNCATE TABLE IF EXISTS ${t}` });
  }

  await copy(
    'website_event',
    `SELECT e.*, s.browser, s.os, s.device, s.screen, s.language, s.country, s.region, s.city,
            s.distinct_id, e.created_at AS _created_at, e.event_id AS _id
       FROM website_event e JOIN session s ON s.session_id = e.session_id
      WHERE (e.created_at, e.event_id) > ($1, $2)
      ORDER BY e.created_at, e.event_id LIMIT $3`,
    'website_event',
    r => ({
      website_id: r.website_id,
      session_id: r.session_id,
      visit_id: r.visit_id,
      event_id: r.event_id,
      hostname: s(r.hostname),
      browser: s(r.browser),
      os: s(r.os),
      device: s(r.device),
      screen: s(r.screen),
      language: s(r.language),
      country: s(r.country),
      region: s(r.region),
      city: s(r.city),
      url_path: s(r.url_path),
      url_query: s(r.url_query),
      utm_source: s(r.utm_source),
      utm_medium: s(r.utm_medium),
      utm_campaign: s(r.utm_campaign),
      utm_content: s(r.utm_content),
      utm_term: s(r.utm_term),
      referrer_path: s(r.referrer_path),
      referrer_query: s(r.referrer_query),
      referrer_domain: s(r.referrer_domain),
      page_title: s(r.page_title),
      gclid: s(r.gclid),
      fbclid: s(r.fbclid),
      msclkid: s(r.msclkid),
      ttclid: s(r.ttclid),
      li_fat_id: s(r.li_fat_id),
      twclid: s(r.twclid),
      event_type: r.event_type,
      event_name: s(r.event_name),
      tag: s(r.tag),
      distinct_id: s(r.distinct_id),
      created_at: dt(r.created_at),
    }),
  );

  await copy(
    'event_data',
    `SELECT d.*, e.session_id, e.url_path, e.event_name,
            d.created_at AS _created_at, d.event_data_id AS _id
       FROM event_data d JOIN website_event e ON e.event_id = d.website_event_id
      WHERE (d.created_at, d.event_data_id) > ($1, $2)
      ORDER BY d.created_at, d.event_data_id LIMIT $3`,
    'event_data',
    r => ({
      website_id: r.website_id,
      session_id: r.session_id,
      event_id: r.website_event_id,
      url_path: s(r.url_path),
      event_name: s(r.event_name),
      data_key: r.data_key,
      string_value: r.string_value,
      number_value: r.number_value,
      date_value: dt(r.date_value),
      data_type: r.data_type,
      created_at: dt(r.created_at),
    }),
  );

  await copy(
    'session_data',
    `SELECT d.*, d.created_at AS _created_at, d.session_data_id AS _id
       FROM session_data d
      WHERE (d.created_at, d.session_data_id) > ($1, $2)
      ORDER BY d.created_at, d.session_data_id LIMIT $3`,
    'session_data',
    r => ({
      website_id: r.website_id,
      session_id: r.session_id,
      data_key: r.data_key,
      string_value: r.string_value,
      number_value: r.number_value,
      date_value: dt(r.date_value),
      data_type: r.data_type,
      distinct_id: s(r.distinct_id),
      created_at: dt(r.created_at),
    }),
  );

  // website_revenue is normally filled by website_revenue_mv as event_data arrives;
  // load it straight from Postgres' revenue table so totals match exactly.
  await ch.command({ query: 'TRUNCATE TABLE website_revenue' });
  await copy(
    'website_revenue',
    `SELECT r.*, r.created_at AS _created_at, r.revenue_id AS _id
       FROM revenue r
      WHERE (r.created_at, r.revenue_id) > ($1, $2)
      ORDER BY r.created_at, r.revenue_id LIMIT $3`,
    'website_revenue',
    r => ({
      website_id: r.website_id,
      session_id: r.session_id,
      event_id: r.event_id,
      event_name: s(r.event_name),
      currency: s(r.currency),
      revenue: r.revenue ?? 0,
      created_at: dt(r.created_at),
    }),
  );
}

await pgClient.end();
await ch.close();
