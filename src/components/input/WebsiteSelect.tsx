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

  const renderValue = () => {
    return (
      <Row gap="2" alignItems="center" className={styles.selectedValue}>
        <Favicon domain={selected.domain || selected.name} width={20} height={20} />
        <Column gap="0" overflow="hidden">
          <Text weight="bold" truncate>
            {selected.name}
          </Text>
          {selected.domain && (
            <Text size="1" color="muted" truncate>
              {selected.domain}
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
        <ListItem key={id} className={styles.listItem}>
          <Row gap="2" alignItems="center">
            <Favicon domain={domain || name} width={16} height={16} />
            <Column gap="0" overflow="hidden">
              <Text truncate>{name}</Text>
              {domain && (
                <Text size="1" color="muted" truncate>
                  {domain}
                </Text>
              )}
            </Column>
          </Row>
        </ListItem>
      )}
    </Select>
  );
}
