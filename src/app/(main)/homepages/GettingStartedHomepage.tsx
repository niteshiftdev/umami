'use client';
import { Column, Row, Button, Icon } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { useMessages } from '@/components/hooks';
import styles from './Homepages.module.css';

/**
 * GETTING-STARTED HOMEPAGE
 *
 * Targets: New users, first-time setup, onboarding
 * Focus: Step-by-step guidance, education, feature discovery
 *
 * User Journey:
 * 1. Understand what Umami does
 * 2. Add first website
 * 3. Install tracking code
 * 4. View first data and learn features
 */
export function GettingStartedHomepage(): any {
  const { formatMessage, labels } = useMessages();

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Welcome to Umami Analytics" />

        {/* Hero section with quick wins */}
        <Panel>
          <Column gap="6" alignItems="center" textAlign="center">
            <Column gap="2">
              <h2>Privacy-First Analytics in 3 Steps</h2>
              <p>Get started tracking your website without compromising privacy</p>
            </Column>
            <Button size="lg">
              <Icon name="plus" /> Add Your First Website
            </Button>
          </Column>
        </Panel>

        {/* Onboarding steps */}
        <Panel>
          <Column gap="6">
            <h3>Getting Started</h3>
            <div className={styles.stepsContainer}>
              {/* Step 1 */}
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <Column gap="3">
                  <h4>Add Your Website</h4>
                  <p className={styles.stepDescription}>
                    Create a new website entry in Umami to start tracking analytics for any domain.
                  </p>
                  <div className={styles.stepContent}>
                    <input
                      type="text"
                      placeholder="example.com"
                      className={styles.stepInput}
                    />
                    <Button>Get Started</Button>
                  </div>
                </Column>
              </div>

              {/* Step 2 */}
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <Column gap="3">
                  <h4>Install Tracking Code</h4>
                  <p className={styles.stepDescription}>
                    Copy a single line of JavaScript code and add it to your website's header.
                  </p>
                  <div className={styles.stepContent}>
                    <div className={styles.codeBlock}>
                      <code>&lt;script async src="https://umami.yourdomain.com/script.js"</code>
                      <code>data-website-id="[YOUR-ID]"&gt;&lt;/script&gt;</code>
                    </div>
                    <Row gap="2">
                      <Button variant="tertiary">Copy Code</Button>
                      <Button variant="tertiary">View Instructions</Button>
                    </Row>
                  </div>
                </Column>
              </div>

              {/* Step 3 */}
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <Column gap="3">
                  <h4>Start Analyzing</h4>
                  <p className={styles.stepDescription}>
                    Once visitors arrive, your analytics dashboard will populate automatically.
                  </p>
                  <div className={styles.stepContent}>
                    <div className={styles.previewBox}>
                      <p className={styles.previewText}>Dashboard will show:</p>
                      <ul className={styles.previewList}>
                        <li>Real-time visitor count</li>
                        <li>Page views and bounce rate</li>
                        <li>Geographic data</li>
                        <li>Traffic sources</li>
                      </ul>
                    </div>
                  </div>
                </Column>
              </div>
            </div>
          </Column>
        </Panel>

        {/* Feature highlights */}
        <Panel>
          <Column gap="4">
            <h3>What You Can Track</h3>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>📊</div>
                <strong>Page Views & Visitors</strong>
                <p>See who visits your site and which pages they view</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🌍</div>
                <strong>Geographic Data</strong>
                <p>Understand your audience by location and language</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>💻</div>
                <strong>Device & Browser Data</strong>
                <p>Optimize for your users' devices and browsers</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🔗</div>
                <strong>Traffic Sources</strong>
                <p>Track where your visitors come from</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>✨</div>
                <strong>Custom Events</strong>
                <p>Track button clicks, form submissions, and custom actions</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🔒</div>
                <strong>Privacy-First</strong>
                <p>No cookies, no IP tracking, no third-party sharing</p>
              </div>
            </div>
          </Column>
        </Panel>

        {/* Common questions */}
        <Panel>
          <Column gap="4">
            <h3>Frequently Asked Questions</h3>
            <div className={styles.faqList}>
              <details className={styles.faqItem}>
                <summary>How long before I see data?</summary>
                <p>
                  You'll see real-time data immediately after adding the tracking code to your
                  website. Most data appears within 5-10 minutes of visitors arriving.
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary>Is my data private?</summary>
                <p>
                  Yes! Umami is completely privacy-focused. We don't use cookies, track IPs, or
                  share data with third parties. Your data remains completely under your control.
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary>Can I track multiple websites?</summary>
                <p>
                  Absolutely! Add as many websites as you need. Each has its own tracking code and
                  separate analytics dashboard.
                </p>
              </details>
              <details className={styles.faqItem}>
                <summary>How do I track custom events?</summary>
                <p>
                  Use the JavaScript event API to track custom user actions like button clicks, form
                  submissions, or purchases. See our documentation for code examples.
                </p>
              </details>
            </div>
          </Column>
        </Panel>

        {/* Next steps CTA */}
        <Panel>
          <Row gap="4" alignItems="center" justifyContent="center">
            <Column gap="3" alignItems="center" textAlign="center">
              <h3>Ready to get started?</h3>
              <p>Add your first website and start tracking analytics right now.</p>
              <Row gap="2">
                <Button size="lg">
                  <Icon name="plus" /> Add Website
                </Button>
                <Button size="lg" variant="secondary">
                  <Icon name="book-open" /> View Documentation
                </Button>
              </Row>
            </Column>
          </Row>
        </Panel>
      </Column>
    </PageBody>
  );
}
