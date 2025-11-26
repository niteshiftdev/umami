'use client';
import { useState } from 'react';
import { Row, Column } from '@umami/react-zen';
import { Settings } from '@/components/icons';

export interface PaddingValues {
  pageBodyPaddingX: number;
  pageBodyPaddingY: number;
  panelPaddingX: number;
  panelPaddingY: number;
  columnGap: number;
}

interface PaddingDialsProps {
  paddingValues: PaddingValues;
  onPaddingChange: (values: PaddingValues) => void;
}

const PADDING_SCALE = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
};

export function PaddingDials({ paddingValues, onPaddingChange }: PaddingDialsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePaddingChange = (key: keyof PaddingValues, value: number) => {
    onPaddingChange({
      ...paddingValues,
      [key]: value,
    });
  };

  const handleReset = () => {
    onPaddingChange({
      pageBodyPaddingX: 6,
      pageBodyPaddingY: 6,
      panelPaddingX: 6,
      panelPaddingY: 6,
      columnGap: 3,
    });
  };

  const dialConfig = [
    {
      key: 'pageBodyPaddingX' as const,
      label: 'Page Horizontal',
      description: 'Horizontal padding of page body',
      max: 12,
    },
    {
      key: 'pageBodyPaddingY' as const,
      label: 'Page Vertical',
      description: 'Vertical padding of page body',
      max: 12,
    },
    {
      key: 'panelPaddingX' as const,
      label: 'Panel Horizontal',
      description: 'Horizontal padding of panels',
      max: 12,
    },
    {
      key: 'panelPaddingY' as const,
      label: 'Panel Vertical',
      description: 'Vertical padding of panels',
      max: 12,
    },
    {
      key: 'columnGap' as const,
      label: 'Column Gap',
      description: 'Gap between stacked elements',
      max: 8,
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 10000,
        pointerEvents: 'auto',
      }}
    >
      {isOpen && (
        <div
          style={{
            backgroundColor: 'var(--base-color)',
            border: '1px solid var(--base-color-3)',
            borderRadius: '8px',
            padding: '16px',
            minWidth: '300px',
            gap: '12px',
            marginBottom: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ fontSize: '14px' }}>Design Dials - Padding</strong>
            <button
              onClick={handleReset}
              style={{
                fontSize: '12px',
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '3px',
                textDecoration: 'underline',
              }}
            >
              Reset
            </button>
          </div>

          {dialConfig.map((config) => (
            <div key={config.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '12px', fontWeight: 500 }}>
                  {config.label}
                </label>
                <span
                  style={{
                    fontSize: '11px',
                    backgroundColor: 'var(--base-color-3)',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontFamily: 'monospace',
                  }}
                >
                  {PADDING_SCALE[paddingValues[config.key] as keyof typeof PADDING_SCALE]}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={config.max}
                step={1}
                value={paddingValues[config.key]}
                onChange={(e) => handlePaddingChange(config.key, parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '4px',
                  cursor: 'pointer',
                  borderRadius: '2px',
                }}
              />
              <div style={{ fontSize: '10px', color: 'var(--secondary-font-color)', marginTop: '-2px' }}>
                {config.description}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => {
          console.log('Button clicked, isOpen was:', isOpen);
          setIsOpen(!isOpen);
        }}
        type="button"
        style={{
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          border: 'none',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          fontSize: '20px',
          padding: 0,
          pointerEvents: 'auto',
        }}
      >
        <Settings style={{ width: '20px', height: '20px' }} />
      </button>
    </div>
  );
}
