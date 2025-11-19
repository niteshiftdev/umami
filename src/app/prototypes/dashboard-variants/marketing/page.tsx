'use client';

import { PageBody, Column, DataGrid } from '@umami/react-zen';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import { formatNumber } from '@/lib/format';
import styles from './page.module.css';

export default function MarketingDashboard() {
  // Mock data for marketing/campaign analytics
  const summaryMetrics = {
    spend: 28450.00,
    spendChange: 15.3,
    leads: 3420,
    leadsChange: 22.5,
    cpa: 8.32,
    cpaChange: -5.2,
    roas: 3.85,
    roasChange: 12.1,
  };

  const campaignPerformance = [
    { id: 1, name: 'Holiday Sale 2024', spend: 12500, impressions: 450000, clicks: 18900, ctr: 4.2, conversions: 847, roi: 285 },
    { id: 2, name: 'New Product Launch', spend: 8200, impressions: 320000, clicks: 9200, ctr: 2.9, conversions: 512, roi: 198 },
    { id: 3, name: 'Retargeting Campaign', spend: 4800, impressions: 180000, clicks: 8100, ctr: 4.5, conversions: 342, roi: 145 },
    { id: 4, name: 'Email Nurture Series', spend: 2100, impressions: 85000, clicks: 4200, ctr: 4.9, conversions: 289, roi: 98 },
    { id: 5, name: 'Influencer Partnerships', spend: 850, impressions: 120000, clicks: 3400, ctr: 2.8, conversions: 30, roi: 42 },
  ];

  const channelAttribution = [
    { channel: 'Paid Search', firstTouch: 28, lastTouch: 35, contribution: 32.2 },
    { channel: 'Paid Social', firstTouch: 22, lastTouch: 18, contribution: 24.1 },
    { channel: 'Email', firstTouch: 8, lastTouch: 24, contribution: 18.3 },
    { channel: 'Direct', firstTouch: 15, lastTouch: 12, contribution: 15.8 },
    { channel: 'Organic', firstTouch: 27, lastTouch: 11, contribution: 9.6 },
  ];

  const dailySpend = [
    { date: 'Nov 15', spend: 1200, leads: 82, cost: 14.63 },
    { date: 'Nov 16', spend: 1450, leads: 95, cost: 15.26 },
    { date: 'Nov 17', spend: 1680, leads: 112, cost: 15.00 },
    { date: 'Nov 18', spend: 1520, leads: 98, cost: 15.51 },
    { date: 'Nov 19', spend: 1820, leads: 124, cost: 14.68 },
    { date: 'Nov 20', spend: 2100, leads: 145, cost: 14.48 },
    { date: 'Nov 21', spend: 1980, leads: 138, cost: 14.35 },
  ];

  const audienceSegments = [
    { segment: 'High Intent', spend: 12300, leads: 1240, cpa: 9.92, conversionRate: 8.4 },
    { segment: 'Considering', spend: 10200, leads: 1850, cpa: 5.51, conversionRate: 3.2 },
    { segment: 'Lookalike (Converters)', spend: 3900, leads: 280, cpa: 13.93, conversionRate: 1.1 },
    { segment: 'Broad Awareness', spend: 2050, leads: 50, cpa: 41.00, conversionRate: 0.2 },
  ];

  return (
    <PageBody>
      <PageHeader title="Marketing Analytics Dashboard" subtitle="Campaign performance and ROI tracking" />

      <Column size="two">
        <Panel title="Total Ad Spend" subtitle="Across all channels">
          <div className={styles.metricLarge}>
            <div className={styles.value}>${formatNumber(summaryMetrics.spend)}</div>
            <div className={`${styles.change} ${summaryMetrics.spendChange > 0 ? styles.neutral : styles.neutral}`}>
              {summaryMetrics.spendChange > 0 ? '↑' : '↓'} {Math.abs(summaryMetrics.spendChange)}% vs last month
            </div>
          </div>
        </Panel>

        <Panel title="Total Leads" subtitle="Conversions from all campaigns">
          <div className={styles.metricLarge}>
            <div className={styles.value}>{formatNumber(summaryMetrics.leads)}</div>
            <div className={`${styles.change} ${summaryMetrics.leadsChange > 0 ? styles.positive : styles.negative}`}>
              {summaryMetrics.leadsChange > 0 ? '↑' : '↓'} {Math.abs(summaryMetrics.leadsChange)}% vs last month
            </div>
          </div>
        </Panel>

        <Panel title="Cost Per Acquisition" subtitle="Average CPA across all channels">
          <div className={styles.metricLarge}>
            <div className={styles.value}>${summaryMetrics.cpa}</div>
            <div className={`${styles.change} ${summaryMetrics.cpaChange < 0 ? styles.positive : styles.negative}`}>
              {summaryMetrics.cpaChange < 0 ? '↓' : '↑'} {Math.abs(summaryMetrics.cpaChange)}% vs last month
            </div>
          </div>
        </Panel>

        <Panel title="Return on Ad Spend" subtitle="Revenue for every dollar spent">
          <div className={styles.metricLarge}>
            <div className={styles.value}>{summaryMetrics.roas}x</div>
            <div className={`${styles.change} ${summaryMetrics.roasChange > 0 ? styles.positive : styles.negative}`}>
              {summaryMetrics.roasChange > 0 ? '↑' : '↓'} {Math.abs(summaryMetrics.roasChange)}% vs last month
            </div>
          </div>
        </Panel>
      </Column>

      <Column size="full">
        <Panel title="Campaign Performance" subtitle="Detailed metrics for all active campaigns">
          <DataGrid
            columns={[
              { key: 'name', label: 'Campaign Name', width: '25%' },
              { key: 'spend', label: 'Spend', render: (value) => `$${formatNumber(value)}`, width: '12%' },
              { key: 'impressions', label: 'Impressions', render: (value) => formatNumber(value), width: '15%' },
              { key: 'ctr', label: 'CTR %', render: (value) => `${value}%`, width: '10%' },
              { key: 'conversions', label: 'Conversions', render: (value) => formatNumber(value), width: '12%' },
              { key: 'roi', label: 'ROI %', render: (value) => `${value}%`, width: '10%' },
            ]}
            data={campaignPerformance}
          />
        </Panel>
      </Column>

      <Column size="two">
        <Panel title="Channel Attribution Model" subtitle="First-touch vs last-touch vs linear">
          <DataGrid
            columns={[
              { key: 'channel', label: 'Channel', width: '25%' },
              { key: 'firstTouch', label: 'First Touch %', render: (value) => `${value}%`, width: '25%' },
              { key: 'lastTouch', label: 'Last Touch %', render: (value) => `${value}%`, width: '25%' },
              { key: 'contribution', label: 'Contribution %', render: (value) => `${value}%`, width: '25%' },
            ]}
            data={channelAttribution}
          />
        </Panel>

        <Panel title="Daily Campaign Metrics" subtitle="Real-time performance tracking">
          <DataGrid
            columns={[
              { key: 'date', label: 'Date', width: '20%' },
              { key: 'spend', label: 'Spend', render: (value) => `$${formatNumber(value)}`, width: '25%' },
              { key: 'leads', label: 'Leads', render: (value) => formatNumber(value), width: '25%' },
              { key: 'cost', label: 'Cost/Lead', render: (value) => `$${value.toFixed(2)}`, width: '30%' },
            ]}
            data={dailySpend}
          />
        </Panel>
      </Column>

      <Column size="full">
        <Panel title="Performance by Audience Segment" subtitle="Efficiency varies by audience targeting">
          <DataGrid
            columns={[
              { key: 'segment', label: 'Audience Segment', width: '25%' },
              { key: 'spend', label: 'Spend', render: (value) => `$${formatNumber(value)}`, width: '20%' },
              { key: 'leads', label: 'Leads Generated', render: (value) => formatNumber(value), width: '20%' },
              { key: 'cpa', label: 'Cost per Lead', render: (value) => `$${value.toFixed(2)}`, width: '18%' },
              { key: 'conversionRate', label: 'Conversion %', render: (value) => `${value}%`, width: '17%' },
            ]}
            data={audienceSegments}
          />
        </Panel>
      </Column>
    </PageBody>
  );
}
