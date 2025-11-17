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
        description="Button with loading state"
        code='<LoadingButton isLoading={isLoading}>Submit</LoadingButton>'
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
        description="Button that copies value to clipboard"
        code='<CopyButton value="Text to copy" />'
      >
        <Row gap="3">
          <CopyButton value="Hello, World!">Copy Text</CopyButton>
        </Row>
      </ShowcaseSection>
    </Column>
  );
}
