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
            <Tab>Buttons</Tab>
            <Tab>Layout</Tab>
            <Tab>Forms</Tab>
            <Tab>Modals</Tab>
            <Tab>Navigation</Tab>
            <Tab>Data Display</Tab>
            <Tab>Typography</Tab>
            <Tab>Feedback</Tab>
            <Tab>Styles</Tab>
          </TabList>

          <TabPanel>
            <ButtonsShowcase />
          </TabPanel>

          <TabPanel>
            <LayoutShowcase />
          </TabPanel>

          <TabPanel>
            <FormsShowcase />
          </TabPanel>

          <TabPanel>
            <ModalsShowcase />
          </TabPanel>

          <TabPanel>
            <NavigationShowcase />
          </TabPanel>

          <TabPanel>
            <DataDisplayShowcase />
          </TabPanel>

          <TabPanel>
            <TypographyShowcase />
          </TabPanel>

          <TabPanel>
            <FeedbackShowcase />
          </TabPanel>

          <TabPanel>
            <StylesShowcase />
          </TabPanel>
        </Tabs>
      </Column>
    </Column>
  );
}
