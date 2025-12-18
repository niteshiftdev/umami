'use client';
import { useState } from 'react';
import { ListItem, Select, Column, Grid, SearchField } from '@umami/react-zen';
import { useDateRange, useMessages, useEscapeKey, useNavigation } from '@/components/hooks';
import { Panel } from '@/components/common/Panel';
import { Journey } from './Journey';
import { WebsiteControls } from '@/app/(main)/websites/[websiteId]/WebsiteControls';
import { JourneySaveFunnelButton } from './JourneySaveFunnelButton';

const JOURNEY_STEPS = [2, 3, 4, 5, 6, 7];
const DEFAULT_STEP = 3;

export interface SelectedStep {
  name: string;
  columnIndex: number;
}

export function JourneysPage({ websiteId }: { websiteId: string }) {
  const { formatMessage, labels } = useMessages();
  const {
    dateRange: { startDate, endDate },
  } = useDateRange();
  const { router } = useNavigation();
  const [steps, setSteps] = useState(DEFAULT_STEP);
  const [startStep, setStartStep] = useState('');
  const [endStep, setEndStep] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedSteps, setSelectedSteps] = useState<SelectedStep[]>([]);

  const handleStepSelect = (name: string, columnIndex: number) => {
    // Check if this step is already selected
    const existingIndex = selectedSteps.findIndex(step => step.columnIndex === columnIndex);

    if (existingIndex !== -1) {
      // If clicking the same step, deselect it and all subsequent steps
      const newSteps = selectedSteps.slice(0, existingIndex);
      setSelectedSteps(newSteps);
    } else {
      // Add new step
      setSelectedSteps([...selectedSteps, { name, columnIndex }]);
    }
  };

  const handleEnterSelectionMode = () => {
    setSelectionMode(true);
    setSelectedSteps([]);
  };

  const handleCancelFunnelMode = () => {
    setSelectionMode(false);
    setSelectedSteps([]);
  };

  const handleFunnelSave = () => {
    setSelectionMode(false);
    setSelectedSteps([]);
    // Navigate to funnel page
    router.push(`/websites/${websiteId}/funnels`);
  };

  useEscapeKey(() => {
    if (selectionMode) {
      handleCancelFunnelMode();
    }
  });

  return (
    <Column gap>
      <WebsiteControls websiteId={websiteId}>
        <JourneySaveFunnelButton
          isActive={selectionMode}
          selectedCount={selectedSteps.length}
          selectedSteps={selectedSteps}
          websiteId={websiteId}
          onEnterSelectionMode={handleEnterSelectionMode}
          onCancel={handleCancelFunnelMode}
          onFunnelSave={handleFunnelSave}
        />
      </WebsiteControls>
      <Grid columns="repeat(3, 1fr)" gap>
        <Select
          items={JOURNEY_STEPS}
          label={formatMessage(labels.steps)}
          value={steps}
          defaultValue={steps}
          onChange={setSteps}
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
          />
        </Column>
        <Column>
          <SearchField
            label={formatMessage(labels.endStep)}
            value={endStep}
            onSearch={setEndStep}
            delay={1000}
          />
        </Column>
      </Grid>
      <Panel height="900px" allowFullscreen>
        <Journey
          websiteId={websiteId}
          startDate={startDate}
          endDate={endDate}
          steps={steps}
          startStep={startStep}
          endStep={endStep}
          selectionMode={selectionMode}
          selectedSteps={selectedSteps}
          onStepSelect={handleStepSelect}
        />
      </Panel>
    </Column>
  );
}
