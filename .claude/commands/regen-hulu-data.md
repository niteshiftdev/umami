---
allowed-tools: Bash(ns secrets exec --env DATABASE_URL=DATABASE_URL -- npx tsx scripts/generate-test-data.ts:*), Bash(ns secrets exec --env DATABASE_URL=DATABASE_URL -- node .niteshift/files/sync-clickhouse.mjs:*)
description: Regenerate Hulu test data (clean, full 60 days)
---

## Your task

Run the Hulu test data generation script to regenerate all test data, then copy it into ClickHouse (the dev app reads analytics from ClickHouse).

Execute these commands from the repository root:
```
ns secrets exec --env DATABASE_URL=DATABASE_URL -- npx tsx scripts/generate-test-data.ts --clean --scale=full
ns secrets exec --env DATABASE_URL=DATABASE_URL -- node .niteshift/files/sync-clickhouse.mjs
```

This will:
- Clean all existing data for the hulu.com website
- Generate 60 days of realistic analytics data (~15,000 sessions, ~55,000 events)
- Create demo reports and segments
- Generate revenue data for subscription conversions
- Replace the analytics in the local ClickHouse with the regenerated Postgres data

Wait for the scripts to complete (it may take a few minutes) and summarize the results for the user.
