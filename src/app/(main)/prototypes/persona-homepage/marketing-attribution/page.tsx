'use client';
import { Column, Row, Grid, Text, Heading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { CHART_COLORS } from '@/lib/constants';
import { formatNumber } from '@/lib/format';

export default function MarketingAttributionHomepage() {
  // Generate realistic marketing attribution data with proper date formatting
  const today = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (29 - i));
    // Format as YYYY-MM-DD for day unit
    return date.toISOString().split('T')[0];
  });

  // Generate deterministic data based on index for consistency
  const generateValue = (base: number, variance: number, index: number) => {
    return Math.floor(base + Math.sin(index * 0.5) * variance + (index % 7 === 0 || index % 7 === 6 ? variance * 0.5 : 0));
  };

  // Traffic sources over time
  const organicTraffic = last30Days.map((date, i) => ({
    x: date,
    y: generateValue(4500, 800, i),
  }));

  const paidTraffic = last30Days.map((date, i) => ({
    x: date,
    y: generateValue(2800, 500, i),
  }));

  const socialTraffic = last30Days.map((date, i) => ({
    x: date,
    y: generateValue(1900, 400, i),
  }));

  const referralTraffic = last30Days.map((date, i) => ({
    x: date,
    y: generateValue(1200, 300, i),
  }));

  // Campaign performance
  const campaignData = [
    { name: 'Summer Sale 2024', visitors: 12450, conversions: 1870, spend: 8500, revenue: 56800 },
    { name: 'Product Launch - Q4', visitors: 9820, conversions: 1472, spend: 12300, revenue: 67200 },
    { name: 'Brand Awareness', visitors: 18900, conversions: 945, spend: 6200, revenue: 28900 },
    { name: 'Retargeting Campaign', visitors: 6340, conversions: 1140, spend: 4800, revenue: 38400 },
    { name: 'Email Nurture Series', visitors: 4280, conversions: 642, spend: 1200, revenue: 19800 },
    { name: 'Partner Referral', visitors: 3150, conversions: 504, spend: 2100, revenue: 22600 },
  ];

  // Traffic source distribution
  const trafficSourceData = {
    labels: ['Organic Search', 'Paid Search', 'Social Media', 'Direct', 'Referral', 'Email', 'Display Ads'],
    datasets: [
      {
        label: 'Sessions',
        data: [38200, 24500, 18900, 12600, 10400, 8200, 5100],
        backgroundColor: CHART_COLORS.slice(0, 7),
      },
    ],
  };

  // Channel ROI comparison
  const channelROI = [
    { channel: 'Email Marketing', roi: 420, spend: 4200, revenue: 21840 },
    { channel: 'Organic Search', roi: 380, spend: 8500, revenue: 40800 },
    { channel: 'Paid Search', roi: 245, spend: 28900, revenue: 99760 },
    { channel: 'Social Media', roi: 185, spend: 12600, revenue: 35910 },
    { channel: 'Display Ads', roi: 142, spend: 15800, revenue: 38236 },
    { channel: 'Affiliate', roi: 310, spend: 6700, revenue: 27470 },
  ];

  // UTM parameter performance
  const utmPerformance = [
    { name: 'google/cpc/summer-sale', visits: 8420, conversions: 1264, cvr: 15.0 },
    { name: 'facebook/social/product-launch', visits: 6890, conversions: 896, cvr: 13.0 },
    { name: 'newsletter/email/weekly-digest', visits: 5230, conversions: 785, cvr: 15.0 },
    { name: 'linkedin/social/thought-leadership', visits: 4120, conversions: 453, cvr: 11.0 },
    { name: 'twitter/social/engagement', visits: 3680, conversions: 331, cvr: 9.0 },
    { name: 'youtube/video/tutorial', visits: 2940, conversions: 382, cvr: 13.0 },
  ];

  // Geographic performance
  const geoPerformance = [
    { country: 'United States', visits: 42800, conversions: 5568, revenue: 168400 },
    { country: 'United Kingdom', visits: 18600, conversions: 2046, revenue: 71600 },
    { country: 'Germany', visits: 14200, conversions: 1562, revenue: 54200 },
    { country: 'Canada', visits: 12400, conversions: 1364, revenue: 47600 },
    { country: 'Australia', visits: 9800, conversions: 1078, revenue: 37800 },
  ];

  return (
    <Column gap margin="4">
      <Column gap="2">
        <Heading size="9" weight="bold">Marketing Attribution</Heading>
        <Text size="4" color="gray">Track inbound sources and campaign performance</Text>
      </Column>

      {/* Key Marketing Metrics */}
      <Grid columns={{ xs: 1, md: 2, lg: 4 }} gap>
        <MetricCard
          label="Total Sessions"
          value={117900}
          change={108200}
          showChange={true}
          formatValue={formatNumber}
        />
        <MetricCard
          label="Conversion Rate"
          value={4.2}
          change={3.8}
          showChange={true}
          formatValue={(n) => `${n.toFixed(1)}%`}
        />
        <MetricCard
          label="Marketing Spend"
          value={78200}
          change={72800}
          showChange={true}
          reverseColors={true}
          formatValue={(n) => `$${formatNumber(Math.round(n))}`}
        />
        <MetricCard
          label="Attributed Revenue"
          value={264400}
          change={238900}
          showChange={true}
          formatValue={(n) => `$${formatNumber(Math.round(n))}`}
        />
      </Grid>

      {/* Traffic Sources Over Time */}
      <Panel title="Traffic Sources - Last 30 Days">
        <BarChart
          chartData={{
            datasets: [
              {
                label: 'Organic',
                data: organicTraffic,
                backgroundColor: CHART_COLORS[0],
                borderColor: CHART_COLORS[0],
                borderWidth: 1,
              },
              {
                label: 'Paid',
                data: paidTraffic,
                backgroundColor: CHART_COLORS[1],
                borderColor: CHART_COLORS[1],
                borderWidth: 1,
              },
              {
                label: 'Social',
                data: socialTraffic,
                backgroundColor: CHART_COLORS[2],
                borderColor: CHART_COLORS[2],
                borderWidth: 1,
              },
              {
                label: 'Referral',
                data: referralTraffic,
                backgroundColor: CHART_COLORS[3],
                borderColor: CHART_COLORS[3],
                borderWidth: 1,
              },
            ],
          }}
          unit="day"
          stacked={true}
          height={320}
        />
      </Panel>

      {/* Traffic Distribution and Channel ROI */}
      <Grid columns={{ xs: 1, lg: 2 }} gap>
        <Panel title="Traffic Source Distribution">
          <PieChart
            type="doughnut"
            chartData={trafficSourceData}
            height={300}
          />
        </Panel>

        <Panel title="Channel ROI Performance">
          <Column gap="4" paddingY="4">
            {channelROI
              .sort((a, b) => b.roi - a.roi)
              .map((item, index) => (
                <Column key={index} gap="2">
                  <Row justifyContent="space-between" alignItems="center">
                    <Text weight="bold">{item.channel}</Text>
                    <Text size="6" weight="bold" color={item.roi >= 200 ? 'green' : 'orange'}>
                      {item.roi}% ROI
                    </Text>
                  </Row>
                  <Row gap="4" alignItems="center" justifyContent="space-between">
                    <Text size="2" color="gray">
                      Spend: ${formatNumber(item.spend)}
                    </Text>
                    <Text size="2" color="gray">
                      Revenue: ${formatNumber(item.revenue)}
                    </Text>
                  </Row>
                  <div
                    style={{
                      height: '8px',
                      width: `${Math.min((item.roi / 450) * 100, 100)}%`,
                      backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                      borderRadius: '4px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </Column>
              ))}
          </Column>
        </Panel>
      </Grid>

      {/* Campaign Performance Table */}
      <Panel title="Active Campaigns - Performance Overview">
        <Column gap="3" paddingY="2">
          <Row paddingX="4" paddingY="2" style={{ borderBottom: '1px solid #d9d9d9' }}>
            <Grid columns={6} gap="2" style={{ width: '100%' }}>
              <Text weight="bold" size="2">Campaign</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>Visitors</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>Conversions</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>CVR</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>Spend</Text>
              <Text weight="bold" size="2" style={{ textAlign: 'right' }}>Revenue</Text>
            </Grid>
          </Row>
          {campaignData.map((campaign, index) => {
            const cvr = ((campaign.conversions / campaign.visitors) * 100).toFixed(1);
            const roi = (((campaign.revenue - campaign.spend) / campaign.spend) * 100).toFixed(0);
            return (
              <Row key={index} paddingX="4" paddingY="3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                <Grid columns={6} gap="2" style={{ width: '100%' }} alignItems="center">
                  <Text>{campaign.name}</Text>
                  <Text style={{ textAlign: 'right' }}>{formatNumber(campaign.visitors)}</Text>
                  <Text style={{ textAlign: 'right' }}>{formatNumber(campaign.conversions)}</Text>
                  <Text style={{ textAlign: 'right' }} color={parseFloat(cvr) >= 12 ? 'green' : 'gray'}>
                    {cvr}%
                  </Text>
                  <Text style={{ textAlign: 'right' }}>${formatNumber(campaign.spend)}</Text>
                  <Text style={{ textAlign: 'right' }} weight="bold">
                    ${formatNumber(campaign.revenue)}
                  </Text>
                </Grid>
              </Row>
            );
          })}
        </Column>
      </Panel>

      {/* UTM Performance and Geographic Data */}
      <Grid columns={{ xs: 1, lg: 2 }} gap>
        <Panel title="Top UTM Sources">
          <ListTable
            data={utmPerformance.map((item, index) => ({
              label: item.name,
              count: item.visits,
              percent: (item.visits / utmPerformance[0].visits) * 100,
              color: CHART_COLORS[index % CHART_COLORS.length],
            }))}
            metric="Visits"
            renderLabel={(row: any) => (
              <Row gap="2" alignItems="center">
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: row.color,
                  }}
                />
                <Text style={{ fontSize: '12px' }}>{row.label}</Text>
              </Row>
            )}
          />
        </Panel>

        <Panel title="Top Performing Regions">
          <ListTable
            data={geoPerformance.map((item, index) => ({
              label: item.country,
              count: item.visits,
              percent: (item.visits / geoPerformance[0].visits) * 100,
              color: CHART_COLORS[index % CHART_COLORS.length],
            }))}
            metric="Visits"
            renderLabel={(row: any) => (
              <Row gap="2" alignItems="center">
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: row.color,
                  }}
                />
                <Text>{row.label}</Text>
              </Row>
            )}
          />
        </Panel>
      </Grid>
    </Column>
  );
}
