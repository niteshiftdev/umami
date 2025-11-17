'use client';

import { Column, Row, Box, Text, Heading } from '@umami/react-zen';
import { ShowcaseSection } from '../components/ShowcaseSection';

const colors = [
  'gray',
  'gold',
  'bronze',
  'brown',
  'yellow',
  'amber',
  'orange',
  'tomato',
  'red',
  'ruby',
  'crimson',
  'pink',
  'plum',
  'purple',
  'violet',
  'iris',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'jade',
  'green',
  'grass',
  'lime',
  'mint',
  'sky',
];

const baseColors = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const spacingValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const borderRadii = ['0', '1', '2', '3', '4', 'full'];

const shadows = ['0', '1', '2', '3', '4', '5', '6'];

export function StylesShowcase() {
  return (
    <Column gap="8" paddingY="6">
      <ShowcaseSection
        title="Accent Colors"
        description="All available accent colors in the design system"
      >
        <Column gap="4">
          <Row gap="2" wrap="wrap">
            {colors.map(color => (
              <Column key={color} gap="1" alignItems="center" style={{ minWidth: '80px' }}>
                <Box
                  backgroundColor={color as any}
                  width="60px"
                  height="60px"
                  borderRadius="2"
                  border
                  borderColor="muted"
                />
                <Text size="2" align="center">
                  {color}
                </Text>
              </Column>
            ))}
          </Row>

          <Text color="muted" size="3">
            Usage: backgroundColor="blue" or color="green"
          </Text>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Base Colors (Neutral Scale)"
        description="Numbered color scale from 1 (lightest) to 12 (darkest)"
      >
        <Column gap="4">
          <Row gap="2" wrap="wrap">
            {baseColors.map(num => (
              <Column key={num} gap="1" alignItems="center" style={{ minWidth: '60px' }}>
                <Box
                  backgroundColor={num as any}
                  width="50px"
                  height="50px"
                  borderRadius="2"
                  border
                  borderColor="muted"
                />
                <Text size="2">{num}</Text>
              </Column>
            ))}
          </Row>

          <Text color="muted" size="3">
            Usage: backgroundColor="6" or borderColor="8"
          </Text>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Semantic Colors"
        description="Special semantic color values"
      >
        <Column gap="4">
          <Row gap="4" wrap="wrap">
            <Column gap="2" alignItems="center">
              <Box
                backgroundColor="primary"
                width="80px"
                height="60px"
                borderRadius="2"
              />
              <Text size="2">primary</Text>
            </Column>

            <Column gap="2" alignItems="center">
              <Box
                backgroundColor="transparent"
                border
                width="80px"
                height="60px"
                borderRadius="2"
              />
              <Text size="2">transparent</Text>
            </Column>

            <Column gap="2" alignItems="center">
              <Text color="muted" size="4">
                Muted Text
              </Text>
              <Text size="2">muted</Text>
            </Column>

            <Column gap="2" alignItems="center">
              <Text color="disabled" size="4">
                Disabled Text
              </Text>
              <Text size="2">disabled</Text>
            </Column>
          </Row>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Spacing Scale"
        description="Consistent spacing values (0-12) for padding, margin, and gap"
      >
        <Column gap="4">
          <Column gap="2">
            {spacingValues.map(value => (
              <Row key={value} gap="4" alignItems="center">
                <Text style={{ minWidth: '30px' }} size="3">
                  {value}:
                </Text>
                <Box
                  backgroundColor="blue"
                  height="20px"
                  padding={value as any}
                  borderRadius="1"
                >
                  <Box backgroundColor="1" height="20px" />
                </Box>
              </Row>
            ))}
          </Column>

          <Text color="muted" size="3">
            Usage: padding="4", margin="6", gap="3"
          </Text>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Border Radius"
        description="Border radius values from sharp to fully rounded"
      >
        <Column gap="4">
          <Row gap="4" wrap="wrap" alignItems="center">
            {borderRadii.map(radius => (
              <Column key={radius} gap="2" alignItems="center">
                <Box
                  backgroundColor="blue"
                  width="80px"
                  height="60px"
                  borderRadius={radius as any}
                />
                <Text size="2">{radius}</Text>
              </Column>
            ))}
          </Row>

          <Text color="muted" size="3">
            Usage: borderRadius="2" or borderRadius="full"
          </Text>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Box Shadows"
        description="Elevation shadows from subtle to prominent"
      >
        <Column gap="4">
          <Row gap="4" wrap="wrap" alignItems="center">
            {shadows.map(shadow => (
              <Column key={shadow} gap="2" alignItems="center">
                <Box
                  backgroundColor="2"
                  width="80px"
                  height="60px"
                  borderRadius="2"
                  shadow={shadow as any}
                />
                <Text size="2">{shadow}</Text>
              </Column>
            ))}
          </Row>

          <Text color="muted" size="3">
            Usage: shadow="2" or shadow="4"
          </Text>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Font Sizes"
        description="Typography scale from smallest (1) to largest (12)"
      >
        <Column gap="3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(size => (
            <Row key={size} gap="4" alignItems="center">
              <Text style={{ minWidth: '40px' }} size="3">
                {size}:
              </Text>
              <Text size={size as any}>
                The quick brown fox jumps over the lazy dog
              </Text>
            </Row>
          ))}

          <Text color="muted" size="3" style={{ marginTop: '12px' }}>
            Usage: fontSize="4" or size="6"
          </Text>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Font Weights"
        description="Available font weight options"
      >
        <Column gap="3">
          <Text weight="light" size="5">
            Light weight text
          </Text>
          <Text weight="regular" size="5">
            Regular weight text (default)
          </Text>
          <Text weight="medium" size="5">
            Medium weight text
          </Text>
          <Text weight="bold" size="5">
            Bold weight text
          </Text>

          <Text color="muted" size="3" style={{ marginTop: '12px' }}>
            Usage: weight="bold" or fontWeight="medium"
          </Text>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Responsive Props"
        description="All spacing and layout props support responsive breakpoints"
      >
        <Column gap="4">
          <Box
            padding={{ xs: '2', sm: '4', md: '6', lg: '8' }}
            backgroundColor="blue"
            borderRadius="2"
          >
            <Text color="1">
              This box has responsive padding that increases with viewport size
            </Text>
          </Box>

          <Column
            as="pre"
            padding="4"
            backgroundColor="2"
            borderRadius="2"
            overflow="auto"
          >
            <Text size="2" style={{ fontFamily: 'monospace' }}>
              {`<Box
  padding={{ xs: '2', sm: '4', md: '6', lg: '8' }}
  fontSize={{ xs: '3', md: '5' }}
>
  Responsive content
</Box>`}
            </Text>
          </Column>

          <Text color="muted" size="3">
            Breakpoints: xs (0-639px), sm (640-767px), md (768-1023px), lg (1024-1279px), xl
            (1280px+)
          </Text>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Border Variations"
        description="Different border configurations"
      >
        <Row gap="4" wrap="wrap">
          <Box padding="4" border borderRadius="2" backgroundColor="2">
            <Text>All borders</Text>
          </Box>

          <Box padding="4" border="top" borderRadius="2" backgroundColor="2">
            <Text>Top border</Text>
          </Box>

          <Box padding="4" border="bottom" borderRadius="2" backgroundColor="2">
            <Text>Bottom border</Text>
          </Box>

          <Box padding="4" border borderWidth="2" borderRadius="2" backgroundColor="2">
            <Text>Thick border</Text>
          </Box>

          <Box
            padding="4"
            border
            borderColor="blue"
            borderRadius="2"
            backgroundColor="2"
          >
            <Text>Colored border</Text>
          </Box>
        </Row>

        <Text color="muted" size="3" style={{ marginTop: '12px' }}>
          Usage: border="top", borderWidth="2", borderColor="blue"
        </Text>
      </ShowcaseSection>
    </Column>
  );
}
