'use client';
import { Column, Row, Grid, Button, Icon, Banner } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { useMessages } from '@/components/hooks';
import styles from './Homepages.module.css';

/**
 * PRIVACY-FOCUSED HOMEPAGE
 *
 * Targets: Privacy-conscious users, GDPR/CCPA compliant teams, consultants
 * Focus: Privacy features, compliance verification, data sovereignty
 *
 * User Journey:
 * 1. Verify privacy and compliance status of deployed tracking
 * 2. View data retention and deletion policies
 * 3. Manage privacy settings and user consent
 * 4. Audit tracking compliance
 */
export function PrivacyFocusedHomepage({ websites }: any) {
  const { formatMessage, labels } = useMessages();

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title={formatMessage(labels.websites)} />

        {/* Privacy compliance status banner */}
        <Banner variant="success" title="Privacy Compliant">
          All tracking is GDPR, CCPA, and PECR compliant. No third-party data sharing.
          <Button size="sm" variant="secondary">
            View Compliance Report
          </Button>
        </Banner>

        {/* Privacy features grid */}
        <Grid gap="4">
          <Panel>
            <Column gap="4">
              <h3>Privacy & Compliance</h3>
              <div className={styles.privacyFeatures}>
                <div className={styles.privacyFeature}>
                  <div className={styles.privacyIcon}>🛡️</div>
                  <div>
                    <strong>GDPR Compliant</strong>
                    <p>Full data subject rights support and consent management</p>
                  </div>
                </div>
                <div className={styles.privacyFeature}>
                  <div className={styles.privacyIcon}>🔐</div>
                  <div>
                    <strong>No IP Tracking</strong>
                    <p>Visitor IPs are hashed and automatically deleted</p>
                  </div>
                </div>
                <div className={styles.privacyFeature}>
                  <div className={styles.privacyIcon}>⚙️</div>
                  <div>
                    <strong>No Cookies Required</strong>
                    <p>Session tracking without persistent cookies</p>
                  </div>
                </div>
                <div className={styles.privacyFeature}>
                  <div className={styles.privacyIcon}>🏠</div>
                  <div>
                    <strong>Self-Hosted</strong>
                    <p>Complete data ownership and control</p>
                  </div>
                </div>
              </div>
            </Column>
          </Panel>

          <Panel>
            <Column gap="4">
              <h3>Data Management</h3>
              <Row gap="2" alignItems="center">
                <Column gap="2">
                  <div>
                    <div className={styles.dataMetric}>
                      <span className={styles.dataValue}>30</span>
                      <span className={styles.dataUnit}>days</span>
                    </div>
                    <p className={styles.dataLabel}>Data Retention Period</p>
                  </div>
                  <Button variant="secondary">Change Retention</Button>
                </Column>
                <Column gap="2">
                  <div>
                    <div className={styles.dataMetric}>
                      <span className={styles.dataValue}>0</span>
                      <span className={styles.dataUnit}>shared</span>
                    </div>
                    <p className={styles.dataLabel}>Third-Party Integrations</p>
                  </div>
                  <Button variant="secondary">View Policy</Button>
                </Column>
              </Row>
            </Column>
          </Panel>
        </Grid>

        {/* Sites with privacy status */}
        <Panel>
          <Column gap="4">
            <h3>Sites Privacy Status</h3>
            <div className={styles.tableContainer}>
              <table className={styles.privacyTable}>
                <thead>
                  <tr>
                    <th>Website</th>
                    <th>Compliance Status</th>
                    <th>Tracking Type</th>
                    <th>Last Audit</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>blog.example.com</strong></td>
                    <td>
                      <span className={styles.complianceBadge + ' ' + styles.compliant}>
                        ✓ Compliant
                      </span>
                    </td>
                    <td>Cookie-less</td>
                    <td>Nov 15, 2024</td>
                    <td>
                      <Row gap="1">
                        <Button size="sm" variant="tertiary">Privacy Settings</Button>
                        <Button size="sm" variant="tertiary">Audit Log</Button>
                      </Row>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>shop.example.com</strong></td>
                    <td>
                      <span className={styles.complianceBadge + ' ' + styles.compliant}>
                        ✓ Compliant
                      </span>
                    </td>
                    <td>Cookie-less</td>
                    <td>Nov 10, 2024</td>
                    <td>
                      <Row gap="1">
                        <Button size="sm" variant="tertiary">Privacy Settings</Button>
                        <Button size="sm" variant="tertiary">Audit Log</Button>
                      </Row>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Column>
        </Panel>

        {/* Privacy settings and resources */}
        <Grid gap="4">
          <Panel>
            <Column gap="3">
              <h3>Settings & Configuration</h3>
              <div className={styles.settingsList}>
                <div className={styles.settingItem}>
                  <Row gap="2" alignItems="center" justifyContent="space-between">
                    <Column gap="1">
                      <strong>Data Retention Policy</strong>
                      <small>Automatic deletion schedule</small>
                    </Column>
                    <Button size="sm" variant="tertiary">Configure</Button>
                  </Row>
                </div>
                <div className={styles.divider} />
                <div className={styles.settingItem}>
                  <Row gap="2" alignItems="center" justifyContent="space-between">
                    <Column gap="1">
                      <strong>User Consent Management</strong>
                      <small>GDPR consent preferences</small>
                    </Column>
                    <Button size="sm" variant="tertiary">Manage</Button>
                  </Row>
                </div>
                <div className={styles.divider} />
                <div className={styles.settingItem}>
                  <Row gap="2" alignItems="center" justifyContent="space-between">
                    <Column gap="1">
                      <strong>Data Export Requests</strong>
                      <small>Subject access requests</small>
                    </Column>
                    <Button size="sm" variant="tertiary">View</Button>
                  </Row>
                </div>
              </div>
            </Column>
          </Panel>

          <Panel>
            <Column gap="3">
              <h3>Resources</h3>
              <div className={styles.resourceList}>
                <a href="#" className={styles.resourceItem}>
                  <Icon name="file-text" />
                  <Column gap="1">
                    <strong>Privacy Policy Template</strong>
                    <small>Customizable for your site</small>
                  </Column>
                </a>
                <a href="#" className={styles.resourceItem}>
                  <Icon name="book" />
                  <Column gap="1">
                    <strong>GDPR Compliance Guide</strong>
                    <small>Step-by-step checklist</small>
                  </Column>
                </a>
                <a href="#" className={styles.resourceItem}>
                  <Icon name="help-circle" />
                  <Column gap="1">
                    <strong>Support & Documentation</strong>
                    <small>Chat with privacy experts</small>
                  </Column>
                </a>
              </div>
            </Column>
          </Panel>
        </Grid>
      </Column>
    </PageBody>
  );
}
