'use client';
import { useState } from 'react';
import { Box, Column, Row, Text, Button } from '@umami/react-zen';

export function TypographyControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [headingSize, setHeadingSize] = useState(100);
  const [fontWeight, setFontWeight] = useState(400);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);

  const applyTypography = () => {
    const root = document.documentElement;
    root.style.setProperty('--base-font-size', `${fontSize}%`);
    root.style.setProperty('--heading-scale', `${headingSize}%`);
    root.style.setProperty('--base-font-weight', `${fontWeight}`);
    root.style.setProperty('--base-line-height', `${lineHeight}`);
    root.style.setProperty('--base-letter-spacing', `${letterSpacing}px`);
  };

  const resetTypography = () => {
    setFontSize(100);
    setHeadingSize(100);
    setFontWeight(400);
    setLineHeight(1.5);
    setLetterSpacing(0);
    const root = document.documentElement;
    root.style.removeProperty('--base-font-size');
    root.style.removeProperty('--heading-scale');
    root.style.removeProperty('--base-font-weight');
    root.style.removeProperty('--base-line-height');
    root.style.removeProperty('--base-letter-spacing');
  };

  // Apply typography changes whenever values change
  applyTypography();

  if (!isOpen) {
    return (
      <Box
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        <Button onClick={() => setIsOpen(true)}>
          Typography Controls
        </Button>
      </Box>
    );
  }

  return (
    <Box
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '320px',
        maxHeight: '80vh',
        overflowY: 'auto',
        backgroundColor: 'var(--base-color-0)',
        border: '1px solid var(--base-color-200)',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
      }}
    >
      <Column gap="4">
        <Row justify="space-between" align="center">
          <Text weight="bold" size="4">Typography Controls</Text>
          <Button size="sm" onClick={() => setIsOpen(false)}>
            ✕
          </Button>
        </Row>

        <Column gap="3">
          {/* Font Size */}
          <Column gap="1">
            <Row justify="space-between">
              <Text size="2">Base Font Size</Text>
              <Text size="2" color="muted">{fontSize}%</Text>
            </Row>
            <input
              type="range"
              min="75"
              max="150"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </Column>

          {/* Heading Size */}
          <Column gap="1">
            <Row justify="space-between">
              <Text size="2">Heading Scale</Text>
              <Text size="2" color="muted">{headingSize}%</Text>
            </Row>
            <input
              type="range"
              min="75"
              max="150"
              value={headingSize}
              onChange={(e) => setHeadingSize(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </Column>

          {/* Font Weight */}
          <Column gap="1">
            <Row justify="space-between">
              <Text size="2">Font Weight</Text>
              <Text size="2" color="muted">{fontWeight}</Text>
            </Row>
            <input
              type="range"
              min="300"
              max="700"
              step="100"
              value={fontWeight}
              onChange={(e) => setFontWeight(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </Column>

          {/* Line Height */}
          <Column gap="1">
            <Row justify="space-between">
              <Text size="2">Line Height</Text>
              <Text size="2" color="muted">{lineHeight.toFixed(2)}</Text>
            </Row>
            <input
              type="range"
              min="1"
              max="2.5"
              step="0.1"
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </Column>

          {/* Letter Spacing */}
          <Column gap="1">
            <Row justify="space-between">
              <Text size="2">Letter Spacing</Text>
              <Text size="2" color="muted">{letterSpacing}px</Text>
            </Row>
            <input
              type="range"
              min="-2"
              max="4"
              step="0.5"
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </Column>
        </Column>

        <Button onClick={resetTypography} variant="secondary">
          Reset to Defaults
        </Button>
      </Column>
    </Box>
  );
}
