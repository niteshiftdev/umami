'use client';

import { useState } from 'react';
import { Column, Row, Button, Icon, LoadingButton, CopyButton } from '@umami/react-zen';
import { Check } from '@/components/icons';
import { ShowcaseSection } from '../components/ShowcaseSection';
import { PropControl } from '../components/PropControl';

export function ButtonsShowcase() {
  const [variant, setVariant] = useState<any>('primary');
  const [size, setSize] = useState<any>('md');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateCode = () => {
    const props = [];
    if (variant !== 'primary') props.push(`variant="${variant}"`);
    if (size !== 'md') props.push(`size="${size}"`);
    if (isDisabled) props.push('isDisabled');

    return `<Button${props.length ? ' ' + props.join(' ') : ''}>Button Text</Button>`;
  };

  return (
    <Column gap="8" paddingY="6">
      <ShowcaseSection
        title="Button"
        description="Interactive buttons with multiple variants and sizes"
        code={generateCode()}
      >
        <Column gap="6">
          <Column gap="3" padding="4" backgroundColor="2" borderRadius="2">
            <PropControl
              label="Variant"
              type="select"
              value={variant}
              onChange={setVariant}
              options={[
                { value: 'primary', label: 'Primary' },
                { value: 'outline', label: 'Outline' },
                { value: 'quiet', label: 'Quiet' },
                { value: 'danger', label: 'Danger' },
                { value: 'zero', label: 'Zero' },
              ]}
            />
            <PropControl
              label="Size"
              type="select"
              value={size}
              onChange={setSize}
              options={[
                { value: 'xs', label: 'Extra Small' },
                { value: 'sm', label: 'Small' },
                { value: 'md', label: 'Medium' },
                { value: 'lg', label: 'Large' },
                { value: 'xl', label: 'Extra Large' },
              ]}
            />
            <PropControl
              label="Disabled"
              type="boolean"
              value={isDisabled}
              onChange={setIsDisabled}
            />
          </Column>

          <Row gap="3" wrap="wrap">
            <Button variant={variant} size={size} isDisabled={isDisabled}>
              Button Text
            </Button>
            <Button variant={variant} size={size} isDisabled={isDisabled}>
              <Icon size={size}>
                <Check />
              </Icon>
              With Icon
            </Button>
          </Row>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="All Button Variants"
        description="Complete set of button variants"
        code={`// Primary - Main call-to-action
<Button variant="primary" onPress={handleSave}>
  Save Changes
</Button>

// Outline - Secondary actions
<Button variant="outline" onPress={handleCancel}>
  Cancel
</Button>

// Quiet - Tertiary actions, less emphasis
<Button variant="quiet" onPress={handleLearnMore}>
  Learn More
</Button>

// Danger - Destructive actions
<Button variant="danger" onPress={handleDelete}>
  Delete Item
</Button>

// Zero - Completely unstyled for custom use
<Button variant="zero" onPress={handleCustom}>
  Custom Styled Button
</Button>`}
      >
        <Row gap="3" wrap="wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="quiet">Quiet</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="zero">Zero</Button>
        </Row>
      </ShowcaseSection>

      <ShowcaseSection
        title="Button Sizes"
        description="All available button sizes"
        code={`// Available sizes: xs, sm, md (default), lg, xl
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// Combine with variants
<Button variant="primary" size="lg">
  Large Primary Button
</Button>`}
      >
        <Row gap="3" wrap="wrap" alignItems="center">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </Row>
      </ShowcaseSection>

      <ShowcaseSection
        title="Loading Button"
        description="Button with loading state for async operations"
        code={`const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await apiCall();
    // Success handling
  } catch (error) {
    // Error handling
  } finally {
    setIsLoading(false);
  }
};

<LoadingButton
  isLoading={isLoading}
  onPress={handleSubmit}
>
  Submit Form
</LoadingButton>

// Disabled while loading
<LoadingButton
  isLoading={isLoading}
  isDisabled={isLoading}
  variant="outline"
>
  Save Draft
</LoadingButton>`}
      >
        <Column gap="3">
          <PropControl
            label="Loading"
            type="boolean"
            value={isLoading}
            onChange={setIsLoading}
          />
          <Row gap="3">
            <LoadingButton isLoading={isLoading}>Submit</LoadingButton>
            <LoadingButton isLoading={isLoading} variant="outline">
              Save
            </LoadingButton>
          </Row>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Copy Button"
        description="Button that copies value to clipboard with visual feedback"
        code={`// Copy a simple value
<CopyButton value="Hello, World!">
  Copy Text
</CopyButton>

// Copy API key or token
<CopyButton value="sk_test_1234567890abcdef">
  Copy API Key
</CopyButton>

// Custom timeout (default: 2000ms)
<CopyButton value="https://example.com" timeout={3000}>
  Copy URL
</CopyButton>

// The button shows a checkmark briefly after copying`}
      >
        <Row gap="3">
          <CopyButton value="Hello, World!">Copy Text</CopyButton>
          <CopyButton value="sk_test_1234567890abcdef">Copy API Key</CopyButton>
          <CopyButton value="https://umami.is">Copy URL</CopyButton>
        </Row>
      </ShowcaseSection>
    </Column>
  );
}
