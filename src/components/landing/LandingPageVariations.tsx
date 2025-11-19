'use client';

import { ReactNode } from 'react';
import { Column, Row } from '@umami/react-zen';

export type UserPersona = 'startup_founder' | 'marketing_manager' | 'developer' | 'enterprise_admin';

interface PersonaConfig {
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: string;
  features: string[];
  useCaseExample: string;
  calloutHighlight: string;
}

const personaConfigs: Record<UserPersona, PersonaConfig> = {
  startup_founder: {
    title: 'Analytics That Grow With Your Startup',
    subtitle: 'Track what matters. Make data-driven decisions from day one.',
    description:
      'Launch fast with privacy-first analytics. No complex setup. See real user behavior instantly.',
    primaryCTA: 'Start Free Trial',
    features: [
      'Real-time visitor insights',
      'Zero configuration needed',
      'GDPR compliant by default',
      'Unlimited events & custom data',
    ],
    useCaseExample: 'New SaaS founders measure product-market fit in days, not months.',
    calloutHighlight: 'Free forever plan for startups. Scale without limits.',
  },
  marketing_manager: {
    title: 'Campaign Performance at a Glance',
    subtitle: 'Understand your audience. Optimize every campaign.',
    description:
      'See which campaigns drive real engagement. Track conversions across channels. Get actionable insights without data overwhelm.',
    primaryCTA: 'Explore Features',
    features: [
      'UTM campaign tracking',
      'Funnel analysis',
      'Audience segmentation',
      'Custom event tracking',
    ],
    useCaseExample: 'Marketing teams reduce CPA by 40% using advanced filtering and cohort analysis.',
    calloutHighlight: 'Privacy-first means higher data collection rates than competitors.',
  },
  developer: {
    title: 'Analytics API Built for Developers',
    subtitle: 'Flexible. Powerful. Built with code in mind.',
    description:
      'Integrate anywhere. Track anything. Query your data with a clean REST API. Self-hosted or cloud, you choose.',
    primaryCTA: 'View API Docs',
    features: [
      'Open source & self-hostable',
      'REST API & webhooks',
      'Custom event schemas',
      'Zero tracking bloat',
    ],
    useCaseExample: 'Developers track 10B+ events monthly with minimal infrastructure overhead.',
    calloutHighlight: 'Lightweight. Fast. No JavaScript bloat on your pages.',
  },
  enterprise_admin: {
    title: 'Enterprise Analytics Infrastructure',
    subtitle: 'Scale with confidence. Security and compliance built-in.',
    description:
      'Multi-team collaboration. Single sign-on. Advanced permissions. Audit trails for every action.',
    primaryCTA: 'Request Demo',
    features: [
      'Team-based access control',
      'SOC 2 compliance',
      'Data residency options',
      'Dedicated support',
    ],
    useCaseExample:
      'Enterprise teams manage analytics for 100+ properties with granular permissions and audit logging.',
    calloutHighlight: 'Your data, your servers. Complete control and compliance.',
  },
};

interface LandingPageVariationProps {
  persona: UserPersona;
  metrics?: {
    visitors: number;
    visits: number;
    pageviews: number;
    bounceRate: number;
    visitDuration: number;
  };
}

export function LandingPageVariation({ persona, metrics }: LandingPageVariationProps) {
  const config = personaConfigs[persona];

  return (
    <Column gap="xl" style={{ padding: '2rem' }}>
      {/* Hero Section */}
      <div
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          background: getPersonaGradient(persona),
          borderRadius: '12px',
          color: 'white',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          {config.title}
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.95 }}>
          {config.subtitle}
        </p>
        <p style={{ fontSize: '1rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          {config.description}
        </p>
        <button
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            background: 'white',
            color: getPersonaColor(persona),
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {config.primaryCTA}
        </button>
      </div>

      {/* Key Features */}
      <div>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Why {getPersonaLabel(persona)}</h2>
        <Row gap="lg">
          {config.features.map(feature => (
            <div
              key={feature}
              style={{
                flex: 1,
                padding: '1.5rem',
                background: '#f5f5f5',
                borderRadius: '8px',
                border: `2px solid ${getPersonaColor(persona)}20`,
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  background: getPersonaColor(persona),
                  borderRadius: '50%',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                ✓
              </div>
              <p>{feature}</p>
            </div>
          ))}
        </Row>
      </div>

      {/* Use Case Example */}
      <div
        style={{
          padding: '2rem',
          background: getPersonaColor(persona),
          color: 'white',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
          Real Results:
        </h3>
        <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>{config.useCaseExample}</p>
        <p style={{ fontSize: '0.95rem', opacity: 0.9, fontStyle: 'italic' }}>
          💡 {config.calloutHighlight}
        </p>
      </div>

      {/* Metrics Showcase */}
      {metrics && (
        <div>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Your Analytics Dashboard</h2>
          <Row gap="lg">
            <MetricCard label="Visitors" value={metrics.visitors} />
            <MetricCard label="Visits" value={metrics.visits} />
            <MetricCard label="Pageviews" value={metrics.pageviews} />
            <MetricCard label="Bounce Rate" value={`${Math.round(metrics.bounceRate)}%`} />
            <MetricCard label="Avg Duration" value={`${Math.round(metrics.visitDuration)}s`} />
          </Row>
        </div>
      )}
    </Column>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div
      style={{
        flex: 1,
        padding: '1.5rem',
        background: '#f5f5f5',
        borderRadius: '8px',
        textAlign: 'center',
        border: '1px solid #e0e0e0',
      }}
    >
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{label}</p>
      <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#333' }}>{value}</p>
    </div>
  );
}

function getPersonaColor(persona: UserPersona): string {
  const colors: Record<UserPersona, string> = {
    startup_founder: '#3B82F6', // Blue
    marketing_manager: '#EC4899', // Pink
    developer: '#10B981', // Green
    enterprise_admin: '#8B5CF6', // Purple
  };
  return colors[persona];
}

function getPersonaGradient(persona: UserPersona): string {
  const color = getPersonaColor(persona);
  return `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`;
}

function getPersonaLabel(persona: UserPersona): string {
  const labels: Record<UserPersona, string> = {
    startup_founder: 'Startup Founders',
    marketing_manager: 'Marketing Teams',
    developer: 'Developers',
    enterprise_admin: 'Enterprise Teams',
  };
  return labels[persona];
}
