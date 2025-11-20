/**
 * Color control component for the overlay UI
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { ColorDialConfig, DesignManifest } from '../types';
import { useDialsContext } from '../components/DialsProvider';

export interface ColorControlProps {
  id: string;
  value: string;
  config: ColorDialConfig;
  onChange: (value: string) => void;
  onReset: () => void;
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

function buildColorLookup(manifest?: DesignManifest | null) {
  const lookup: Record<string, string> = {};
  if (!manifest?.colors) return lookup;

  for (const [groupKey, group] of Object.entries(manifest.colors)) {
    const values = group.values;
    if (!values) continue;

    if (Array.isArray(values)) {
      values.forEach((hex, index) => {
        lookup[hex.toLowerCase()] = `${capitalize(group.label || groupKey)} ${index + 1}`;
      });
    } else {
      Object.entries(values).forEach(([name, hex]) => {
        lookup[hex.toLowerCase()] = name;
      });
    }
  }

  return lookup;
}

function getColorName(hex: string, lookup: Record<string, string>): string | null {
  const normalizedHex = hex?.toLowerCase();
  if (!normalizedHex) return null;
  const name = lookup[normalizedHex];
  return name ? capitalize(name) : null;
}

export function ColorControl({ id, value, config, onChange, onReset }: ColorControlProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const swatchRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const { manifest } = useDialsContext();
  const colorLookup = useMemo(() => buildColorLookup(manifest), [manifest]);
  const colorName = getColorName(value, colorLookup);

  const handleSwatchClick = () => {
    if (swatchRef.current) {
      const rect = swatchRef.current.getBoundingClientRect();
      setPickerPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
      setShowPicker(true);
    }
  };

  const handlePresetClick = (color: string) => {
    onChange(color);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Close picker when clicking outside
  useEffect(() => {
    if (!showPicker) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        swatchRef.current &&
        !swatchRef.current.contains(e.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPicker]);

  return (
    <div className="dial-control color-control">
      <div className="control-header">
        <label htmlFor={id} title={config.description}>
          {config.label}
        </label>
        <button className="reset-button" onClick={onReset} title="Reset to default">
          ↺
        </button>
      </div>

      <div className="control-body">
        {/* Swatch */}
        <div
          ref={swatchRef}
          className="color-swatch"
          style={{ backgroundColor: value }}
          onClick={handleSwatchClick}
          title={colorName || value}
        />

        {/* Input */}
        <input
          type="text"
          className="color-value-input"
          value={colorName || value}
          onChange={handleInputChange}
          placeholder="#000000"
        />

        {/* Popover picker */}
        {showPicker && (
          <>
            <div className="color-picker-overlay" onClick={() => setShowPicker(false)} />
            <div
              ref={pickerRef}
              className="color-picker-wrapper"
              style={{
                top: pickerPosition.top,
                left: pickerPosition.left,
              }}
            >
              {/* Preset colors */}
              {config.options && config.options.length > 0 && (
                <div className="color-presets">
                  {config.options.map(color => {
                    const name = getColorName(color, colorLookup);
                    return (
                      <div
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
