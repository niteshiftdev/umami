---
allowed-tools: Bash(npx tsx scripts/generate-test-data.ts:*)
description: Regenerate Hulu test data (clean, full 60 days)
---

## Your task

Run the Hulu test data generation script to regenerate all test data.

Execute this command:
```
npx tsx scripts/generate-test-data.ts --clean --scale=full
```

This will:
- Clean all existing data for the hulu.com website
- Generate 60 days of realistic analytics data (~15,000 sessions, ~55,000 events)
- Create demo reports and segments
- Generate revenue data for subscription conversions

Wait for the script to complete (it may take a few minutes) and summarize the results for the user.
