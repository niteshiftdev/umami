'use client';
import { useState } from 'react';
import { Row, Column, Button, Icon, Slider } from '@umami/react-zen';
import { Settings } from '@/components/icons';
import { useMessages } from '@/components/hooks';

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
  const { formatMessage, labels } = useMessages();
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
    <Column
      position="fixed"
      bottom="20px"
      right="20px"
      zIndex={1000}
      gap="2"
    >
      {isOpen && (
        <Column
          backgroundColor
          border
          borderRadius="3"
          paddingX="4"
          paddingY="3"
          minWidth="280px"
          gap="3"
          style={{ backdropFilter: 'blur(10px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        >
          <Row justifyContent="space-between" alignItems="center">
            <strong>Design Dials - Padding</strong>
            <Button
              size="sm"
              variant="quiet"
              onPress={handleReset}
              style={{ fontSize: '12px' }}
            >
              Reset
            </Button>
          </Row>

          {dialConfig.map((config) => (
            <Column key={config.key} gap="1">
              <Row justifyContent="space-between" alignItems="center">
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
              </Row>
              <Slider
                value={paddingValues[config.key]}
                onChange={(value) => handlePaddingChange(config.key, value)}
                minValue={0}
                maxValue={config.max}
                step={1}
                style={{ width: '100%' }}
              />
              <div style={{ fontSize: '10px', color: 'var(--secondary-font-color)', marginTop: '-4px' }}>
                {config.description}
              </div>
            </Column>
          ))}
        </Column>
      )}

      <Button
        variant="solid"
        size="lg"
        onPress={() => setIsOpen(!isOpen)}
        style={{
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        <Icon>
          <Settings style={{ width: '20px', height: '20px' }} />
        </Icon>
      </Button>
    </Column>
  );
}
