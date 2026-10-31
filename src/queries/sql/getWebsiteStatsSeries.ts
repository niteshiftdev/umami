import clickhouse from '@/lib/clickhouse';
import { EVENT_COLUMNS } from '@/lib/constants';
import { CLICKHOUSE, PRISMA, runQuery } from '@/lib/db';
import prisma from '@/lib/prisma';
import type { QueryFilters } from '@/lib/types';
import type { WebsiteStatsData } from './getWebsiteStats';

const FUNCTION_NAME = 'getWebsiteStatsSeries';

export interface WebsiteStatsSeriesData extends WebsiteStatsData {
  x: string;
}

export async function getWebsiteStatsSeries(
  ...args: [websiteId: string, filters: QueryFilters]
): Promise<WebsiteStatsSeriesData[]> {
  return runQuery({
    [PRISMA]: () => relationalQuery(...args),
    [CLICKHOUSE]: () => clickhouseQuery(...args),
  });
}

async function relationalQuery(
  websiteId: string,
  filters: QueryFilters,
): Promise<WebsiteStatsSeriesData[]> {
  const { timezone = 'utc', unit = 'day' } = filters;
  const { getDateSQL, getTimestampDiffSQL, parseFilters, rawQuery } = prisma;
  const { filterQuery, joinSessionQuery, cohortQuery, queryParams } = parseFilters({
    ...filters,
    websiteId,
  });

  return rawQuery(
    `
    select
      ${getDateSQL('t.min_time', unit, timezone)} as "x",
      cast(coalesce(sum(t.c), 0) as bigint) as "pageviews",
      count(distinct t.session_id) as "visitors",
      count(distinct t.visit_id) as "visits",
      coalesce(sum(case when t.c = 1 then 1 else 0 end), 0) as "bounces",
      cast(coalesce(sum(${getTimestampDiffSQL('t.min_time', 't.max_time')}), 0) as bigint) as "totaltime"
    from (
      select
        website_event.session_id,
        website_event.visit_id,
        count(*) as "c",
        min(website_event.created_at) as "min_time",
        max(website_event.created_at) as "max_time"
      from website_event
      ${cohortQuery}
      ${joinSessionQuery}
      where website_event.website_id = {{websiteId::uuid}}
        and website_event.created_at between {{startDate}} and {{endDate}}
        and website_event.event_type != 2
        ${filterQuery}
      group by 1, 2
    ) as t
    group by 1
    order by 1
    `,
    queryParams,
    FUNCTION_NAME,
  );
}

async function clickhouseQuery(
  websiteId: string,
  filters: QueryFilters,
): Promise<WebsiteStatsSeriesData[]> {
  const { timezone = 'UTC', unit = 'day' } = filters;
  const { rawQuery, parseFilters, getDateSQL } = clickhouse;
  const { filterQuery, cohortQuery, queryParams } = parseFilters({
    ...filters,
    websiteId,
  });

  const fromHourly = !EVENT_COLUMNS.some(item => Object.keys(filters).includes(item));

  const sql = `
    select
      ${getDateSQL('t.min_time', unit, timezone)} as "x",
      sum(t.c) as "pageviews",
      uniq(t.session_id) as "visitors",
      uniq(t.visit_id) as "visits",
      sumIf(1, t.c = 1) as "bounces",
      sum(max_time-min_time) as "totaltime"
    from (
      select
        session_id,
        visit_id,
        ${fromHourly ? 'sum(views)' : 'count(*)'} c,
        ${fromHourly ? 'min(min_time)' : 'min(created_at)'} min_time,
        ${fromHourly ? 'max(max_time)' : 'max(created_at)'} max_time
      from ${fromHourly ? 'website_event_stats_hourly' : 'website_event'} "website_event"
      ${cohortQuery}
      where website_id = {websiteId:UUID}
        and created_at between {startDate:DateTime64} and {endDate:DateTime64}
        and event_type != 2
        ${filterQuery}
      group by session_id, visit_id
    ) as t
    group by x
    order by x
    `;

  return rawQuery(sql, queryParams, FUNCTION_NAME);
}
