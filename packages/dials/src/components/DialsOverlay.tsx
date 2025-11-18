/**
 * Main overlay UI component for displaying and controlling dials
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Gauge } from 'lucide-react';
import { getDialRegistry } from '../registry';
import { ColorControl } from '../controls/ColorControl';
import { SpacingControl } from '../controls/SpacingControl';
import { VariantControl } from '../controls/VariantControl';
import { BooleanControl } from '../controls/BooleanControl';
import { NumberControl } from '../controls/NumberControl';
import type { DialRegistration } from '../types';

export interface DialsOverlayProps {
  /** Initial visibility state */
  defaultVisible?: boolean;
  /** Keyboard shortcut to toggle (default: 'k') */
  toggleKey?: string;
  /** Position of the overlay */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

/**
 * Overlay UI for controlling dials
 * Should be rendered at the root level of your app
 *
 * @example
 * ```typescript
 * <DialsProvider>
 *   <App />
 *   <DialsOverlay defaultVisible={false} toggleKey="k" position="bottom-right" />
 * </DialsProvider>
 * ```
 */
export function DialsOverlay({
  defaultVisible = true,
  toggleKey = 'k',
  position = 'bottom-left',
}: DialsOverlayProps) {
  const [isVisible, setIsVisible] = useState(defaultVisible);
  const [searchTerm, setSearchTerm] = useState('');
  const [dials, setDials] = useState<DialRegistration[]>([]);
  const [hasNextOverlay, setHasNextOverlay] = useState(false);
  const registry = getDialRegistry();

  // Detect Next.js error overlay
  useEffect(() => {
    const checkNextOverlay = () => {
      // Next.js error overlay has specific identifiers
      const nextjsOverlay =
        document.querySelector('nextjs-portal') ||
        document.querySelector('[data-nextjs-dialog-overlay]') ||
        document.querySelector('[data-nextjs-toast]');
      setHasNextOverlay(!!nextjsOverlay);
    };

    // Check on mount and set up observer
    checkNextOverlay();

    const observer = new MutationObserver(checkNextOverlay);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // Subscribe to registry changes
  useEffect(() => {
    const updateDials = () => {
      setDials(registry.getAllDials());
    };

    // Initial load
    updateDials();

    // Subscribe to changes
    const unsubscribe = registry.subscribeToRegistry(updateDials);

    return unsubscribe;
  }, [registry]);

  // Keyboard shortcut to toggle visibility
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === toggleKey) {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleKey]);

  // Filter and group dials
  const filteredDials = useMemo(() => {
    if (!searchTerm) return dials;

    const term = searchTerm.toLowerCase();
    return dials.filter(dial => {
      const label = dial.config.label.toLowerCase();
      const group = dial.config.group?.toLowerCase() || '';
      const id = dial.id.toLowerCase();
      return label.includes(term) || group.includes(term) || id.includes(term);
    });
  }, [dials, searchTerm]);

  const groupedDials = useMemo(() => {
    const groups = new Map<string, DialRegistration[]>();

    for (const dial of filteredDials) {
      const group = dial.config.group || 'Ungrouped';
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group)!.push(dial);
    }

    return groups;
  }, [filteredDials]);

  const handleChange = (id: string, value: any) => {
    registry.setValue(id, value);
  };

  const handleReset = (id: string) => {
    registry.reset(id);
  };

  const handleResetAll = () => {
    if (confirm('Reset all dials to their default values?')) {
      registry.resetAll();
    }
  };

  // Calculate bottom position based on Next.js overlay presence
  const bottomPosition = hasNextOverlay ? '140px' : '20px';

  if (!isVisible) {
    return (
      <button
        className="dials-toggle-button"
        onClick={() => setIsVisible(true)}
        title={`Show Dials (${toggleKey === 'k' ? 'Cmd/Ctrl+K' : toggleKey})`}
        style={{
          position: 'fixed',
          [position.includes('bottom') ? 'bottom' : 'top']: position.includes('bottom')
            ? bottomPosition
            : '20px',
          [position.includes('right') ? 'right' : 'left']: '20px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '2px solid #666',
          background: '#1a1a1a',
          color: '#fff',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 9999999, // Very high to be above everything
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Gauge size={24} />
      </button>
    );
  }

  return (
    <div
      className="dials-overlay"
      style={{
        position: 'fixed',
        [position.includes('bottom') ? 'bottom' : 'top']: position.includes('bottom')
          ? bottomPosition
          : '20px',
        [position.includes('right') ? 'right' : 'left']: '20px',
        width: '380px',
        maxHeight: '80vh',
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 9999999, // Very high to be above everything
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>🎛️ Design Dials</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
          }}
          title="Close"
        >
          ×
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
        <input
          type="search"
          placeholder="Search dials..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        />
      </div>

      {/* Dials list */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
        }}
      >
        {filteredDials.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', padding: '32px 16px' }}>
            {searchTerm ? 'No dials match your search' : 'No dials registered yet'}
          </div>
        ) : (
          Array.from(groupedDials.entries()).map(([groupName, groupDials]) => (
            <div key={groupName} style={{ marginBottom: '24px' }}>
              <h4
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {groupName}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {groupDials.map(dial => (
                  <div key={dial.id}>{renderControl(dial, handleChange, handleReset)}</div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #eee',
          display: 'flex',
          gap: '8px',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={handleResetAll}
          disabled={dials.length === 0}
          style={{
            padding: '8px 16px',
            background: 'none',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: dials.length > 0 ? 'pointer' : 'not-allowed',
            fontSize: '13px',
          }}
        >
          Reset All
        </button>
        <div style={{ fontSize: '12px', color: '#999', display: 'flex', alignItems: 'center' }}>
          {dials.length} dial{dials.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}

/**
 * Render the appropriate control component based on dial type
 */
function renderControl(
  dial: DialRegistration,
  onChange: (id: string, value: any) => void,
  onReset: (id: string) => void,
) {
  const commonProps = {
    id: dial.id,
    value: dial.currentValue,
    onChange: (value: any) => onChange(dial.id, value),
    onReset: () => onReset(dial.id),
  };

  switch (dial.type) {
    case 'color':
      return <ColorControl {...commonProps} config={dial.config as any} />;
    case 'spacing':
      return <SpacingControl {...commonProps} config={dial.config as any} />;
    case 'variant':
      return <VariantControl {...commonProps} config={dial.config as any} />;
    case 'boolean':
      return <BooleanControl {...commonProps} config={dial.config as any} />;
    case 'number':
      return <NumberControl {...commonProps} config={dial.config as any} />;
    default:
      return null;
  }
}
