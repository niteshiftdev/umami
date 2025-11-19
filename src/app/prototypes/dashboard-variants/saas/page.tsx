'use client';

import { PageBody, Column, DataGrid } from '@umami/react-zen';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import { formatNumber } from '@/lib/format';
import styles from './page.module.css';

export default function SaaSDashboard() {
  // Mock data for SaaS product analytics
  const summaryMetrics = {
    activeUsers: 12450,
    activeUsersChange: 5.3,
    mau: 28900,
    mauChange: 3.8,
    retention: 72.4,
    retentionChange: 2.1,
    churn: 5.2,
    churnChange: -0.8,
  };

  const cohortRetention = [
    { cohort: 'Dec 2024', w0: 100, w1: 82, w2: 71, w3: 64, w4: 58, w5: 52, w6: 48 },
    { cohort: 'Jan 2025', w0: 100, w1: 85, w2: 74, w3: 68, w4: 61, w5: 55 },
    { cohort: 'Feb 2025', w0: 100, w1: 88, w2: 79, w3: 72, w4: 64 },
    { cohort: 'Mar 2025', w0: 100, w1: 86, w2: 77, w3: 70 },
    { cohort: 'Apr 2025', w0: 100, w1: 87, w2: 79 },
    { cohort: 'May 2025', w0: 100, w1: 84 },
    { cohort: 'Jun 2025', w0: 100 },
  ];

  const featureAdoption = [
    { feature: 'Dashboard', users: 12450, adoption: 100, dau: 10230 },
    { feature: 'API Integration', users: 8340, adoption: 67, dau: 5120 },
    { feature: 'Advanced Reports', users: 6720, adoption: 54, dau: 3890 },
    { feature: 'Custom Webhooks', users: 4120, adoption: 33, dau: 2340 },
    { feature: 'SSO/SAML', users: 2890, adoption: 23, dau: 1450 },
  ];

  const funnelOnboarding = [
    { step: 'Sign Up', users: 2340, conversion: 100 },
    { step: 'Email Verified', users: 2100, conversion: 89.8 },
    { step: 'First Site Added', users: 1680, conversion: 71.8 },
    { step: 'First Data Tracked', users: 1420, conversion: 60.7 },
    { step: 'Active User (Day 7)', users: 890, conversion: 38 },
  ];

  const segmentMetrics = [
    { segment: 'Enterprise', users: 245, retention: 94.2, engagement: 8.3, churn: 0.8 },
    { segment: 'Mid-Market', users: 1230, retention: 81.5, engagement: 6.7, churn: 3.2 },
    { segment: 'SMB', users: 8940, retention: 68.3, engagement: 4.2, churn: 7.4 },
    { segment: 'Freemium', users: 2035, retention: 42.1, engagement: 1.8, churn: 18.5 },
  ];

  return (
    <PageBody>
      <PageHeader title="SaaS Product Analytics Dashboard" subtitle="User engagement, retention, and growth metrics" />

      <Column size="two">
        <Panel title="Active Users (Daily)" subtitle="Users active today">
          <div className={styles.metricLarge}>
            <div className={styles.value}>{formatNumber(summaryMetrics.activeUsers)}</div>
            <div className={`${styles.change} ${summaryMetrics.activeUsersChange > 0 ? styles.positive : styles.negative}`}>
              {summaryMetrics.activeUsersChange > 0 ? '↑' : '↓'} {Math.abs(summaryMetrics.activeUsersChange)}% vs yesterday
            </div>
          </div>
        </Panel>

        <Panel title="Monthly Active Users" subtitle="Users active this month">
          <div className={styles.metricLarge}>
            <div className={styles.value}>{formatNumber(summaryMetrics.mau)}</div>
            <div className={`${styles.change} ${summaryMetrics.mauChange > 0 ? styles.positive : styles.negative}`}>
              {summaryMetrics.mauChange > 0 ? '↑' : '↓'} {Math.abs(summaryMetrics.mauChange)}% vs last month
            </div>
          </div>
        </Panel>

        <Panel title="Overall Retention" subtitle="Day 30 retention rate">
          <div className={styles.metricLarge}>
            <div className={styles.value}>{summaryMetrics.retention}%</div>
            <div className={`${styles.change} ${summaryMetrics.retentionChange > 0 ? styles.positive : styles.negative}`}>
              {summaryMetrics.retentionChange > 0 ? '↑' : '↓'} {Math.abs(summaryMetrics.retentionChange)}% vs last cohort
            </div>
          </div>
        </Panel>

        <Panel title="Monthly Churn Rate" subtitle="Users who cancelled">
          <div className={styles.metricLarge}>
            <div className={styles.value}>{summaryMetrics.churn}%</div>
            <div className={`${styles.change} ${summaryMetrics.churnChange < 0 ? styles.positive : styles.negative}`}>
              {summaryMetrics.churnChange < 0 ? '↓' : '↑'} {Math.abs(summaryMetrics.churnChange)}% vs last month
            </div>
          </div>
        </Panel>
      </Column>

      <Column size="full">
        <Panel title="Cohort Retention Analysis" subtitle="Weekly retention curves by signup cohort">
          <div className={styles.cohortTable}>
            <table>
              <thead>
                <tr>
                  <th>Cohort</th>
                  <th>Week 0</th>
                  <th>Week 1</th>
                  <th>Week 2</th>
                  <th>Week 3</th>
                  <th>Week 4</th>
                  <th>Week 5</th>
                  <th>Week 6</th>
                </tr>
              </thead>
              <tbody>
                {cohortRetention.map((row, idx) => (
                  <tr key={idx}>
                    <td className={styles.cohortLabel}>{row.cohort}</td>
                    {[row.w0, row.w1, row.w2, row.w3, row.w4, row.w5, row.w6].map((val, i) => (
                      <td key={i} className={styles.cohortCell} style={{ background: `rgba(52, 152, 219, ${val / 100})` }}>
                        {val}%
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </Column>

      <Column size="two">
        <Panel title="Feature Adoption" subtitle="Usage across core features">
          <DataGrid
            columns={[
              { key: 'feature', label: 'Feature', width: '30%' },
              { key: 'users', label: 'Users', render: (value) => formatNumber(value), width: '20%' },
              { key: 'adoption', label: 'Adoption %', render: (value) => `${value}%`, width: '25%' },
              { key: 'dau', label: 'Daily Active', render: (value) => formatNumber(value), width: '25%' },
            ]}
            data={featureAdoption}
          />
        </Panel>

        <Panel title="Onboarding Funnel" subtitle="User journey to activation">
          <div className={styles.onboardingFunnel}>
            {funnelOnboarding.map((step, index) => (
              <div key={index} className={styles.funnelStep}>
                <div className={styles.funnelLabel}>{step.step}</div>
                <div className={styles.funnelBar} style={{ width: `${step.conversion}%` }}>
                  <span className={styles.funnelValue}>
                    {formatNumber(step.users)} ({step.conversion.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </Column>

      <Column size="full">
        <Panel title="Metrics by Customer Segment" subtitle="Performance varies by user tier">
          <DataGrid
            columns={[
              { key: 'segment', label: 'Segment', width: '20%' },
              { key: 'users', label: 'User Count', render: (value) => formatNumber(value), width: '20%' },
              { key: 'retention', label: 'Retention %', render: (value) => `${value}%`, width: '20%' },
              { key: 'engagement', label: 'Avg Sessions/Day', render: (value) => value.toFixed(1), width: '20%' },
              { key: 'churn', label: 'Churn Rate %', render: (value) => `${value}%`, width: '20%' },
            ]}
            data={segmentMetrics}
          />
        </Panel>
      </Column>
    </PageBody>
  );
}
