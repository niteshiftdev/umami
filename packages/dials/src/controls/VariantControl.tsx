/**
 * Variant control component for the overlay UI
 */

import React from 'react';
import type { VariantDialConfig } from '../types';

export interface VariantControlProps {
  id: string;
  value: string;
  config: VariantDialConfig;
  onChange: (value: string) => void;
  onReset: () => void;
}

export function VariantControl({ id, value, config, onChange, onReset }: VariantControlProps) {
  return (
    <div className="dial-control variant-control">
      <div className="control-header">
        <label htmlFor={id}>{config.label}</label>
        {config.description && <span className="control-description">{config.description}</span>}
        <button className="reset-button" onClick={onReset} title="Reset to default">
          ↺
        </button>
      </div>

      <div className="control-body">
        <div className="variant-options">
          {config.options.map(option => {
            const label = config.optionLabels?.[option] || option;
            return (
              <button
                key={option}
                className={`variant-option ${value === option ? 'active' : ''}`}
                onClick={() => onChange(option)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
