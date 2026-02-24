import { Button, Column, Icon, ListItem, Row, Select, Text } from '@umami/react-zen';
import { useCallback, useState } from 'react';
import { Empty } from '@/components/common/Empty';
import { Favicon } from '@/components/common/Favicon';
import {
  useLoginQuery,
  useMessages,
  useNavigation,
  useUserWebsitesQuery,
} from '@/components/hooks';
import { Plus, X } from '@/components/icons';

interface SelectedWebsite {
  id: string;
  name: string;
  domain: string;
}

export function WebsiteMultiSelect({
  selectedWebsites,
  onAdd,
  onRemove,
  maxSelections = 4,
}: {
  selectedWebsites: SelectedWebsite[];
  onAdd: (website: SelectedWebsite) => void;
  onRemove: (websiteId: string) => void;
  maxSelections?: number;
}) {
  const { formatMessage, labels, messages } = useMessages();
  const { teamId } = useNavigation();
  const { user } = useLoginQuery();
  const [search, setSearch] = useState('');
  const { data, isLoading } = useUserWebsitesQuery(
    { userId: user?.id, teamId },
    { search, pageSize: 20 },
  );
  const listItems: { id: string; name: string; domain: string }[] = data?.data || [];

  const availableItems = listItems.filter(
    item => !selectedWebsites.some(s => s.id === item.id),
  );

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleOpenChange = useCallback(() => {
    setSearch('');
  }, []);

  const handleChange = useCallback(
    (id: string) => {
      const website = listItems.find(item => item.id === id);
      if (website) {
        onAdd({
          id: website.id,
          name: website.name,
          domain: website.domain,
        });
      }
      setSearch('');
    },
    [listItems, onAdd],
  );

  const canAddMore = selectedWebsites.length < maxSelections;

  return (
    <Column gap="3">
      <Row gap="3" wrap="wrap" alignItems="center">
        {selectedWebsites.map(website => (
          <Row
            key={website.id}
            alignItems="center"
            gap="2"
            paddingX="3"
            paddingY="2"
            border
            borderRadius="3"
            backgroundColor
          >
            <Favicon domain={website.domain} />
            <Text size="1" weight="medium">
              {website.name}
            </Text>
            <Button
              size="sm"
              variant="quiet"
              onPress={() => onRemove(website.id)}
            >
              <Icon size="sm">
                <X />
              </Icon>
            </Button>
          </Row>
        ))}

        {canAddMore && (
          <Row width="250px">
            <Select
              items={availableItems}
              label={formatMessage(labels.addWebsite)}
              isLoading={isLoading}
              allowSearch={true}
              searchValue={search}
              onSearch={handleSearch}
              onChange={handleChange}
              onOpenChange={handleOpenChange}
              listProps={{
                renderEmptyState: () => (
                  <Empty message={formatMessage(messages.noResultsFound)} />
                ),
                style: { maxHeight: '300px' },
              }}
            >
              {({ id, name, domain }: any) => (
                <ListItem key={id}>
                  <Row gap="2" alignItems="center">
                    <Favicon domain={domain} />
                    <Text truncate>{name}</Text>
                  </Row>
                </ListItem>
              )}
            </Select>
          </Row>
        )}
      </Row>

      {!canAddMore && (
        <Text size="0" style={{ color: 'var(--font-color-muted)' }}>
          Maximum of {maxSelections} websites can be compared at once
        </Text>
      )}
    </Column>
  );
}
