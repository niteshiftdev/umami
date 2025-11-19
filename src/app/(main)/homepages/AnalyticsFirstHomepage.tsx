'use client';
import { Column, Row, Grid, GridRow, Button, Icon } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { useMessages } from '@/components/hooks';
import styles from './Homepages.module.css';

/**
 * ANALYTICS-FIRST HOMEPAGE
 *
 * Targets: Active data analysts, product managers, marketers
 * Focus: Quick access to key metrics and advanced reports
 *
 * User Journey:
 * 1. See top-performing websites at a glance
 * 2. Quick jump to analytics for each site
 * 3. Access advanced reports and segmentation
 * 4. Create custom dashboards
 */
export function AnalyticsFirstHomepage({ websites, recentReports }: any) {
  const { formatMessage, labels } = useMessages();

  return (
    <PageBody>
      <Column gap="6" margin="2">
        {/* Header with quick actions */}
        <PageHeader title={formatMessage(labels.websites)}>
          <Row gap="2">
            <Button>
              <Icon name="plus" /> {formatMessage(labels.add_website)}
            </Button>
            <Button variant="secondary">
              <Icon name="layers" /> {formatMessage(labels.create_dashboard)}
            </Button>
          </Row>
        </PageHeader>

        {/* Quick stats summary */}
        <Panel>
          <Column gap="4">
            <h3>Quick Overview</h3>
            <GridRow layout="four">
              <div className={styles.statCard}>
                <div className={styles.statValue}>1.2M</div>
                <div className={styles.statLabel}>Total Visitors (7d)</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>245k</div>
                <div className={styles.statLabel}>Page Views (7d)</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>3.2%</div>
                <div className={styles.statLabel}>Avg Bounce Rate</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>2m 14s</div>
                <div className={styles.statLabel}>Avg Session Duration</div>
              </div>
            </GridRow>
          </Column>
        </Panel>

        {/* Top performing websites - detailed view */}
        <Panel>
          <Column gap="4">
            <Row gap="2" alignItems="center">
              <h3>Top Performing Sites</h3>
              <Button size="sm" variant="secondary">
                {formatMessage(labels.view_all)}
              </Button>
            </Row>
            <div className={styles.tableContainer}>
              <table className={styles.analyticsTable}>
                <thead>
                  <tr>
                    <th>Website</th>
                    <th>Visitors (7d)</th>
                    <th>Page Views</th>
                    <th>Bounce Rate</th>
                    <th>Avg Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>blog.example.com</strong></td>
                    <td>48,250</td>
                    <td>156,840</td>
                    <td>24.3%</td>
                    <td>3m 42s</td>
                    <td>
                      <Row gap="1">
                        <Button size="sm" variant="tertiary">Analytics</Button>
                        <Button size="sm" variant="tertiary">Funnels</Button>
                      </Row>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>shop.example.com</strong></td>
                    <td>35,680</td>
                    <td>124,320</td>
                    <td>18.7%</td>
                    <td>5m 18s</td>
                    <td>
                      <Row gap="1">
                        <Button size="sm" variant="tertiary">Analytics</Button>
                        <Button size="sm" variant="tertiary">Revenue</Button>
                      </Row>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>docs.example.com</strong></td>
                    <td>28,420</td>
                    <td>92,150</td>
                    <td>31.2%</td>
                    <td>2m 51s</td>
                    <td>
                      <Row gap="1">
                        <Button size="sm" variant="tertiary">Analytics</Button>
                        <Button size="sm" variant="tertiary">Breakdown</Button>
                      </Row>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Column>
        </Panel>

        {/* Recent reports and insights */}
        <Grid gap="4">
          <Panel>
            <Column gap="3">
              <h3>Recent Reports</h3>
              <div className={styles.reportList}>
                <div className={styles.reportItem}>
                  <div>
                    <strong>Checkout Funnel Optimization</strong>
                    <p className={styles.reportMeta}>shop.example.com • Updated 2 days ago</p>
                  </div>
                  <Button size="sm" variant="tertiary">
                    <Icon name="arrow-right" />
                  </Button>
                </div>
                <div className={styles.reportItem}>
                  <div>
                    <strong>Q4 Traffic Sources Attribution</strong>
                    <p className={styles.reportMeta}>blog.example.com • Updated 1 week ago</p>
                  </div>
                  <Button size="sm" variant="tertiary">
                    <Icon name="arrow-right" />
                  </Button>
                </div>
                <div className={styles.reportItem}>
                  <div>
                    <strong>User Retention Cohort Analysis</strong>
                    <p className={styles.reportMeta}>docs.example.com • Updated 3 days ago</p>
                  </div>
                  <Button size="sm" variant="tertiary">
                    <Icon name="arrow-right" />
                  </Button>
                </div>
              </div>
            </Column>
          </Panel>

          <Panel>
            <Column gap="3">
              <h3>Quick Actions</h3>
              <div className={styles.actionGrid}>
                <Button variant="secondary" size="lg">
                  <Icon name="trending-up" />
                  <Column gap="1">
                    <div>Create Funnel</div>
                    <small>Track conversion steps</small>
                  </Column>
                </Button>
                <Button variant="secondary" size="lg">
                  <Icon name="filter" />
                  <Column gap="1">
                    <div>Build Segment</div>
                    <small>Define user groups</small>
                  </Column>
                </Button>
                <Button variant="secondary" size="lg">
                  <Icon name="bar-chart-2" />
                  <Column gap="1">
                    <div>Custom Report</div>
                    <small>Analyze any metric</small>
                  </Column>
                </Button>
                <Button variant="secondary" size="lg">
                  <Icon name="share-2" />
                  <Column gap="1">
                    <div>Share Report</div>
                    <small>Export or invite users</small>
                  </Column>
                </Button>
              </div>
            </Column>
          </Panel>
        </Grid>
      </Column>
    </PageBody>
  );
}
