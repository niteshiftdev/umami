# Umami Codebase Examples & Patterns

## Current Dashboard Implementation (Minimal)

### File: `/root/umami/src/app/(main)/dashboard/page.tsx`
```typescript
import { Metadata } from 'next';
import { DashboardPage } from './DashboardPage';

export default async function () {
  return <DashboardPage />;
}

export const metadata: Metadata = {
  title: 'Dashboard',
};
```

### File: `/root/umami/src/app/(main)/dashboard/DashboardPage.tsx`
```typescript
'use client';
import { Column } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { useMessages } from '@/components/hooks';
import { PageBody } from '@/components/common/PageBody';

export function DashboardPage() {
  const { formatMessage, labels } = useMessages();

  return (
    <PageBody>
      <Column margin="2">
        <PageHeader title={formatMessage(labels.dashboard)}></PageHeader>
      </Column>
    </PageBody>
  );
}
```

---

## Example: Website Dashboard Page (Rich Content)

### File: `/root/umami/src/app/(main)/websites/[websiteId]/WebsitePage.tsx`
```typescript
'use client';
import { Column } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { WebsiteChart } from './WebsiteChart';
import { WebsiteMetricsBar } from './WebsiteMetricsBar';
import { WebsitePanels } from './WebsitePanels';
import { WebsiteControls } from './WebsiteControls';
import { ExpandedViewModal } from './ExpandedViewModal';

export function WebsitePage({ websiteId }: { websiteId: string }) {
  return (
    <Column gap>
      <WebsiteControls websiteId={websiteId} />
      <WebsiteMetricsBar websiteId={websiteId} showChange={true} />
      <Panel minHeight="520px">
        <WebsiteChart websiteId={websiteId} />
      </Panel>
      <WebsitePanels websiteId={websiteId} />
      <ExpandedViewModal websiteId={websiteId} />
    </Column>
  );
}
```

**Key Pattern**: 
- Controls at top
- Metrics bar
- Chart in Panel
- Multiple detail panels below
- Modal for expanded views

---

## Store Example: Dashboard State Management

### File: `/root/umami/src/store/dashboard.ts`
```typescript
import { create } from 'zustand';
import { DASHBOARD_CONFIG, DEFAULT_WEBSITE_LIMIT } from '@/lib/constants';
import { getItem, setItem } from '@/lib/storage';

export const initialState = {
  showCharts: true,
  limit: DEFAULT_WEBSITE_LIMIT,
  websiteOrder: [],
  websiteActive: [],
  editing: false,
  isEdited: false,
};

const store = create(() => ({ ...initialState, ...getItem(DASHBOARD_CONFIG) }));

export function saveDashboard(settings) {
  store.setState(settings);
  setItem(DASHBOARD_CONFIG, store.getState());
}

export const useDashboard = store;
```

**Usage in Component:**
```typescript
import { useDashboard, saveDashboard } from '@/store/dashboard';

export function MyComponent() {
  const { showCharts, limit } = useDashboard();
  
  const handleToggle = () => {
    saveDashboard({ showCharts: !showCharts });
  };
  
  return <button onClick={handleToggle}>Toggle Charts</button>;
}
```

---

## Hook Examples

### Custom useMessages Hook Pattern
```typescript
import { useMessages } from '@/components/hooks';

export function MyPage() {
  const { formatMessage, labels } = useMessages();
  
  return (
    <div>
      <h1>{formatMessage(labels.dashboard)}</h1>
      <p>{formatMessage(labels.description)}</p>
    </div>
  );
}
```

### Custom useApi Hook Pattern
```typescript
import { useApi } from '@/components/hooks';
import { useQuery, useMutation } from '@tanstack/react-query';

export function MyComponent() {
  const { get, post } = useApi();

  // Pattern 1: Query with React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-data'],
    queryFn: () => get('/api/endpoint'),
  });

  // Pattern 2: Mutation
  const mutation = useMutation({
    mutationFn: (data) => post('/api/resource', data),
  });

  const handleSubmit = async (formData) => {
    await mutation.mutateAsync(formData);
  };

  return <div>{data?.name}</div>;
}
```

### Using Pre-built Query Hooks
```typescript
import { useWebsitesQuery } from '@/components/hooks/queries/useWebsitesQuery';
import { useWebsiteMetricsQuery } from '@/components/hooks/queries/useWebsiteMetricsQuery';

export function MyComponent({ websiteId }) {
  const websitesQuery = useWebsitesQuery();
  const metricsQuery = useWebsiteMetricsQuery(websiteId, { 
    dateRange: '7d' 
  });

  if (websitesQuery.isLoading || metricsQuery.isLoading) {
    return <LoadingPanel />;
  }

  return (
    <div>
      {websitesQuery.data?.map(site => (
        <div key={site.id}>{site.name}</div>
      ))}
      {metricsQuery.data && (
        <div>Visitors: {metricsQuery.data.visitors}</div>
      )}
    </div>
  );
}
```

---

## Form Component Pattern

### Standard Form with Validation
```typescript
'use client';
import { Form, TextField, Button, Select } from '@umami/react-zen';
import { useApi } from '@/components/hooks';

export function MyForm() {
  const { post } = useApi();

  const handleSubmit = async (values) => {
    try {
      const response = await post('/api/resource', values);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <TextField 
        name="name" 
        label="Name"
        placeholder="Enter name"
        required
      />
      <TextField 
        name="email" 
        label="Email"
        type="email"
        required
      />
      <Select 
        name="role" 
        label="Role"
        options={[
          { value: 'admin', label: 'Admin' },
          { value: 'user', label: 'User' },
        ]}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
```

---

## Layout Components Pattern

### Page Structure Template
```typescript
'use client';
import { Column } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { useMessages } from '@/components/hooks';

export function MyPage() {
  const { formatMessage, labels } = useMessages();

  return (
    <PageBody>
      <Column margin="2">
        {/* Header Section */}
        <PageHeader 
          title={formatMessage(labels.myTitle)}
          description="Optional description"
          icon={<MyIcon />}
        >
          {/* Action buttons go here */}
          <Button>Add</Button>
        </PageHeader>

        {/* Content Sections */}
        <Panel>
          <h3>Section 1</h3>
          {/* Content */}
        </Panel>

        <Panel>
          <h3>Section 2</h3>
          {/* More content */}
        </Panel>
      </Column>
    </PageBody>
  );
}
```

---

## Responsive Props Examples

### Responsive Layout
```typescript
import { Column, Row, Grid } from '@umami/react-zen';

export function ResponsiveLayout() {
  return (
    <Grid
      columns={{ xs: '1fr', lg: 'auto 1fr' }}  // Mobile: 1 col, Desktop: 2 cols
      rows={{ xs: 'auto 1fr', lg: '1fr' }}     // Responsive rows
      gap={{ xs: '2', lg: '4' }}               // Spacing
      height={{ xs: 'auto', lg: '100vh' }}     // Full height on desktop
      width="100%"
    >
      {/* Sidebar - hide on mobile, show on desktop */}
      <Column 
        display={{ xs: 'none', lg: 'flex' }}
        width="250px"
        backgroundColor="primary"
      >
        Sidebar
      </Column>

      {/* Main content */}
      <Column 
        paddingX={{ xs: '3', md: '6', lg: '8' }}  // Responsive padding
        paddingY={{ xs: '2', lg: '4' }}           // Different Y padding
        gap={{ xs: '3', lg: '6' }}                // Responsive gap
        overflowY="auto"
      >
        Content Area
      </Column>
    </Grid>
  );
}
```

---

## Global State (Zustand) Examples

### App Store Pattern
```typescript
// /src/store/app.ts
import { create } from 'zustand';

export const useApp = create((set) => ({
  locale: 'en',
  theme: 'light',
  timezone: 'UTC',
  user: null,
  
  setLocale: (locale) => set({ locale }),
  setTheme: (theme) => set({ theme }),
  setUser: (user) => set({ user }),
}));

// Usage in component:
export function MyComponent() {
  const { locale, theme, setTheme } = useApp();
  
  return (
    <button onClick={() => setTheme('dark')}>
      Current theme: {theme}
    </button>
  );
}
```

---

## Data Grid / List Pattern

### DataGrid with Search & Pagination
```typescript
import { DataGrid } from '@/components/common/DataGrid';
import { useWebsitesQuery } from '@/components/hooks/queries/useWebsitesQuery';

export function WebsitesList() {
  const query = useWebsitesQuery();

  return (
    <DataGrid
      query={query}
      allowSearch      // Enable search box
      allowPaging      // Enable pagination
      renderActions={() => (
        <Button>Add Website</Button>
      )}
    >
      {(row) => (
        <Row alignItems="center" gap="2">
          <Text>{row.name}</Text>
          <Text color="muted">{row.domain}</Text>
        </Row>
      )}
    </DataGrid>
  );
}
```

---

## Modal/Dialog Pattern

### Modal Component
```typescript
'use client';
import { Modal, Button } from '@umami/react-zen';
import { useState } from 'react';

export function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Open Modal</Button>
      
      {showModal && (
        <Modal 
          title="My Dialog"
          onClose={() => setShowModal(false)}
        >
          <div>
            <p>Modal content here</p>
            <Button onClick={() => setShowModal(false)}>Close</Button>
          </div>
        </Modal>
      )}
    </>
  );
}
```

---

## API Route Pattern

### Simple API Endpoint
```typescript
// /src/app/api/my-endpoint/route.ts
import { parseRequest } from '@/lib/request';
import { json, error } from '@/lib/response';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export async function POST(request: Request) {
  // Parse and validate request
  const { data, error: parseError } = await parseRequest(request, schema);
  if (parseError) return parseError();

  // Check authentication
  const { auth, error: authError } = await checkAuth(request);
  if (authError) return authError();

  // Business logic
  try {
    // Do something with data
    const result = await db.create({ ...data });
    
    return json(result);
  } catch (err) {
    return error(err.message, 400);
  }
}
```

---

## Messages/i18n Pattern

### Available Messages (Sample)
```typescript
// From /src/components/messages.ts
const labels = defineMessages({
  dashboard: { id: 'label.dashboard', defaultMessage: 'Dashboard' },
  websites: { id: 'label.websites', defaultMessage: 'Websites' },
  analytics: { id: 'label.analytics', defaultMessage: 'Analytics' },
  reports: { id: 'label.reports', defaultMessage: 'Reports' },
  funnels: { id: 'label.funnels', defaultMessage: 'Funnels' },
  revenue: { id: 'label.revenue', defaultMessage: 'Revenue' },
  attribution: { id: 'label.attribution', defaultMessage: 'Attribution' },
  sessions: { id: 'label.sessions', defaultMessage: 'Sessions' },
  events: { id: 'label.events', defaultMessage: 'Events' },
  // ... 400+ more
});

// Usage:
import { useMessages } from '@/components/hooks';

export function MyComponent() {
  const { formatMessage, labels } = useMessages();
  
  return <h1>{formatMessage(labels.dashboard)}</h1>;
}
```

---

## Chart Component Example

### Chart Implementation
```typescript
'use client';
import { LineChart } from '@/components/charts/LineChart';
import { useWebsiteMetricsQuery } from '@/components/hooks/queries/useWebsiteMetricsQuery';

export function VisitorChart({ websiteId }: { websiteId: string }) {
  const { data, isLoading } = useWebsiteMetricsQuery(websiteId, {
    dateRange: '7d',
    interval: 'day',
  });

  if (isLoading) return <LoadingPanel />;

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [{
      label: 'Visitors',
      data: data.map(d => d.visitors),
      borderColor: '#147af3',
      backgroundColor: 'rgba(20, 122, 243, 0.1)',
      tension: 0.4,
    }],
  };

  return <LineChart data={chartData} />;
}
```

---

## Complete Page Example

### Full Page Implementation
```typescript
'use client';
import { Column, Row, Button } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { DataGrid } from '@/components/common/DataGrid';
import { useMessages } from '@/components/hooks';
import { useApi } from '@/components/hooks';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Globe } from '@/components/icons';

export function MyFeaturePage() {
  const { formatMessage, labels } = useMessages();
  const { get, post } = useApi();
  const [showModal, setShowModal] = useState(false);

  // Fetch data
  const { data: items, isLoading, refetch } = useQuery({
    queryKey: ['items'],
    queryFn: () => get('/api/items'),
  });

  // Handle mutations
  const createMutation = useMutation({
    mutationFn: (newItem) => post('/api/items', newItem),
    onSuccess: () => refetch(),
  });

  const handleCreate = async (formData) => {
    await createMutation.mutateAsync(formData);
    setShowModal(false);
  };

  return (
    <PageBody>
      <Column margin="2" gap="4">
        {/* Header */}
        <PageHeader 
          title={formatMessage(labels.websites)}
          description="Manage your tracked websites"
          icon={<Globe />}
        >
          <Button onClick={() => setShowModal(true)}>
            Add Website
          </Button>
        </PageHeader>

        {/* Main Content */}
        <Panel>
          {isLoading ? (
            <LoadingPanel />
          ) : (
            <DataGrid query={{ data: items }} allowSearch>
              {(row) => (
                <Row gap="2">
                  <Text>{row.name}</Text>
                  <Button size="sm">Edit</Button>
                </Row>
              )}
            </DataGrid>
          )}
        </Panel>
      </Column>

      {/* Modal */}
      {showModal && (
        <AddWebsiteModal 
          onClose={() => setShowModal(false)}
          onSubmit={handleCreate}
        />
      )}
    </PageBody>
  );
}
```

---

## CSS Module Example (When Needed)

### MyComponent.module.css
```css
.container {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
}

.header {
  font-size: 1.5rem;
  font-weight: 600;
  border-bottom: 1px solid var(--base-color-4);
  padding-bottom: 1rem;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
}
```

### MyComponent.tsx
```typescript
import styles from './MyComponent.module.css';

export function MyComponent() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>Title</div>
    </div>
  );
}
```

---

## Navigation Pattern

### Using useNavigation Hook
```typescript
import { useNavigation } from '@/components/hooks';

export function MyComponent() {
  const { pathname, query, updateParams, router } = useNavigation();

  const handleFilter = (filter) => {
    const newUrl = updateParams({ filter });
    router.replace(newUrl);
  };

  return (
    <button onClick={() => handleFilter('active')}>
      Filter: {query.filter || 'all'}
    </button>
  );
}
```

