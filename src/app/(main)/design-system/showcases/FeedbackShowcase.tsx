'use client';

import { useState } from 'react';
import {
  Column,
  Row,
  Button,
  AlertBanner,
  Loading,
  Spinner,
  Dots,
  ProgressBar,
  ProgressCircle,
  StatusLight,
  Tooltip,
  TooltipTrigger,
  Text,
} from '@umami/react-zen';
import { useToast } from '@umami/react-zen';
import { ShowcaseSection } from '../components/ShowcaseSection';
import { PropControl } from '../components/PropControl';

export function FeedbackShowcase() {
  const { toast } = useToast();
  const [showBanner, setShowBanner] = useState(true);
  const [progressValue, setProgressValue] = useState(65);
  const [loadingSize, setLoadingSize] = useState<any>('md');

  return (
    <Column gap="8" paddingY="6">
      <ShowcaseSection
        title="Toast Notifications"
        description="Show toast messages with different variants"
        code={`const { toast } = useToast();

toast('Success message', {
  variant: 'success',
  duration: 3000
});`}
      >
        <Row gap="3" wrap="wrap">
          <Button
            onPress={() =>
              toast('Operation completed successfully!', {
                variant: 'success',
                duration: 3000,
              })
            }
          >
            Show Success Toast
          </Button>
          <Button
            variant="danger"
            onPress={() =>
              toast('An error occurred!', {
                variant: 'error',
                duration: 3000,
              })
            }
          >
            Show Error Toast
          </Button>
          <Button
            variant="outline"
            onPress={() =>
              toast('This is an information message', {
                duration: 5000,
              })
            }
          >
            Show Info Toast
          </Button>
        </Row>
      </ShowcaseSection>

      <ShowcaseSection
        title="Alert Banners"
        description="Persistent alert messages"
        code={`<AlertBanner
  variant="info"
  title="Alert Title"
  description="Alert description"
  allowClose
/>`}
      >
        <Column gap="4">
          {showBanner && (
            <AlertBanner
              variant="info"
              title="Information"
              description="This is an informational message that can be dismissed"
              allowClose
              onClose={() => setShowBanner(false)}
            />
          )}
          {!showBanner && (
            <Button variant="outline" onPress={() => setShowBanner(true)}>
              Show Banner
            </Button>
          )}

          <AlertBanner
            variant="error"
            title="Error"
            description="This is an error message"
          />
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Loading Indicators"
        description="Different loading indicator styles"
        code={`<Loading size="md" icon="dots" placement="center" />`}
      >
        <Column gap="6">
          <Column gap="3" padding="4" backgroundColor="2" borderRadius="2">
            <PropControl
              label="Size"
              type="select"
              value={loadingSize}
              onChange={setLoadingSize}
              options={[
                { value: 'sm', label: 'Small' },
                { value: 'md', label: 'Medium' },
                { value: 'lg', label: 'Large' },
              ]}
            />
          </Column>

          <Row gap="6" alignItems="center">
            <Column alignItems="center" gap="2">
              <Loading size={loadingSize} icon="dots" placement="inline" />
              <Text size="2" color="muted">
                Dots
              </Text>
            </Column>

            <Column alignItems="center" gap="2">
              <Loading size={loadingSize} icon="spinner" placement="inline" />
              <Text size="2" color="muted">
                Spinner
              </Text>
            </Column>

            <Column alignItems="center" gap="2">
              <Spinner size={loadingSize} />
              <Text size="2" color="muted">
                Spinner Only
              </Text>
            </Column>

            <Column alignItems="center" gap="2">
              <Dots size={loadingSize} />
              <Text size="2" color="muted">
                Dots Only
              </Text>
            </Column>
          </Row>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Progress Bar"
        description="Linear progress indicator"
        code='<ProgressBar value={65} showPercentage />'
      >
        <Column gap="4">
          <PropControl
            label="Progress"
            type="number"
            value={progressValue}
            onChange={setProgressValue}
            min={0}
            max={100}
            step={5}
          />
          <ProgressBar value={progressValue} showPercentage />
          <ProgressBar value={progressValue} />
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Progress Circle"
        description="Circular progress indicator"
        code='<ProgressCircle value={65} showPercentage />'
      >
        <Row gap="6" alignItems="center">
          <ProgressCircle value={progressValue} showPercentage />
          <ProgressCircle value={progressValue} />
        </Row>
      </ShowcaseSection>

      <ShowcaseSection
        title="Status Lights"
        description="Status indicator dots"
        code='<StatusLight variant="success">Online</StatusLight>'
      >
        <Column gap="3">
          <Row gap="3" alignItems="center">
            <StatusLight variant="success" />
            <Text>Success</Text>
          </Row>
          <Row gap="3" alignItems="center">
            <StatusLight variant="warning" />
            <Text>Warning</Text>
          </Row>
          <Row gap="3" alignItems="center">
            <StatusLight variant="error" />
            <Text>Error</Text>
          </Row>
          <Row gap="3" alignItems="center">
            <StatusLight variant="active" />
            <Text>Active</Text>
          </Row>
          <Row gap="3" alignItems="center">
            <StatusLight variant="inactive" />
            <Text>Inactive</Text>
          </Row>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Tooltips"
        description="Hover tooltips for additional information"
        code={`<TooltipTrigger>
  <Button>Hover me</Button>
  <Tooltip>Helpful information</Tooltip>
</TooltipTrigger>`}
      >
        <Row gap="4">
          <TooltipTrigger>
            <Button>Hover for tooltip</Button>
            <Tooltip>This is a helpful tooltip message</Tooltip>
          </TooltipTrigger>

          <TooltipTrigger>
            <Button variant="outline">Another tooltip</Button>
            <Tooltip showArrow>Tooltip with arrow</Tooltip>
          </TooltipTrigger>
        </Row>
      </ShowcaseSection>
    </Column>
  );
}
