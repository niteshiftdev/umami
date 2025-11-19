'use client';

import { notFound } from 'next/navigation';
import { LandingPageVariation, UserPersona } from '@/components/landing/LandingPageVariations';
import { getPersonaTestData } from '@/lib/testData';
import { Column } from '@umami/react-zen';

const validPersonas: UserPersona[] = ['startup_founder', 'marketing_manager', 'developer', 'enterprise_admin'];

export default function PersonaLandingPage({ params }: { params: { persona: string } }) {
  const persona = params.persona as UserPersona;

  if (!validPersonas.includes(persona)) {
    notFound();
  }

  const testData = getPersonaTestData(persona);

  return (
    <Column gap="xl">
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          borderLeft: '4px solid #3b82f6',
          borderRadius: '4px',
        }}
      >
        <p style={{ fontSize: '0.9rem', color: '#1e40af' }}>
          <strong>Preview Mode:</strong> {testData.description}
        </p>
      </div>
      <div style={{ backgroundColor: 'white', borderRadius: '8px' }}>
        <LandingPageVariation persona={persona} metrics={testData.metrics} />
      </div>
    </Column>
  );
}

export function generateStaticParams() {
  return validPersonas.map(persona => ({
    persona,
  }));
}
