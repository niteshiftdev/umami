import { Icon } from '@umami/react-zen';
import { Favicon } from '@/components/common/Favicon';
import { LinkButton } from '@/components/common/LinkButton';
import { useNavigation } from '@/components/hooks';
import { SquarePen } from '@/components/icons';
import styles from './WebsiteCard.module.css';

export function WebsiteCard({
  id,
  name,
  domain,
  showActions = true,
}: {
  id: string;
  name: string;
  domain: string;
  showActions?: boolean;
}) {
  const { router, renderUrl } = useNavigation();

  const handleClick = () => {
    router.push(renderUrl(`/websites/${id}`, false));
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.favicon}>
        <Favicon domain={domain} />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={styles.domain}>{domain}</div>
      </div>
      {showActions && (
        <div className={styles.actions} onClick={e => e.stopPropagation()}>
          <LinkButton href={renderUrl(`/websites/${id}/settings`)} variant="quiet">
            <Icon>
              <SquarePen />
            </Icon>
          </LinkButton>
        </div>
      )}
    </div>
  );
}
