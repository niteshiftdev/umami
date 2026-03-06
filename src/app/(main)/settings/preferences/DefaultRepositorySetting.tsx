import { Button, ListItem, Row, Select } from '@umami/react-zen';
import { useState } from 'react';
import {
  useDefaultRepository,
  useLoginQuery,
  useMessages,
  useUserWebsitesQuery,
} from '@/components/hooks';
import { DEFAULT_REPOSITORY_LAST_USED } from '@/lib/constants';

export function DefaultRepositorySetting() {
  const { formatMessage, labels, messages } = useMessages();
  const { defaultRepository, saveDefaultRepository } = useDefaultRepository();
  const [value, setValue] = useState(defaultRepository);
  const [search, setSearch] = useState('');
  const { user } = useLoginQuery();
  const { data } = useUserWebsitesQuery(
    { userId: user?.id },
    { search, pageSize: 100, includeTeams: true },
  );
  const websites: { id: string; name: string }[] = data?.data || [];

  const handleChange = (id: string) => {
    setValue(id);
    saveDefaultRepository(id);
  };

  const handleReset = () => {
    setValue(DEFAULT_REPOSITORY_LAST_USED);
    saveDefaultRepository(DEFAULT_REPOSITORY_LAST_USED);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setSearch('');
    }
  };

  return (
    <Row gap="3">
      <Select
        value={value}
        onChange={handleChange}
        allowSearch={true}
        onSearch={handleSearch}
        onOpenChange={handleOpenChange}
        listProps={{ style: { maxHeight: 300 } }}
      >
        <ListItem key={DEFAULT_REPOSITORY_LAST_USED} id={DEFAULT_REPOSITORY_LAST_USED}>
          {formatMessage(labels.lastUsed)}
        </ListItem>
        {websites.map((website: any) => (
          <ListItem key={website.id} id={website.id}>
            {website.name}
          </ListItem>
        ))}
      </Select>
      <Button onPress={handleReset}>{formatMessage(labels.reset)}</Button>
    </Row>
  );
}
