import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useDateRange } from '@/components/hooks';
import { useWebsitePageviewsQuery } from '@/components/hooks/queries/useWebsitePageviewsQuery';
import { PageviewsChart } from '@/components/metrics/PageviewsChart';
import { useMemo } from 'react';
import { useDynamicBoolean, useDynamicColor, useDynamicNumber } from '@niteshift/dials';

export function OverviewAltChart({ websiteId }: { websiteId: string }) {
  const { dateRange } = useDateRange();
  const { startDate, endDate, unit, value } = dateRange;
  const { data, isLoading, isFetching, error } = useWebsitePageviewsQuery({
    websiteId,
    compare: undefined,
  });
  const { pageviews, sessions } = (data || {}) as any;

  // Chart customization dials
  const showPageviews = useDynamicBoolean('chart-show-pageviews', {
    label: 'Show Pageviews',
    description: 'Display pageviews line on chart',
    default: true,
    trueLabel: 'Visible',
    falseLabel: 'Hidden',
    group: 'Overview Alt - Chart',
  });

  const showSessions = useDynamicBoolean('chart-show-sessions', {
    label: 'Show Sessions',
    description: 'Display sessions line on chart',
    default: true,
    trueLabel: 'Visible',
    falseLabel: 'Hidden',
    group: 'Overview Alt - Chart',
  });

  const pageviewsColor = useDynamicColor('chart-pageviews-color', {
    label: 'Pageviews Color',
    description: 'Color for pageviews line',
    default: '#3e63dd',
    options: ['#3e63dd', '#0090ff', '#147af3', '#2680eb', '#5b5bd6'],
    allowCustom: true,
    group: 'Overview Alt - Chart',
  });

  const sessionsColor = useDynamicColor('chart-sessions-color', {
    label: 'Sessions Color',
    description: 'Color for sessions line',
    default: '#30a46c',
    options: ['#30a46c', '#12a594', '#00a2c7', '#0090ff', '#8e4ec6'],
    allowCustom: true,
    group: 'Overview Alt - Chart',
  });

  const chartOpacity = useDynamicNumber('chart-opacity', {
    label: 'Chart Opacity',
    description: 'Opacity of chart areas',
    default: 0.4,
    min: 0.1,
    max: 1,
    step: 0.1,
    options: [0.2, 0.4, 0.6, 0.8],
    group: 'Overview Alt - Chart',
  });

  const chartData = useMemo(() => {
    if (data) {
      return {
        pageviews: showPageviews ? pageviews : [],
        sessions: showSessions ? sessions : [],
      };
    }
    return { pageviews: [], sessions: [] };
  }, [data, startDate, endDate, unit, showPageviews, showSessions]);

  return (
    <LoadingPanel data={data} isFetching={isFetching} isLoading={isLoading} error={error}>
      <PageviewsChart
        key={value}
        data={chartData}
        minDate={startDate}
        maxDate={endDate}
        unit={unit}
        colors={{
          pageviews: pageviewsColor,
          sessions: sessionsColor,
        }}
        opacity={chartOpacity}
      />
    </LoadingPanel>
  );
}
