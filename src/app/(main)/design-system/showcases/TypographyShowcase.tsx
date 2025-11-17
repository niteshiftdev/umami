'use client';

import { useState } from 'react';
import { Column, Row, Heading, Text, Code, Blockquote } from '@umami/react-zen';
import { ShowcaseSection } from '../components/ShowcaseSection';
import { PropControl } from '../components/PropControl';

export function TypographyShowcase() {
  const [textSize, setTextSize] = useState<any>('4');
  const [textWeight, setTextWeight] = useState<any>('regular');
  const [textColor, setTextColor] = useState<any>('');

  return (
    <Column gap="8" paddingY="6">
      <ShowcaseSection
        title="Heading Sizes"
        description="All heading size variations"
        code='<Heading size="6">Large Heading</Heading>'
      >
        <Column gap="3">
          <Heading size="12">Heading Size 12</Heading>
          <Heading size="10">Heading Size 10</Heading>
          <Heading size="8">Heading Size 8</Heading>
          <Heading size="6">Heading Size 6</Heading>
          <Heading size="4">Heading Size 4</Heading>
          <Heading size="2">Heading Size 2</Heading>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Text Component"
        description="Customizable text with size, weight, and color"
        code={`<Text size="${textSize}" weight="${textWeight}"${textColor ? ` color="${textColor}"` : ''}>Text content</Text>`}
      >
        <Column gap="6">
          <Column gap="3" padding="4" backgroundColor="2" borderRadius="2">
            <PropControl
              label="Size"
              type="select"
              value={textSize}
              onChange={setTextSize}
              options={[
                { value: '1', label: '1 (Smallest)' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
                { value: '6', label: '6' },
                { value: '7', label: '7 (Largest)' },
              ]}
            />
            <PropControl
              label="Weight"
              type="select"
              value={textWeight}
              onChange={setTextWeight}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'regular', label: 'Regular' },
                { value: 'medium', label: 'Medium' },
                { value: 'bold', label: 'Bold' },
              ]}
            />
            <PropControl
              label="Color"
              type="select"
              value={textColor}
              onChange={setTextColor}
              options={[
                { value: '', label: 'Default' },
                { value: 'primary', label: 'Primary' },
                { value: 'muted', label: 'Muted' },
                { value: 'blue', label: 'Blue' },
                { value: 'green', label: 'Green' },
                { value: 'red', label: 'Red' },
                { value: 'orange', label: 'Orange' },
              ]}
            />
          </Column>

          <Text size={textSize} weight={textWeight} color={textColor || undefined}>
            The quick brown fox jumps over the lazy dog. This is sample text to demonstrate
            typography options.
          </Text>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Text Sizes"
        description="All text size variations"
      >
        <Column gap="2">
          <Text size="1">Text Size 1 - Smallest</Text>
          <Text size="2">Text Size 2</Text>
          <Text size="3">Text Size 3</Text>
          <Text size="4">Text Size 4 - Default</Text>
          <Text size="5">Text Size 5</Text>
          <Text size="6">Text Size 6</Text>
          <Text size="7">Text Size 7 - Largest</Text>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Font Weights"
        description="All font weight variations"
      >
        <Column gap="2">
          <Text weight="light">Light weight text</Text>
          <Text weight="regular">Regular weight text (default)</Text>
          <Text weight="medium">Medium weight text</Text>
          <Text weight="bold">Bold weight text</Text>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Text Colors"
        description="Semantic color options"
      >
        <Column gap="2">
          <Text>Default color text</Text>
          <Text color="primary">Primary color text</Text>
          <Text color="muted">Muted color text</Text>
          <Text color="blue">Blue color text</Text>
          <Text color="green">Green color text</Text>
          <Text color="red">Red color text</Text>
          <Text color="orange">Orange color text</Text>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Text Styles"
        description="Text decoration options"
      >
        <Column gap="3">
          <Text italic>Italic text</Text>
          <Text underline>Underlined text</Text>
          <Text strikethrough>Strikethrough text</Text>
          <Text truncate style={{ maxWidth: '200px' }}>
            This is a very long text that will be truncated with an ellipsis when it exceeds the
            maximum width
          </Text>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Code"
        description="Inline code formatting"
        code='<Code>const value = "code";</Code>'
      >
        <Text>
          This is regular text with <Code>inline code</Code> inside it.
        </Text>
      </ShowcaseSection>

      <ShowcaseSection
        title="Blockquote"
        description="Block quote formatting"
        code={`<Blockquote>
  Quote text goes here
</Blockquote>`}
      >
        <Blockquote>
          <Text size="5" italic>
            "The best way to predict the future is to invent it."
          </Text>
          <Text color="muted" size="3">
            — Alan Kay
          </Text>
        </Blockquote>
      </ShowcaseSection>
    </Column>
  );
}
