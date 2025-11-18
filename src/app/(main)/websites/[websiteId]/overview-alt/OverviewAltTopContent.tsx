import { Grid, Heading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricsTable } from '@/components/metrics/MetricsTable';
import { useMessages } from '@/components/hooks';
import { CSSProperties } from 'react';

export function OverviewAltTopContent({
  websiteId,
  panelStyle,
}: {
  websiteId: string;
  panelStyle?: CSSProperties;
}) {
  const { formatMessage, labels } = useMessages();

  return (
    <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="3">
      <Panel style={panelStyle}>
        <Heading size="2" marginBottom="4">
          Top Pages
        </Heading>
        <MetricsTable
          type="path"
          title={formatMessage(labels.path)}
          websiteId={websiteId}
          limit={10}
          allowDownload={false}
          showMore={false}
          metric={formatMessage(labels.visitors)}
        />
      </Panel>
      <Panel style={panelStyle}>
        <Heading size="2" marginBottom="4">
          Top Sources
        </Heading>
        <MetricsTable
          type="referrer"
          title={formatMessage(labels.referrer)}
          websiteId={websiteId}
          limit={10}
          allowDownload={false}
          showMore={false}
          metric={formatMessage(labels.visitors)}
        />
      </Panel>
    </Grid>
  );
}
