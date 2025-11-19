'use client';
import { Column, Row, Grid, GridRow, Button, Icon, Badge } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { useMessages } from '@/components/hooks';
import styles from './Homepages.module.css';

/**
 * TEAM/ENTERPRISE HOMEPAGE
 *
 * Targets: Teams, agencies, enterprises
 * Focus: Multi-site management, team collaboration, permissions, org structure
 *
 * User Journey:
 * 1. See all team sites and activities at a glance
 * 2. Manage team members and permissions
 * 3. View shared reports and dashboards
 * 4. Access team settings and integrations
 */
export function TeamEnterpriseHomepage({ websites, team, members }: any) {
  const { formatMessage, labels } = useMessages();

  return (
    <PageBody>
      <Column gap="6" margin="2">
        {/* Header with team info */}
        <PageHeader title={`Team: ${team?.name || 'My Team'}`}>
          <Row gap="2">
            <Button>
              <Icon name="plus" /> {formatMessage(labels.add_website)}
            </Button>
            <Button variant="secondary">
              <Icon name="users" /> Manage Team
            </Button>
          </Row>
        </PageHeader>

        {/* Team overview stats */}
        <Grid gap="4">
          <Panel>
            <Column gap="4">
              <h3>Team Overview</h3>
              <GridRow layout="three">
                <div className={styles.statCard}>
                  <div className={styles.statValue}>12</div>
                  <div className={styles.statLabel}>Active Websites</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>5</div>
                  <div className={styles.statLabel}>Team Members</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>2.8M</div>
                  <div className={styles.statLabel}>Monthly Visitors</div>
                </div>
              </GridRow>
            </Column>
          </Panel>

          <Panel>
            <Column gap="4">
              <h3>Quick Actions</h3>
              <Column gap="2">
                <Button variant="secondary">
                  <Icon name="users-plus" /> Invite Team Member
                </Button>
                <Button variant="secondary">
                  <Icon name="share-2" /> Create Shared Dashboard
                </Button>
                <Button variant="secondary">
                  <Icon name="settings" /> Team Settings
                </Button>
              </Column>
            </Column>
          </Panel>
        </Grid>

        {/* Team members and permissions */}
        <Panel>
          <Column gap="4">
            <Row gap="2" alignItems="center">
              <h3>Team Members</h3>
              <Badge>5 members</Badge>
            </Row>
            <div className={styles.tableContainer}>
              <table className={styles.teamTable}>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Websites</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Row gap="2" alignItems="center">
                        <div className={styles.avatar}>C</div>
                        <strong>Conor Branagan</strong>
                      </Row>
                    </td>
                    <td>conor@example.com</td>
                    <td>
                      <Badge variant="primary">Owner</Badge>
                    </td>
                    <td>All 12</td>
                    <td>Now</td>
                    <td>
                      <Button size="sm" variant="tertiary">
                        <Icon name="more-horizontal" />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Row gap="2" alignItems="center">
                        <div className={styles.avatar}>S</div>
                        <strong>Sarah Chen</strong>
                      </Row>
                    </td>
                    <td>sarah@example.com</td>
                    <td>
                      <Badge variant="secondary">Editor</Badge>
                    </td>
                    <td>8</td>
                    <td>2 hours ago</td>
                    <td>
                      <Button size="sm" variant="tertiary">
                        <Icon name="more-horizontal" />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Row gap="2" alignItems="center">
                        <div className={styles.avatar}>M</div>
                        <strong>Marcus Rodriguez</strong>
                      </Row>
                    </td>
                    <td>marcus@example.com</td>
                    <td>
                      <Badge variant="secondary">Viewer</Badge>
                    </td>
                    <td>3</td>
                    <td>1 day ago</td>
                    <td>
                      <Button size="sm" variant="tertiary">
                        <Icon name="more-horizontal" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Column>
        </Panel>

        {/* Websites with team insights */}
        <Panel>
          <Column gap="4">
            <Row gap="2" alignItems="center">
              <h3>All Websites</h3>
              <Button size="sm" variant="secondary">{formatMessage(labels.view_all)}</Button>
            </Row>
            <div className={styles.tableContainer}>
              <table className={styles.websitesTable}>
                <thead>
                  <tr>
                    <th>Website</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Visitors (30d)</th>
                    <th>Members</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>blog.example.com</strong></td>
                    <td>Sarah Chen</td>
                    <td>
                      <span className={styles.statusBadge + ' ' + styles.active}>Active</span>
                    </td>
                    <td>542,150</td>
                    <td>
                      <Row gap="1">
                        <div className={styles.avatar} style={{ fontSize: '10px' }}>C</div>
                        <div className={styles.avatar} style={{ fontSize: '10px' }}>S</div>
                        <div className={styles.avatar} style={{ fontSize: '10px' }}>+2</div>
                      </Row>
                    </td>
                    <td>Oct 2023</td>
                  </tr>
                  <tr>
                    <td><strong>shop.example.com</strong></td>
                    <td>Conor Branagan</td>
                    <td>
                      <span className={styles.statusBadge + ' ' + styles.active}>Active</span>
                    </td>
                    <td>1,280,430</td>
                    <td>
                      <Row gap="1">
                        <div className={styles.avatar} style={{ fontSize: '10px' }}>C</div>
                        <div className={styles.avatar} style={{ fontSize: '10px' }}>S</div>
                        <div className={styles.avatar} style={{ fontSize: '10px' }}>M</div>
                      </Row>
                    </td>
                    <td>Jun 2023</td>
                  </tr>
                  <tr>
                    <td><strong>docs.example.com</strong></td>
                    <td>Marcus Rodriguez</td>
                    <td>
                      <span className={styles.statusBadge + ' ' + styles.active}>Active</span>
                    </td>
                    <td>380,920</td>
                    <td>
                      <Row gap="1">
                        <div className={styles.avatar} style={{ fontSize: '10px' }}>C</div>
                      </Row>
                    </td>
                    <td>Aug 2023</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Column>
        </Panel>

        {/* Shared dashboards and reports */}
        <Grid gap="4">
          <Panel>
            <Column gap="3">
              <Row gap="2" alignItems="center">
                <h3>Shared Dashboards</h3>
                <Button size="sm" variant="tertiary">
                  <Icon name="plus" />
                </Button>
              </Row>
              <div className={styles.cardList}>
                <div className={styles.dashboardCard}>
                  <Row gap="2" alignItems="center" justifyContent="space-between">
                    <Column gap="1">
                      <strong>Q4 Performance Tracker</strong>
                      <p className={styles.cardMeta}>
                        Shared by Sarah Chen • Updated today
                      </p>
                    </Column>
                    <Button size="sm" variant="tertiary">
                      <Icon name="arrow-right" />
                    </Button>
                  </Row>
                </div>
                <div className={styles.dashboardCard}>
                  <Row gap="2" alignItems="center" justifyContent="space-between">
                    <Column gap="1">
                      <strong>Team Traffic Overview</strong>
                      <p className={styles.cardMeta}>
                        Shared by Conor Branagan • Updated 2 days ago
                      </p>
                    </Column>
                    <Button size="sm" variant="tertiary">
                      <Icon name="arrow-right" />
                    </Button>
                  </Row>
                </div>
              </div>
            </Column>
          </Panel>

          <Panel>
            <Column gap="3">
              <Row gap="2" alignItems="center">
                <h3>Team Settings</h3>
                <Button size="sm" variant="tertiary">
                  <Icon name="settings" />
                </Button>
              </Row>
              <div className={styles.settingsList}>
                <div className={styles.settingItem}>
                  <Column gap="1">
                    <strong>Data Retention</strong>
                    <small>90 days • Set by Owner</small>
                  </Column>
                </div>
                <div className={styles.divider} />
                <div className={styles.settingItem}>
                  <Column gap="1">
                    <strong>GDPR / Privacy Settings</strong>
                    <small>Configured • All compliant</small>
                  </Column>
                </div>
                <div className={styles.divider} />
                <div className={styles.settingItem}>
                  <Column gap="1">
                    <strong>Integrations</strong>
                    <small>Slack, Webhooks enabled</small>
                  </Column>
                </div>
              </div>
            </Column>
          </Panel>
        </Grid>

        {/* Team activity feed */}
        <Panel>
          <Column gap="4">
            <h3>Recent Team Activity</h3>
            <div className={styles.activityFeed}>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>👤</div>
                <div>
                  <strong>Marcus Rodriguez</strong> joined the team
                  <p className={styles.activityTime}>2 days ago</p>
                </div>
              </div>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>📊</div>
                <div>
                  <strong>New website added:</strong> api.example.com
                  <p className={styles.activityTime}>1 week ago</p>
                </div>
              </div>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>🔑</div>
                <div>
                  <strong>Sarah Chen</strong> role changed to Editor
                  <p className={styles.activityTime}>2 weeks ago</p>
                </div>
              </div>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>🎯</div>
                <div>
                  <strong>Team dashboard created:</strong> Q4 Performance Tracker
                  <p className={styles.activityTime}>1 month ago</p>
                </div>
              </div>
            </div>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
