import { Button, Icon, Text } from '@umami/react-zen';
import Papa from 'papaparse';
import { useState } from 'react';
import { useApi, useLoginQuery, useMessages } from '@/components/hooks';
import { Download } from '@/components/icons';
import { downloadCsv } from '@/components/input/DownloadButton';

const PAGE_SIZE = 100;

export function WebsitesExportButton({ teamId }: { teamId?: string }) {
  const { formatMessage, labels } = useMessages();
  const { user } = useLoginQuery();
  const { get } = useApi();
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllWebsites = async () => {
    const url = teamId ? `/teams/${teamId}/websites` : `/users/${user.id}/websites`;
    const { data, count } = await get(url, { pageSize: PAGE_SIZE });

    // Fetch everything in a single page since paged results have no stable order
    const websites = count > data.length ? (await get(url, { pageSize: count })).data : data;

    return websites.sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const websites = await fetchAllWebsites();

      downloadCsv(
        'websites.csv',
        Papa.unparse({
          fields: ['name', 'domain', 'created_at'],
          data: websites.map(({ name, domain, createdAt }) => [name, domain, createdAt]),
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleClick} isDisabled={isLoading || !user}>
      <Icon>
        <Download />
      </Icon>
      <Text>{formatMessage(labels.exportCsv)}</Text>
    </Button>
  );
}
