'use client';

import { useState } from 'react';
import { UserPersona } from './LandingPageVariations';
import { Row } from '@umami/react-zen';

interface PersonaSwitcherProps {
  onChange?: (persona: UserPersona) => void;
}

const personas: { value: UserPersona; label: string; emoji: string }[] = [
  { value: 'startup_founder', label: 'Startup Founder', emoji: '🚀' },
  { value: 'marketing_manager', label: 'Marketing Manager', emoji: '📊' },
  { value: 'developer', label: 'Developer', emoji: '👨‍💻' },
  { value: 'enterprise_admin', label: 'Enterprise Admin', emoji: '🏢' },
];

export function PersonaSwitcher({ onChange }: PersonaSwitcherProps) {
  const [selected, setSelected] = useState<UserPersona>('startup_founder');

  const handleSelect = (persona: UserPersona) => {
    setSelected(persona);
    onChange?.(persona);
  };

  return (
    <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
      <p style={{ marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#666' }}>
        Select a user persona to preview:
      </p>
      <Row gap="sm">
        {personas.map(({ value, label, emoji }) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: selected === value ? '2px solid #3b82f6' : '1px solid #e5e7eb',
              backgroundColor: selected === value ? '#eff6ff' : 'white',
              color: selected === value ? '#1e40af' : '#666',
              fontWeight: selected === value ? 'bold' : 'normal',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {emoji} {label}
          </button>
        ))}
      </Row>
    </div>
  );
}
