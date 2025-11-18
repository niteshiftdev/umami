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
  // Check if all options are numeric strings
  const allNumeric = config.options.every(opt => !isNaN(Number(opt)));

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(e.target.value);
    onChange(config.options[index]);
  };

  const currentIndex = config.options.indexOf(value);

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
        {allNumeric ? (
          <div className="variant-slider">
            <input
              type="range"
              min={0}
              max={config.options.length - 1}
              step={1}
              value={currentIndex}
              onChange={handleSliderChange}
            />
            <div className="slider-labels">
              <span>{config.options[0]}</span>
              <span className="slider-value">{value}</span>
              <span>{config.options[config.options.length - 1]}</span>
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
