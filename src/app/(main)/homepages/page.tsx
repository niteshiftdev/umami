'use client';
import { useState } from 'react';
import { Column, Row, Button, Tabs, TabList, Tab, TabPanel } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { AnalyticsFirstHomepage } from './AnalyticsFirstHomepage';
import { PrivacyFocusedHomepage } from './PrivacyFocusedHomepage';
import { GettingStartedHomepage } from './GettingStartedHomepage';
import { TeamEnterpriseHomepage } from './TeamEnterpriseHomepage';
import styles from './Homepages.module.css';

/**
 * HOMEPAGE VARIATIONS SHOWCASE
 *
 * This page demonstrates four different homepage layouts, each optimized
 * for different user journeys and personas.
 *
 * The variations focus on:
 * 1. Analytics-First: For active users who dive deep into data
 * 2. Privacy-Focused: For compliance-conscious users
 * 3. Getting-Started: For new users during onboarding
 * 4. Team/Enterprise: For teams managing multiple sites and members
 */
export default function HomepagesShowcase() {
  const [activeTab, setActiveTab] = useState('analytics');

  const mockWebsites = [
    {
      id: '1',
      name: 'blog.example.com',
      visitors: 48250,
      pageViews: 156840,
      bounceRate: 24.3,
    },
    {
      id: '2',
      name: 'shop.example.com',
      visitors: 35680,
      pageViews: 124320,
      bounceRate: 18.7,
    },
  ];

  const mockTeam = {
    name: 'My Team',
    id: '1',
  };

  const mockMembers = [
    { id: '1', name: 'Conor Branagan', role: 'Owner' },
    { id: '2', name: 'Sarah Chen', role: 'Editor' },
  ];

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Homepage Variations">
          <Button>View Implementation Guide</Button>
        </PageHeader>

        {/* Information Panel */}
        <Panel>
          <Column gap="4">
            <h3>Homepage Variations for Different User Journeys</h3>
            <p>
              These variations demonstrate how Umami's homepage can be tailored to different user
              types and their primary goals. Each variation prioritizes different features and
              workflows.
            </p>
            <div style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
              <strong>How to use these variations:</strong>
              <ul style={{ marginTop: '0.5rem' }}>
                <li>
                  <strong>Feature Flags:</strong> Use the variations as feature flags to A/B test
                  which layout drives more engagement
                </li>
                <li>
                  <strong>Dynamic Routing:</strong> Show different homepages based on user
                  preferences or account type
                </li>
                <li>
                  <strong>User Segmentation:</strong> Route new users to Getting-Started, active
                  analysts to Analytics-First, etc.
                </li>
                <li>
                  <strong>Onboarding:</strong> Start new users with Getting-Started, then transition
                  to their preferred variation
                </li>
              </ul>
            </div>
          </Column>
        </Panel>

        {/* Variations Tabs */}
        <Tabs activeKey={activeTab} onActiveKeyChange={setActiveTab}>
          <TabList>
            <Tab eventKey="analytics">Analytics-First</Tab>
            <Tab eventKey="privacy">Privacy-Focused</Tab>
            <Tab eventKey="getting-started">Getting Started</Tab>
            <Tab eventKey="team">Team/Enterprise</Tab>
          </TabList>

          <TabPanel eventKey="analytics">
            <Panel>
              <Column gap="4">
                <div>
                  <h4>Analytics-First Homepage</h4>
                  <p style={{ margin: '0.5rem 0 0', color: '#666' }}>
                    Target: Active data analysts, product managers, marketers
                  </p>
                  <p style={{ margin: '0.5rem 0 0', color: '#666' }}>
                    Focus: Quick access to key metrics, advanced reports, and analysis tools
                  </p>
                </div>
                <AnalyticsFirstHomepage websites={mockWebsites} recentReports={[]} />
              </Column>
            </Panel>
          </TabPanel>

          <TabPanel eventKey="privacy">
            <Panel>
              <Column gap="4">
                <div>
                  <h4>Privacy-Focused Homepage</h4>
                  <p style={{ margin: '0.5rem 0 0', color: '#666' }}>
                    Target: Privacy-conscious users, GDPR/CCPA compliance teams
                  </p>
                  <p style={{ margin: '0.5rem 0 0', color: '#666' }}>
                    Focus: Privacy features, compliance verification, data management
                  </p>
                </div>
                <PrivacyFocusedHomepage websites={mockWebsites} />
              </Column>
            </Panel>
          </TabPanel>

          <TabPanel eventKey="getting-started">
            <Panel>
              <Column gap="4">
                <div>
                  <h4>Getting-Started Homepage</h4>
                  <p style={{ margin: '0.5rem 0 0', color: '#666' }}>
                    Target: New users, first-time setup, onboarding
                  </p>
                  <p style={{ margin: '0.5rem 0 0', color: '#666' }}>
                    Focus: Step-by-step guidance, education, feature discovery
                  </p>
                </div>
                <GettingStartedHomepage />
              </Column>
            </Panel>
          </TabPanel>

          <TabPanel eventKey="team">
            <Panel>
              <Column gap="4">
                <div>
                  <h4>Team/Enterprise Homepage</h4>
                  <p style={{ margin: '0.5rem 0 0', color: '#666' }}>
                    Target: Teams, agencies, enterprises
                  </p>
                  <p style={{ margin: '0.5rem 0 0', color: '#666' }}>
                    Focus: Multi-site management, team collaboration, permissions, organization
                  </p>
                </div>
                <TeamEnterpriseHomepage
                  websites={mockWebsites}
                  team={mockTeam}
                  members={mockMembers}
                />
              </Column>
            </Panel>
          </TabPanel>
        </Tabs>

        {/* Implementation Notes */}
        <Panel>
          <Column gap="4">
            <h3>Implementation Notes</h3>
            <Column gap="2">
              <div>
                <strong>Component Structure:</strong>
                <p style={{ margin: '0.5rem 0 0' }}>
                  All variations use existing Umami components (Column, Row, Grid, Button, etc.)
                  from @umami/react-zen to maintain design consistency.
                </p>
              </div>
              <div>
                <strong>Data Integration:</strong>
                <p style={{ margin: '0.5rem 0 0' }}>
                  Replace mock data with real data from React Query hooks:
                  useWebsitesQuery(), useWebsiteMetricsQuery(), useTeamsQuery(), etc.
                </p>
              </div>
              <div>
                <strong>Routing Strategy:</strong>
                <p style={{ margin: '0.5rem 0 0' }}>
                  Modify src/app/page.tsx (currently redirects to /websites) to:
                  <ul style={{ margin: '0.5rem 0' }}>
                    <li>Check user.preferredHomepage or account.type</li>
                    <li>Check if user is new (no websites created yet)</li>
                    <li>Redirect to appropriate variation or dashboard</li>
                  </ul>
                </p>
              </div>
              <div>
                <strong>Feature Flags:</strong>
                <p style={{ margin: '0.5rem 0 0' }}>
                  Use Zustand store (src/store/app.ts) to manage which variation is active:
                  <br />
                  <code style={{ fontSize: '0.9rem', color: '#147af3' }}>
                    userPreferences.homepageVariation = 'analytics' | 'privacy' | 'getting-started'
                    | 'team'
                  </code>
                </p>
              </div>
            </Column>
          </Column>
        </Panel>

        {/* Key Differences Summary */}
        <Panel>
          <Column gap="4">
            <h3>Key Differences Summary</h3>
            <div className={styles.tableContainer}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead style={{ background: '#f5f5f5', borderBottom: '2px solid #eeeeee' }}>
                  <tr>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>
                      Variation
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>
                      Primary Focus
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>
                      Key Components
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>
                      CTA Priority
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>Analytics-First</td>
                    <td style={{ padding: '1rem' }}>Metrics & Reports</td>
                    <td style={{ padding: '1rem' }}>Quick Stats, Top Sites Table, Recent Reports</td>
                    <td style={{ padding: '1rem' }}>Create Dashboard, Build Segment</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>Privacy-Focused</td>
                    <td style={{ padding: '1rem' }}>Compliance & Data Control</td>
                    <td style={{ padding: '1rem' }}>Privacy Features, Compliance Status, Settings</td>
                    <td style={{ padding: '1rem' }}>Privacy Settings, Audit Log</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>Getting-Started</td>
                    <td style={{ padding: '1rem' }}>Education & Onboarding</td>
                    <td style={{ padding: '1rem' }}>Step-by-Step Guide, Feature Highlights, FAQ</td>
                    <td style={{ padding: '1rem' }}>Add Website, View Documentation</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>Team/Enterprise</td>
                    <td style={{ padding: '1rem' }}>Collaboration & Management</td>
                    <td style={{ padding: '1rem' }}>Team Members, All Websites, Activity Feed</td>
                    <td style={{ padding: '1rem' }}>Invite Member, Manage Team</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Column>
        </Panel>

        {/* Next Steps */}
        <Panel>
          <Column gap="3">
            <h3>Next Steps for Implementation</h3>
            <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>
                <strong>A/B Test:</strong> Deploy as a feature flag to test which variation
                increases feature usage and engagement
              </li>
              <li>
                <strong>User Research:</strong> Gather feedback from different user segments to
                validate the variations
              </li>
              <li>
                <strong>Data Integration:</strong> Connect real data from React Query hooks and
                remove mock data
              </li>
              <li>
                <strong>Routing Logic:</strong> Implement decision logic in src/app/page.tsx to
                route to appropriate variation
              </li>
              <li>
                <strong>Refinement:</strong> Iterate based on analytics and user feedback
              </li>
            </ol>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
