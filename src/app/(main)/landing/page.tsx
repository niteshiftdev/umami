'use client';

import { useState } from 'react';
import { LandingPageVariation, UserPersona } from '@/components/landing/LandingPageVariations';
import { getPersonaTestData } from '@/lib/testData';
import { Column, Row } from '@umami/react-zen';

export default function LandingPageShowcase() {
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>('startup_founder');
  const personas: UserPersona[] = ['startup_founder', 'marketing_manager', 'developer', 'enterprise_admin'];

  const currentData = getPersonaTestData(selectedPersona);

  return (
    <Column gap="xl" style={{ padding: '2rem', backgroundColor: '#f9fafb' }}>
      {/* Navigation */}
      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px' }}>
        <h1 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Landing Page Variations</h1>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Select a user persona to view the customized landing page experience and associated test data.
        </p>
        <Row gap="md">
          {personas.map(persona => (
            <button
              key={persona}
              onClick={() => setSelectedPersona(persona)}
              style={{
                padding: '0.75rem 1.5rem',
                border: selectedPersona === persona ? '2px solid #3B82F6' : '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: selectedPersona === persona ? '#EFF6FF' : 'white',
                color: selectedPersona === persona ? '#3B82F6' : '#666',
                fontWeight: selectedPersona === persona ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {formatPersonaLabel(persona)}
            </button>
          ))}
        </Row>
      </div>

      {/* Current Persona Variant */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px' }}>
        <LandingPageVariation persona={selectedPersona} metrics={currentData.metrics} />
      </div>

      {/* Test Data Display */}
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Test Data: {currentData.description}</h2>

        {/* Top Pages */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>Top Pages</h3>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Path</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Views</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Entry %</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Exit %</th>
                </tr>
              </thead>
              <tbody>
                {currentData.pageViews.map(page => (
                  <tr key={page.path} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem' }}>{page.path}</td>
                    <td style={{ padding: '0.75rem' }}>{page.views.toLocaleString()}</td>
                    <td style={{ padding: '0.75rem' }}>{page.entryPercentage}%</td>
                    <td style={{ padding: '0.75rem' }}>{page.exitPercentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referrers */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>Top Referrers</h3>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Source</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Visits</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>%</th>
                </tr>
              </thead>
              <tbody>
                {currentData.referrers.map(ref => (
                  <tr key={ref.referrer} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem' }}>{ref.referrer}</td>
                    <td style={{ padding: '0.75rem' }}>{ref.visits.toLocaleString()}</td>
                    <td style={{ padding: '0.75rem' }}>{ref.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Events */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>Custom Events</h3>
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Event</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Count</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 'bold' }}>Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {currentData.events.map(event => (
                  <tr key={event.name} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.75rem' }}>{event.name}</td>
                    <td style={{ padding: '0.75rem' }}>{event.count.toLocaleString()}</td>
                    <td style={{ padding: '0.75rem' }}>{(event.conversionRate * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Devices */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>Devices</h3>
          <Row gap="lg">
            {currentData.devices.map(device => (
              <div
                key={device.device}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  textAlign: 'center',
                }}
              >
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  {device.device}
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {device.visitors.toLocaleString()}
                </p>
                <p style={{ color: '#999', fontSize: '0.85rem' }}>{device.percentage}%</p>
              </div>
            ))}
          </Row>
        </div>

        {/* Countries */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>Top Countries</h3>
          <Row gap="lg">
            {currentData.countries.map(country => (
              <div
                key={country.country}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{country.country}</p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  {country.visitors.toLocaleString()} visitors ({country.percentage}%)
                </p>
              </div>
            ))}
          </Row>
        </div>
      </div>
    </Column>
  );
}

function formatPersonaLabel(persona: UserPersona): string {
  const labels: Record<UserPersona, string> = {
    startup_founder: '🚀 Startup Founder',
    marketing_manager: '📊 Marketing Manager',
    developer: '👨‍💻 Developer',
    enterprise_admin: '🏢 Enterprise Admin',
  };
  return labels[persona];
}
