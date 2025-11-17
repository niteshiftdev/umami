'use client';

import { useState } from 'react';
import { Column, Row, Heading, Tabs, TabList, Tab, TabPanel } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { ButtonsShowcase } from './showcases/ButtonsShowcase';
import { LayoutShowcase } from './showcases/LayoutShowcase';
import { FormsShowcase } from './showcases/FormsShowcase';
import { ModalsShowcase } from './showcases/ModalsShowcase';
import { NavigationShowcase } from './showcases/NavigationShowcase';
import { DataDisplayShowcase } from './showcases/DataDisplayShowcase';
import { TypographyShowcase } from './showcases/TypographyShowcase';
import { FeedbackShowcase } from './showcases/FeedbackShowcase';
import { StylesShowcase } from './showcases/StylesShowcase';

export function DesignSystemPage() {
  return (
    <Column gap="6" paddingBottom="12">
      <PageHeader title="Design System" />

      <Column gap="6" paddingX="6">
        <Heading size="6">
          Explore and interact with all components in the Umami design system
        </Heading>

        <Tabs>
          <TabList>
            <Tab id="buttons">Buttons</Tab>
            <Tab id="layout">Layout</Tab>
            <Tab id="forms">Forms</Tab>
            <Tab id="modals">Modals</Tab>
            <Tab id="navigation">Navigation</Tab>
            <Tab id="data-display">Data Display</Tab>
            <Tab id="typography">Typography</Tab>
            <Tab id="feedback">Feedback</Tab>
            <Tab id="styles">Styles</Tab>
          </TabList>

          <TabPanel id="buttons">
            <ButtonsShowcase />
          </TabPanel>

          <TabPanel id="layout">
            <LayoutShowcase />
          </TabPanel>

          <TabPanel id="forms">
            <FormsShowcase />
          </TabPanel>

          <TabPanel id="modals">
            <ModalsShowcase />
          </TabPanel>

          <TabPanel id="navigation">
            <NavigationShowcase />
          </TabPanel>

          <TabPanel id="data-display">
            <DataDisplayShowcase />
          </TabPanel>

          <TabPanel id="typography">
            <TypographyShowcase />
          </TabPanel>

          <TabPanel id="feedback">
            <FeedbackShowcase />
          </TabPanel>

          <TabPanel id="styles">
            <StylesShowcase />
          </TabPanel>
        </Tabs>
      </Column>
    </Column>
  );
}
