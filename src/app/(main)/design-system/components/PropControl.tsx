'use client';

import { ReactNode } from 'react';
import {
  Column,
  Row,
  Text,
  Select,
  ListItem,
  Switch,
  TextField,
  Slider,
} from '@umami/react-zen';

export interface PropControlProps {
  label: string;
  type: 'select' | 'boolean' | 'string' | 'number';
  value: any;
  options?: { value: any; label: string }[];
  onChange: (value: any) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function PropControl({
  label,
  type,
  value,
  options,
  onChange,
  min,
  max,
  step,
}: PropControlProps) {
  return (
    <Row alignItems="center" justifyContent="space-between" gap="4">
      <Text size="3" style={{ minWidth: '120px' }}>
        {label}:
      </Text>

      {type === 'select' && options && (
        <Select
          selectedKey={String(value)}
          onSelectionChange={(key) => onChange(String(key))}
          style={{ minWidth: '150px' }}
        >
          {options.map(opt => (
            <ListItem key={opt.value} id={String(opt.value)}>
              {opt.label}
            </ListItem>
          ))}
        </Select>
      )}

      {type === 'boolean' && (
        <Switch isSelected={value} onChange={onChange} />
      )}

      {type === 'string' && (
        <TextField
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ minWidth: '150px' }}
        />
      )}

      {type === 'number' && (
        <Slider
          value={value}
          onChange={onChange}
          minValue={min}
          maxValue={max}
          step={step}
          showValue
          style={{ minWidth: '200px' }}
        />
      )}
    </Row>
  );
}
