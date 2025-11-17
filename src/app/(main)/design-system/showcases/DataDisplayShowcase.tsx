'use client';

import {
  Column,
  Row,
  DataTable,
  DataColumn,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TableCell,
  List,
  ListItem,
  ListSection,
  DataCard,
  Text,
  Badge,
} from '@umami/react-zen';
import { ShowcaseSection } from '../components/ShowcaseSection';

const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Editor', status: 'Active' },
];

export function DataDisplayShowcase() {
  return (
    <Column gap="8" paddingY="6">
      <ShowcaseSection
        title="DataTable"
        description="Table with automatic responsive card layout"
        code={`<DataTable data={items}>
  <DataColumn id="name" label="Name" />
  <DataColumn id="email" label="Email" />
  <DataColumn id="role" label="Role" />
</DataTable>`}
      >
        <DataTable data={sampleData}>
          <DataColumn id="name" label="Name" width="200px" />
          <DataColumn id="email" label="Email" width="250px" />
          <DataColumn id="role" label="Role" width="120px" />
          <DataColumn id="status" label="Status" width="100px">
            {row => (
              <Text color={row.status === 'Active' ? 'green' : 'muted'}>
                {row.status}
              </Text>
            )}
          </DataColumn>
        </DataTable>
      </ShowcaseSection>

      <ShowcaseSection
        title="Basic Table"
        description="Standard HTML table structure"
        code={`<Table>
  <TableHeader>
    <TableRow>
      <TableColumn>Header</TableColumn>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableColumn>Product</TableColumn>
              <TableColumn align="center">Quantity</TableColumn>
              <TableColumn align="end">Price</TableColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Widget A</TableCell>
              <TableCell align="center">10</TableCell>
              <TableCell align="end">$29.99</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Widget B</TableCell>
              <TableCell align="center">5</TableCell>
              <TableCell align="end">$49.99</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Widget C</TableCell>
              <TableCell align="center">15</TableCell>
              <TableCell align="end">$19.99</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ShowcaseSection>

      <ShowcaseSection
        title="List"
        description="Selectable list component"
        code={`<List items={items}>
  <ListItem id="1">Item 1</ListItem>
  <ListItem id="2">Item 2</ListItem>
</List>`}
      >
        <Column gap="4">
          <List>
            <ListItem id="item1">First Item</ListItem>
            <ListItem id="item2">Second Item</ListItem>
            <ListItem id="item3">Third Item</ListItem>
            <ListItem id="item4">Fourth Item</ListItem>
          </List>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="List with Sections"
        description="Grouped list items"
        code={`<List>
  <ListSection title="Group 1">
    <ListItem id="1">Item 1</ListItem>
  </ListSection>
  <ListSection title="Group 2">
    <ListItem id="2">Item 2</ListItem>
  </ListSection>
</List>`}
      >
        <List>
          <ListSection title="Fruits">
            <ListItem id="apple">Apple</ListItem>
            <ListItem id="banana">Banana</ListItem>
            <ListItem id="orange">Orange</ListItem>
          </ListSection>
          <ListSection title="Vegetables">
            <ListItem id="carrot">Carrot</ListItem>
            <ListItem id="broccoli">Broccoli</ListItem>
            <ListItem id="spinach">Spinach</ListItem>
          </ListSection>
        </List>
      </ShowcaseSection>

      <ShowcaseSection
        title="DataCard"
        description="Key-value pair display card"
        code={`<DataCard
  data={[
    { label: 'Name', value: 'John Doe' },
    { label: 'Email', value: 'john@example.com' }
  ]}
  labelWidth="120px"
/>`}
      >
        <DataCard
          data={[
            { label: 'Full Name', value: 'John Doe' },
            { label: 'Email Address', value: 'john@example.com' },
            { label: 'Phone Number', value: '+1 (555) 123-4567' },
            { label: 'Role', value: 'Administrator' },
            { label: 'Status', value: <Text color="green">Active</Text> },
            { label: 'Last Login', value: '2024-01-15 14:30:00' },
          ]}
          labelWidth="140px"
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Simple Data Cards"
        description="Custom card layouts for displaying data"
      >
        <Row gap="4" wrap="wrap">
          <Column
            gap="2"
            padding="4"
            border
            borderRadius="3"
            backgroundColor="2"
            style={{ minWidth: '200px' }}
          >
            <Text size="2" color="muted" weight="medium">
              Total Users
            </Text>
            <Text size="8" weight="bold">
              1,234
            </Text>
            <Text size="2" color="green">
              +12.5% from last month
            </Text>
          </Column>

          <Column
            gap="2"
            padding="4"
            border
            borderRadius="3"
            backgroundColor="2"
            style={{ minWidth: '200px' }}
          >
            <Text size="2" color="muted" weight="medium">
              Revenue
            </Text>
            <Text size="8" weight="bold">
              $45.2K
            </Text>
            <Text size="2" color="green">
              +8.3% from last month
            </Text>
          </Column>

          <Column
            gap="2"
            padding="4"
            border
            borderRadius="3"
            backgroundColor="2"
            style={{ minWidth: '200px' }}
          >
            <Text size="2" color="muted" weight="medium">
              Active Sessions
            </Text>
            <Text size="8" weight="bold">
              567
            </Text>
            <Text size="2" color="red">
              -3.2% from last month
            </Text>
          </Column>
        </Row>
      </ShowcaseSection>
    </Column>
  );
}
