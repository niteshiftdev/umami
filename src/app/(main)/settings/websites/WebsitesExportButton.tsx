import { Button, Icon, Text } from '@umami/react-zen';
import Papa from 'papaparse';
import { useState } from 'react';
import { useApi, useMessages } from '@/components/hooks';
import { Download } from '@/components/icons';
import { downloadCsv } from '@/components/input/DownloadButton';

const PAGE_SIZE = 100;

export function WebsitesExportButton({ userId, teamId }: { userId?: string; teamId?: string }) {
  const { formatMessage, labels } = useMessages();
  const { get } = useApi();
  const [isLoading, setIsLoading] = useState(false);

  const url = teamId
    ? `/teams/${teamId}/websites`
    : userId
      ? `/users/${userId}/websites`
      : '/me/websites';

  const handleClick = async () => {
    setIsLoading(true);

    try {
      // The websites API has no stable sort order, so paging across requests could
      // skip or duplicate rows. Fetch everything in a single request instead.
      let result = await get(url, { pageSize: PAGE_SIZE });

      if (result?.count > result?.data?.length) {
        result = await get(url, { pageSize: result.count });
      }

      const websites = result?.data ?? [];

      const csv = Papa.unparse({
        fields: [
          formatMessage(labels.name),
          formatMessage(labels.domain),
          formatMessage(labels.created),
        ],
        data: websites.map(({ name, domain, createdAt }) => [name, domain, createdAt]),
      });

      downloadCsv('websites.csv', csv);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} isDisabled={isLoading}>
      <Icon>
        <Download />
      </Icon>
      <Text>{formatMessage(labels.exportCsv)}</Text>
    </Button>
  );
}
