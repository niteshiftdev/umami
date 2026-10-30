import { Icon, LoadingButton, Text } from '@umami/react-zen';
import Papa from 'papaparse';
import { useState } from 'react';
import { useApi, useLoginQuery, useMessages } from '@/components/hooks';
import { Download } from '@/components/icons';

const PAGE_SIZE = 100;

export function WebsitesExportButton({ userId, teamId }: { userId?: string; teamId?: string }) {
  const { formatMessage, labels } = useMessages();
  const { user } = useLoginQuery();
  const { get } = useApi();
  const [isLoading, setIsLoading] = useState(false);

  const id = userId || user?.id;
  const url = teamId ? `/teams/${teamId}/websites` : id ? `/users/${id}/websites` : '/me/websites';

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const websites = [];
      let page = 1;
      let count = 0;

      do {
        const result = await get(url, { page, pageSize: PAGE_SIZE });
        const data = result?.data || [];

        if (!data.length) break;

        websites.push(...data);
        count = result?.count || 0;
        page++;
      } while (websites.length < count);

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
    <LoadingButton variant="quiet" isLoading={isLoading} onClick={handleClick}>
      <Icon>
        <Download />
      </Icon>
      <Text>{formatMessage(labels.exportCsv)}</Text>
    </LoadingButton>
  );
}

function downloadCsv(filename: string, data: string) {
  const blob = new Blob([data], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
