import { useEffect, useMemo, useContext } from 'react';
import { Icon, Text, Row, Grid } from '@umami/react-zen';
import { LinkButton } from '@/components/common/LinkButton';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useMessages, useNavigation, useWebsiteMetricsQuery } from '@/components/hooks';
import { Maximize } from '@/components/icons';
import { MetricLabel } from '@/components/metrics/MetricLabel';
import { percentFilter } from '@/lib/filters';
import { ListTable, ListTableProps } from './ListTable';
import { TypographyContext } from '@/app/(main)/websites/[websiteId]/WebsitePage';

export interface MetricsTableProps extends ListTableProps {
  websiteId: string;
  type: string;
  dataFilter?: (data: any) => any;
  limit?: number;
  showMore?: boolean;
  filterLink?: boolean;
  params?: Record<string, any>;
  onDataLoad?: (data: any) => void;
}

export function MetricsTable({
  websiteId,
  type,
  dataFilter,
  limit,
  showMore = false,
  filterLink = true,
  params,
  onDataLoad,
  ...props
}: MetricsTableProps) {
  const { updateParams } = useNavigation();
  const { formatMessage, labels } = useMessages();
  const typography = useContext(TypographyContext);
  const { data, isLoading, isFetching, error } = useWebsiteMetricsQuery(websiteId, {
    type,
    limit,
    ...params,
  });

  const filteredData = useMemo(() => {
    if (data) {
      let items = data as any[];

      if (dataFilter) {
        if (Array.isArray(dataFilter)) {
          items = dataFilter.reduce((arr, filter) => {
            return filter(arr);
          }, items);
        } else {
          items = dataFilter(items);
        }
      }

      items = percentFilter(items);

      return items.map(({ x, y, z, ...props }) => ({ label: x, count: y, percent: z, ...props }));
    }
    return [];
  }, [data, dataFilter, limit, type]);

  useEffect(() => {
    if (data) {
      onDataLoad?.(data);
    }
  }, [data]);

  const renderLabel = (row: any) => {
    return filterLink ? <MetricLabel type={type} data={row} /> : row.label;
  };

  return (
    <LoadingPanel
      data={data}
      isFetching={isFetching}
      isLoading={isLoading}
      error={error}
      minHeight="400px"
    >
      <Grid>
        {data && (
          <ListTable
            {...props}
            data={filteredData}
            renderLabel={renderLabel}
            headerSize={typography.tableHeaderSize}
            headerWeight={typography.tableHeaderWeight}
            headerColor={typography.tableHeaderColor}
            rowLabelSize={typography.tableRowLabelSize}
            rowLabelWeight={typography.tableRowLabelWeight}
            rowLabelColor={typography.tableRowLabelColor}
            rowValueSize={typography.tableRowValueSize}
            rowValueWeight={typography.tableRowValueWeight}
            rowValueColor={typography.tableRowValueColor}
          />
        )}
        {showMore && limit && (
          <Row justifyContent="center" alignItems="flex-end">
            <LinkButton href={updateParams({ view: type })} variant="quiet">
              <Icon size="sm">
                <Maximize />
              </Icon>
              <Text>{formatMessage(labels.more)}</Text>
            </LinkButton>
          </Row>
        )}
      </Grid>
    </LoadingPanel>
  );
}
