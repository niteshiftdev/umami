'use client';

import { useState } from 'react';
import { Column, Row, Box, Grid, Container, Text } from '@umami/react-zen';
import { ShowcaseSection } from '../components/ShowcaseSection';
import { PropControl } from '../components/PropControl';

export function LayoutShowcase() {
  const [gap, setGap] = useState<any>('3');
  const [padding, setPadding] = useState<any>('4');
  const [justifyContent, setJustifyContent] = useState<any>('start');
  const [alignItems, setAlignItems] = useState<any>('start');

  return (
    <Column gap="8" paddingY="6">
      <ShowcaseSection
        title="Row"
        description="Horizontal flexbox layout - the most common layout component"
        code={`// Basic horizontal layout
<Row gap="3">
  <Button>First</Button>
  <Button>Second</Button>
  <Button>Third</Button>
</Row>

// Space between items
<Row justifyContent="space-between" alignItems="center">
  <Text>Left side</Text>
  <Button>Right side</Button>
</Row>

// Center content
<Row justifyContent="center" alignItems="center" minHeight="200px">
  <Loading />
</Row>

// Responsive gap
<Row gap={{ xs: '2', md: '4', lg: '6' }}>
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</Row>

// Wrap items
<Row gap="3" wrap="wrap">
  {items.map(item => <Card key={item.id}>{item.name}</Card>)}
</Row>`}
      >
        <Column gap="6">
          <Column gap="3" padding="4" backgroundColor="2" borderRadius="2">
            <PropControl
              label="Gap"
              type="select"
              value={gap}
              onChange={setGap}
              options={[
                { value: '0', label: '0' },
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '6', label: '6' },
                { value: '8', label: '8' },
              ]}
            />
            <PropControl
              label="Justify"
              type="select"
              value={justifyContent}
              onChange={setJustifyContent}
              options={[
                { value: 'start', label: 'Start' },
                { value: 'center', label: 'Center' },
                { value: 'end', label: 'End' },
                { value: 'space-between', label: 'Space Between' },
                { value: 'space-around', label: 'Space Around' },
              ]}
            />
            <PropControl
              label="Align"
              type="select"
              value={alignItems}
              onChange={setAlignItems}
              options={[
                { value: 'start', label: 'Start' },
                { value: 'center', label: 'Center' },
                { value: 'end', label: 'End' },
                { value: 'stretch', label: 'Stretch' },
              ]}
            />
          </Column>

          <Row
            gap={gap}
            justifyContent={justifyContent}
            alignItems={alignItems}
            border
            borderRadius="2"
            padding="4"
            minHeight="150px"
          >
            <Box padding="3" backgroundColor="blue" borderRadius="2">
              <Text color="1">Item 1</Text>
            </Box>
            <Box padding="3" backgroundColor="green" borderRadius="2">
              <Text color="1">Item 2</Text>
            </Box>
            <Box padding="3" backgroundColor="orange" borderRadius="2">
              <Text color="1">Item 3</Text>
            </Box>
          </Row>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Column"
        description="Vertical flexbox layout"
        code={`<Column gap="${gap}">...</Column>`}
      >
        <Column
          gap={gap}
          border
          borderRadius="2"
          padding="4"
        >
          <Box padding="3" backgroundColor="blue" borderRadius="2">
            <Text color="1">Item 1</Text>
          </Box>
          <Box padding="3" backgroundColor="green" borderRadius="2">
            <Text color="1">Item 2</Text>
          </Box>
          <Box padding="3" backgroundColor="orange" borderRadius="2">
            <Text color="1">Item 3</Text>
          </Box>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Grid"
        description="CSS Grid layout"
        code='<Grid columns="repeat(3, 1fr)" gap="4">...</Grid>'
      >
        <Grid columns="repeat(3, 1fr)" gap="4">
          <Box padding="6" backgroundColor="blue" borderRadius="2">
            <Text color="1">Grid Item 1</Text>
          </Box>
          <Box padding="6" backgroundColor="green" borderRadius="2">
            <Text color="1">Grid Item 2</Text>
          </Box>
          <Box padding="6" backgroundColor="orange" borderRadius="2">
            <Text color="1">Grid Item 3</Text>
          </Box>
          <Box padding="6" backgroundColor="purple" borderRadius="2">
            <Text color="1">Grid Item 4</Text>
          </Box>
          <Box padding="6" backgroundColor="red" borderRadius="2">
            <Text color="1">Grid Item 5</Text>
          </Box>
          <Box padding="6" backgroundColor="cyan" borderRadius="2">
            <Text color="1">Grid Item 6</Text>
          </Box>
        </Grid>
      </ShowcaseSection>

      <ShowcaseSection
        title="Box with Border & Radius"
        description="Box component with various styling options"
      >
        <Column gap="3">
          <PropControl
            label="Padding"
            type="select"
            value={padding}
            onChange={setPadding}
            options={[
              { value: '2', label: '2' },
              { value: '4', label: '4' },
              { value: '6', label: '6' },
              { value: '8', label: '8' },
            ]}
          />

          <Row gap="4" wrap="wrap">
            <Box padding={padding} border borderRadius="2" backgroundColor="2">
              <Text>Border Radius 2</Text>
            </Box>
            <Box padding={padding} border borderRadius="3" backgroundColor="2">
              <Text>Border Radius 3</Text>
            </Box>
            <Box padding={padding} border borderRadius="full" backgroundColor="2">
              <Text>Border Radius Full</Text>
            </Box>
            <Box padding={padding} border shadow="2" borderRadius="2" backgroundColor="2">
              <Text>With Shadow</Text>
            </Box>
          </Row>
        </Column>
      </ShowcaseSection>

      <ShowcaseSection
        title="Container"
        description="Centered container with max-width"
        code='<Container isCentered>...</Container>'
      >
        <Container isCentered border borderRadius="2" padding="4" backgroundColor="2">
          <Text>Centered container content with automatic max-width constraints</Text>
        </Container>
      </ShowcaseSection>
    </Column>
  );
}
