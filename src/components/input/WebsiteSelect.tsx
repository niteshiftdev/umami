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
  const [name, setName] = useState<string>(website?.name);
  const [domain, setDomain] = useState<string>(website?.domain);
  const [search, setSearch] = useState('');
  const { user } = useLoginQuery();
  const { data, isLoading } = useUserWebsitesQuery(
    { userId: user?.id, teamId },
    { search, pageSize: 10, includeTeams },
  );
  const listItems: { id: string; name: string; domain: string }[] = data?.data || [];

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleOpenChange = () => {
    setSearch('');
  };

  const handleChange = (id: string) => {
    const selected = listItems.find(item => item.id === id);
    setName(selected?.name);
    setDomain(selected?.domain);
    onChange(id);
  };

  const renderValue = () => {
    return (
      <Row alignItems="center" gap="2" maxWidth="190px">
        <Favicon domain={domain} style={{ flexShrink: 0 }} />
        <Column gap="0" overflow="hidden">
          <Text truncate weight="bold" size="1">
            {name}
          </Text>
          {domain && (
            <Text truncate color="muted" size="0">
              {domain}
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
          <Row alignItems="center" gap="2">
            <Favicon domain={domain} style={{ flexShrink: 0 }} />
            <Column gap="0" overflow="hidden">
              <Text truncate weight="bold" size="1">
                {name}
              </Text>
              {domain && (
                <Text truncate color="muted" size="0">
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
