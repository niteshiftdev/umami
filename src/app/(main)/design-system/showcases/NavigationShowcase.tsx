'use client';

import {
  Column,
  Row,
  Menu,
  MenuItem,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Breadcrumbs,
  Breadcrumb,
  Text,
  Icon,
} from '@umami/react-zen';
import { Home, Settings, User, FileText, LogOut } from '@/components/icons';
import { ShowcaseSection } from '../components/ShowcaseSection';

export function NavigationShowcase() {
  return (
    <Column gap="8" paddingY="6">
      <ShowcaseSection
        title="Dropdown Menu"
        description="Menu component with items and sections"
        code={`<MenuTrigger>
  <Button>Open Menu</Button>
  <Menu>
    <MenuItem>Action 1</MenuItem>
    <MenuItem>Action 2</MenuItem>
  </Menu>
</MenuTrigger>`}
      >
        <Row gap="3" wrap="wrap">
          <MenuTrigger>
            <Button>Simple Menu</Button>
            <Menu>
              <MenuItem>New File</MenuItem>
              <MenuItem>Open File</MenuItem>
              <MenuItem>Save</MenuItem>
              <MenuSeparator />
              <MenuItem>Exit</MenuItem>
            </Menu>
          </MenuTrigger>

          <MenuTrigger>
            <Button variant="outline">Menu with Icons</Button>
            <Menu>
              <MenuItem icon={<Home />} label="Home" />
              <MenuItem icon={<User />} label="Profile" />
              <MenuItem icon={<Settings />} label="Settings" />
              <MenuSeparator />
              <MenuItem icon={<LogOut />} label="Logout" />
            </Menu>
          </MenuTrigger>

          <MenuTrigger>
            <Button variant="outline">Menu with Sections</Button>
            <Menu>
              <MenuSection title="Actions">
                <MenuItem icon={<FileText />}>New Document</MenuItem>
                <MenuItem icon={<FileText />}>Open Document</MenuItem>
              </MenuSection>
              <MenuSection title="Settings">
                <MenuItem icon={<Settings />}>Preferences</MenuItem>
                <MenuItem icon={<User />}>Account</MenuItem>
              </MenuSection>
            </Menu>
          </MenuTrigger>
        </Row>
      </ShowcaseSection>

      <ShowcaseSection
        title="Tabs"
        description="Tabbed interface component"
        code={`<Tabs>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanel>Content 1</TabPanel>
  <TabPanel>Content 2</TabPanel>
</Tabs>`}
      >
        <Tabs>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Analytics</Tab>
            <Tab>Settings</Tab>
            <Tab>Help</Tab>
          </TabList>

          <TabPanel>
            <Column gap="4" paddingY="4">
              <Text size="5" weight="bold">
                Overview
              </Text>
              <Text>This is the overview tab content. It shows general information.</Text>
            </Column>
          </TabPanel>

          <TabPanel>
            <Column gap="4" paddingY="4">
              <Text size="5" weight="bold">
                Analytics
              </Text>
              <Text>Analytics data and charts would be displayed here.</Text>
            </Column>
          </TabPanel>

          <TabPanel>
            <Column gap="4" paddingY="4">
              <Text size="5" weight="bold">
                Settings
              </Text>
              <Text>Configuration and preferences options go here.</Text>
            </Column>
          </TabPanel>

          <TabPanel>
            <Column gap="4" paddingY="4">
              <Text size="5" weight="bold">
                Help
              </Text>
              <Text>Help documentation and support resources.</Text>
            </Column>
          </TabPanel>
        </Tabs>
      </ShowcaseSection>

      <ShowcaseSection
        title="Breadcrumbs"
        description="Breadcrumb navigation component"
        code={`<Breadcrumbs>
  <Breadcrumb href="/">Home</Breadcrumb>
  <Breadcrumb href="/docs">Docs</Breadcrumb>
  <Breadcrumb>Current</Breadcrumb>
</Breadcrumbs>`}
      >
        <Column gap="4">
          <Breadcrumbs>
            <Breadcrumb href="/">Home</Breadcrumb>
            <Breadcrumb href="/design-system">Design System</Breadcrumb>
            <Breadcrumb>Navigation</Breadcrumb>
          </Breadcrumbs>

          <Breadcrumbs>
            <Breadcrumb href="/">
              <Icon size="sm">
                <Home />
              </Icon>
            </Breadcrumb>
            <Breadcrumb href="/settings">Settings</Breadcrumb>
            <Breadcrumb href="/settings/profile">Profile</Breadcrumb>
            <Breadcrumb>Edit</Breadcrumb>
          </Breadcrumbs>
        </Column>
      </ShowcaseSection>
    </Column>
  );
}
