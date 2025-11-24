/**
 * Color control component for the overlay UI
 */

import React, { useState } from 'react';
import type { ColorDialConfig } from '../types';
import { designManifest } from '@/config/niteshift-manifest';

export interface ColorControlProps {
  id: string;
  value: string;
  config: ColorDialConfig;
  onChange: (value: string) => void;
  onReset: () => void;
}

// Helper to get color name from design system
function getColorName(hex: string): string | null {
  const normalizedHex = hex.toLowerCase();

  // Check accent colors
  if (designManifest.colors.accent.values) {
    for (const [name, color] of Object.entries(designManifest.colors.accent.values)) {
      if (color.toLowerCase() === normalizedHex) {
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
    }
  }

  // Check semantic colors
  if (designManifest.colors.semantic.values) {
    for (const [name, color] of Object.entries(designManifest.colors.semantic.values)) {
      if (color.toLowerCase() === normalizedHex) {
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
    }
  }

  return null;
}

export function ColorControl({ id, value, config, onChange, onReset }: ColorControlProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customValue, setCustomValue] = useState(value);
  const colorName = getColorName(value);

  const handlePresetClick = (color: string) => {
    onChange(color);
    setShowCustom(false);
  };

  const handleCustomSubmit = () => {
    onChange(customValue);
  };

  return (
    <div className="dial-control color-control">
      <div className="control-header">
        <label htmlFor={id}>{config.label}</label>
        {config.description && <span className="control-description">{config.description}</span>}
        <button className="reset-button" onClick={onReset} title="Reset to default">
          ↺
        </button>
      </div>

      <div className="control-body">
        {/* Preset colors */}
        {config.options && config.options.length > 0 && (
          <div className="color-presets">
            {config.options.map(color => {
              const name = getColorName(color);
              return (
                <button
                  key={color}
                  className={`color-preset ${value === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handlePresetClick(color)}
                  title={name || color}
                />
              );
            })}
          </div>
        )}

        {/* Current value display */}
        <div className="color-current">
          <div className="color-swatch" style={{ backgroundColor: value }} />
          <span className="color-value">{colorName || value}</span>
        </div>

        {/* Custom color input */}
        {config.allowCustom && (
          <div className="color-custom">
            {!showCustom ? (
              <button className="custom-toggle" onClick={() => setShowCustom(true)}>
                Custom color
              </button>
            ) : (
              <div className="custom-input">
                <input
                  type="text"
                  value={customValue}
                  onChange={e => setCustomValue(e.target.value)}
                  placeholder="#000000"
                  pattern="^#[0-9a-fA-F]{6}$"
                />
                <button onClick={handleCustomSubmit}>Apply</button>
                <button onClick={() => setShowCustom(false)}>Cancel</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
