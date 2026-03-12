import { DataGrid } from '@/components/common/DataGrid';
import { useLoginQuery, useUserWebsitesQuery } from '@/components/hooks';
import { WebsiteCard } from './WebsiteCard';
import styles from './WebsiteCard.module.css';

function WebsiteCardGrid({
  data,
  showActions,
}: {
  data: any[];
  showActions: boolean;
  displayMode?: string;
}) {
  return (
    <div className={styles.grid}>
      {data.map((website: any) => (
        <WebsiteCard
          key={website.id}
          id={website.id}
          name={website.name}
          domain={website.domain}
          showActions={showActions}
        />
      ))}
    </div>
  );
}

export function WebsitesDataTable({
  userId,
  teamId,
  allowEdit = true,
  allowView = true,
  showActions = true,
}: {
  userId?: string;
  teamId?: string;
  allowEdit?: boolean;
  allowView?: boolean;
  showActions?: boolean;
}) {
  const { user } = useLoginQuery();
  const queryResult = useUserWebsitesQuery({ userId: userId || user?.id, teamId });

  return (
    <DataGrid query={queryResult} allowSearch allowPaging>
      {({ data }) => <WebsiteCardGrid data={data} showActions={showActions} />}
    </DataGrid>
  );
}
