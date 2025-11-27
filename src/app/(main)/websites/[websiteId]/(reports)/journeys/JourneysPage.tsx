'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ListItem, Select, Column, Grid, SearchField, AlertBanner, Text, Icon, Row } from '@umami/react-zen';
import { useDateRange, useMessages } from '@/components/hooks';
import { Panel } from '@/components/common/Panel';
import { Journey } from './Journey';
import { WebsiteControls } from '@/app/(main)/websites/[websiteId]/WebsiteControls';
import { FunnelCreationButton } from './FunnelCreationButton';
import { Info } from '@/components/icons';
import { v4 as uuid } from 'uuid';

const JOURNEY_STEPS = [2, 3, 4, 5, 6, 7];
const DEFAULT_STEP = 3;
const FUNNEL_STEPS_MAX = 8;

export function JourneysPage({ websiteId }: { websiteId: string }) {
  const { formatMessage, labels } = useMessages();
  const router = useRouter();
  const {
    dateRange: { startDate, endDate },
  } = useDateRange();
  const [steps, setSteps] = useState(DEFAULT_STEP);
  const [startStep, setStartStep] = useState('');
  const [endStep, setEndStep] = useState('');

  // Funnel creation state
  const [isFunnelCreationMode, setIsFunnelCreationMode] = useState(false);
  const [selectedFunnelSteps, setSelectedFunnelSteps] = useState<
    {
      columnIndex: number;
      type: string;
      value: string;
    }[]
  >([]);

  const handleEnterFunnelCreation = () => {
    setIsFunnelCreationMode(true);
    setSelectedFunnelSteps([]);
  };

  const handleCancelFunnelCreation = () => {
    setIsFunnelCreationMode(false);
    setSelectedFunnelSteps([]);
  };

  const handleNodeClick = (columnIndex: number, type: string, value: string) => {
    // Validate sequential selection
    const expectedColumn = selectedFunnelSteps.length;

    if (columnIndex !== expectedColumn) {
      // User clicked wrong column
      return;
    }

    if (selectedFunnelSteps.length >= FUNNEL_STEPS_MAX) {
      // Max steps reached
      return;
    }

    setSelectedFunnelSteps([...selectedFunnelSteps, { columnIndex, type, value }]);
  };

  const handleSaveFunnel = async () => {
    if (selectedFunnelSteps.length < 2) {
      return; // Validation: minimum 2 steps
    }

    const funnelData = {
      id: uuid(),
      websiteId,
      type: 'funnel',
      name: `Journey Funnel ${new Date().toLocaleDateString()}`,
      description: 'Created from journey visualization',
      parameters: {
        window: 60, // Default 60 minutes
        steps: selectedFunnelSteps.map(step => ({
          type: step.type === 'path' ? 'path' : 'event',
          value: step.value,
        })),
      },
    };

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(funnelData),
      });

      if (response.ok) {
        // Navigate to funnels page
        router.push(`/websites/${websiteId}/funnels`);
      }
    } catch (error) {
      console.error('Failed to create funnel:', error);
    }
  };

  return (
    <Column gap>
      <WebsiteControls websiteId={websiteId} />

      <Row alignItems="center" justifyContent="flex-end">
        <FunnelCreationButton
          isActive={isFunnelCreationMode}
          stepCount={selectedFunnelSteps.length}
          onEnter={handleEnterFunnelCreation}
          onCancel={handleCancelFunnelCreation}
          onSave={handleSaveFunnel}
        />
      </Row>

      <Grid columns="repeat(3, 1fr)" gap>
        <Select
          items={JOURNEY_STEPS}
          label={formatMessage(labels.steps)}
          value={steps}
          defaultValue={steps}
          onChange={setSteps}
          disabled={isFunnelCreationMode}
        >
          {JOURNEY_STEPS.map(step => (
            <ListItem key={step} id={step}>
              {step}
            </ListItem>
          ))}
        </Select>
        <Column>
          <SearchField
            label={formatMessage(labels.startStep)}
            value={startStep}
            onSearch={setStartStep}
            delay={1000}
            disabled={isFunnelCreationMode}
          />
        </Column>
        <Column>
          <SearchField
            label={formatMessage(labels.endStep)}
            value={endStep}
            onSearch={setEndStep}
            delay={1000}
            disabled={isFunnelCreationMode}
          />
        </Column>
      </Grid>

      {isFunnelCreationMode && (
        <AlertBanner variant="info">
          <Icon>
            <Info />
          </Icon>
          <Text>
            Click on journey nodes in order to create a funnel. Select from column{' '}
            {selectedFunnelSteps.length + 1} next. Press ESC to cancel.
          </Text>
        </AlertBanner>
      )}

      <Panel height="900px" allowFullscreen>
        <Journey
          websiteId={websiteId}
          startDate={startDate}
          endDate={endDate}
          steps={steps}
          startStep={startStep}
          endStep={endStep}
          isFunnelCreationMode={isFunnelCreationMode}
          selectedFunnelSteps={selectedFunnelSteps}
          onFunnelNodeClick={handleNodeClick}
          onCancelFunnelCreation={handleCancelFunnelCreation}
        />
      </Panel>
    </Column>
  );
}
