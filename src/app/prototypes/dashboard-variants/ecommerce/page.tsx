'use client';

import { Column, DataTable, DataColumn } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { formatNumber } from '@/lib/format';
import styles from './page.module.css';

export default function EcommerceDashboard() {
  // Mock data for e-commerce analytics
  const summaryMetrics = {
    revenue: 145230.50,
    revenueChange: 12.5,
    orders: 3420,
    ordersChange: 8.2,
    conversionRate: 3.85,
    conversionChange: 0.45,
    avgOrderValue: 42.47,
    avgOrderValueChange: 4.2,
  };

  const topProducts = [
    { id: 1, name: 'Wireless Headphones Pro', revenue: 28500, units: 420, conversion: 8.2 },
    { id: 2, name: 'USB-C Phone Charger', revenue: 22340, units: 1890, conversion: 15.3 },
    { id: 3, name: 'Laptop Stand Aluminum', revenue: 19200, units: 640, conversion: 6.4 },
    { id: 4, name: 'Mechanical Keyboard RGB', revenue: 16800, units: 280, conversion: 5.6 },
    { id: 5, name: 'Monitor Light Bar', revenue: 12390, units: 310, conversion: 4.1 },
  ];

  const funnelData = [
    { step: 'Product View', users: 85000, conversion: 100 },
    { step: 'Add to Cart', users: 18700, conversion: 22 },
    { step: 'Checkout Start', users: 14200, conversion: 16.7 },
    { step: 'Payment Info', users: 11300, conversion: 13.3 },
    { step: 'Order Confirmed', users: 3420, conversion: 4 },
  ];

  const cartAbandonmentByDevice = [
    { device: 'Mobile', abandoned: 3420, completed: 1240, rate: 73.4 },
    { device: 'Desktop', abandoned: 1890, completed: 2010, rate: 48.4 },
    { device: 'Tablet', abandoned: 890, completed: 170, rate: 84 },
  ];

  const revenueBySource = [
    { source: 'Direct', revenue: 52300, contribution: 36 },
    { source: 'Google Ads', revenue: 38400, contribution: 26.4 },
    { source: 'Facebook Ads', revenue: 28900, contribution: 19.9 },
    { source: 'Organic Search', revenue: 18200, contribution: 12.5 },
    { source: 'Email Campaign', revenue: 7430, contribution: 5.1 },
  ];

  return (
    <PageBody>
      <PageHeader title="E-Commerce Analytics Dashboard" description="Product sales and conversion performance" />

      <Column size="two">
        <Panel title="Revenue" subtitle="Total sales this month">
          <div className={styles.metricLarge}>
            <div className={styles.value}>${formatNumber(summaryMetrics.revenue)}</div>
            <div className={`${styles.change} ${summaryMetrics.revenueChange > 0 ? styles.positive : styles.negative}`}>
              {summaryMetrics.revenueChange > 0 ? '↑' : '↓'} {Math.abs(summaryMetrics.revenueChange)}% vs last month
            </div>
          </div>
        </Panel>

        <Panel title="Conversion Rate" subtitle="Overall checkout success rate">
          <div className={styles.metricLarge}>
            <div className={styles.value}>{summaryMetrics.conversionRate}%</div>
            <div className={`${styles.change} ${summaryMetrics.conversionChange > 0 ? styles.positive : styles.negative}`}>
              {summaryMetrics.conversionChange > 0 ? '↑' : '↓'} {Math.abs(summaryMetrics.conversionChange)}% vs last month
            </div>
          </div>
        </Panel>

        <Panel title="Orders" subtitle="Total completed orders">
          <div className={styles.metricLarge}>
            <div className={styles.value}>{formatNumber(summaryMetrics.orders)}</div>
            <div className={`${styles.change} ${summaryMetrics.ordersChange > 0 ? styles.positive : styles.negative}`}>
              {summaryMetrics.ordersChange > 0 ? '↑' : '↓'} {Math.abs(summaryMetrics.ordersChange)}% vs last month
            </div>
          </div>
        </Panel>

        <Panel title="Avg Order Value" subtitle="Average revenue per order">
          <div className={styles.metricLarge}>
            <div className={styles.value}>${summaryMetrics.avgOrderValue}</div>
            <div className={`${styles.change} ${summaryMetrics.avgOrderValueChange > 0 ? styles.positive : styles.negative}`}>
              {summaryMetrics.avgOrderValueChange > 0 ? '↑' : '↓'} {Math.abs(summaryMetrics.avgOrderValueChange)}% vs last month
            </div>
          </div>
        </Panel>
      </Column>

      <Column size="full">
        <Panel title="Top Products by Revenue" subtitle="Last 30 days">
          <DataTable data={topProducts}>
            <DataColumn id="name" label="Product Name">
              {(row: any) => row.name}
            </DataColumn>
            <DataColumn id="revenue" label="Revenue">
              {(row: any) => `$${formatNumber(row.revenue)}`}
            </DataColumn>
            <DataColumn id="units" label="Units Sold">
              {(row: any) => formatNumber(row.units)}
            </DataColumn>
            <DataColumn id="conversion" label="Conversion %">
              {(row: any) => `${row.conversion}%`}
            </DataColumn>
          </DataTable>
        </Panel>
      </Column>

      <Column size="two">
        <Panel title="Conversion Funnel" subtitle="User journey from view to purchase">
          <div className={styles.funnel}>
            {funnelData.map((step, index) => (
              <div key={index} className={styles.funnelStep}>
                <div className={styles.funnelLabel}>{step.step}</div>
                <div className={styles.funnelBar} style={{ width: `${step.conversion}%` }}>
                  <span className={styles.funnelValue}>{formatNumber(step.users)} users ({step.conversion}%)</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Cart Abandonment by Device" subtitle="Completion rates by device type">
          <DataTable data={cartAbandonmentByDevice}>
            <DataColumn id="device" label="Device">
              {(row: any) => row.device}
            </DataColumn>
            <DataColumn id="abandoned" label="Abandoned">
              {(row: any) => formatNumber(row.abandoned)}
            </DataColumn>
            <DataColumn id="completed" label="Completed">
              {(row: any) => formatNumber(row.completed)}
            </DataColumn>
            <DataColumn id="rate" label="Abandon %">
              {(row: any) => `${row.rate}%`}
            </DataColumn>
          </DataTable>
        </Panel>
      </Column>

      <Column size="full">
        <Panel title="Revenue by Marketing Source" subtitle="Performance by traffic source">
          <DataTable data={revenueBySource}>
            <DataColumn id="source" label="Traffic Source">
              {(row: any) => row.source}
            </DataColumn>
            <DataColumn id="revenue" label="Revenue">
              {(row: any) => `$${formatNumber(row.revenue)}`}
            </DataColumn>
            <DataColumn id="contribution" label="Contribution %">
              {(row: any) => `${row.contribution}%`}
            </DataColumn>
          </DataTable>
        </Panel>
      </Column>
    </PageBody>
  );
}
