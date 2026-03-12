import { Column, ListItem, Row, Select, type SelectProps, Text } from '@umami/react-zen';
import { useState } from 'react';
import { Empty } from '@/components/common/Empty';
import { Favicon } from '@/components/common/Favicon';
import {
  useLoginQuery,
  useMessages,
  useUserWebsitesQuery,
  useWebsiteQuery,
} from '@/components/hooks';
import styles from './WebsiteSelect.module.css';

export function WebsiteSelect({
  websiteId,
  teamId,
  onChange,
  includeTeams,
  ...props
}: {
  websiteId?: string;
  teamId?: string;
  includeTeams?: boolean;
} & SelectProps) {
  const { formatMessage, messages } = useMessages();
  const { data: website } = useWebsiteQuery(websiteId);
  const [selected, setSelected] = useState<{ name: string; domain?: string }>({
    name: website?.name,
    domain: website?.domain,
  });
  const [search, setSearch] = useState('');
  const { user } = useLoginQuery();
  const { data, isLoading } = useUserWebsitesQuery(
    { userId: user?.id, teamId },
    { search, pageSize: 10, includeTeams },
  );
  const listItems: { id: string; name: string; domain?: string }[] = data?.data || [];

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleOpenChange = () => {
    setSearch('');
  };

  const handleChange = (id: string) => {
    const item = listItems.find(item => item.id === id);
    setSelected({ name: item?.name, domain: item?.domain });
    onChange(id);
  };

  const currentName = selected.name || website?.name;
  const currentDomain = selected.domain || website?.domain;

  const renderValue = () => {
    return (
      <Row alignItems="center" gap="2" style={{ maxWidth: 180 }}>
        {currentDomain && <Favicon domain={currentDomain} />}
        <Column gap="0" style={{ minWidth: 0 }}>
          <Text truncate style={{ fontWeight: 500, lineHeight: 1.2 }}>
            {currentName}
          </Text>
          {currentDomain && (
            <Text
              truncate
              style={{ fontSize: 11, color: 'var(--font-color-muted)', lineHeight: 1.2 }}
            >
              {currentDomain}
            </Text>
          )}
        </Column>
      </Row>
    );
  };

  return (
    <Select
      {...props}
      items={listItems}
      value={websiteId}
      isLoading={isLoading}
      allowSearch={true}
      searchValue={search}
      onSearch={handleSearch}
      onChange={handleChange}
      onOpenChange={handleOpenChange}
      renderValue={renderValue}
      listProps={{
        renderEmptyState: () => <Empty message={formatMessage(messages.noResultsFound)} />,
        style: { maxHeight: '400px' },
      }}
    >
      {({ id, name, domain }: any) => (
        <ListItem key={id} textValue={name}>
          <div className={styles.item}>
            <Favicon domain={domain} />
            <div className={styles.details}>
              <span className={styles.name}>{name}</span>
              {domain && <span className={styles.domain}>{domain}</span>}
            </div>
          </div>
        </ListItem>
      )}
    </Select>
  );
}
