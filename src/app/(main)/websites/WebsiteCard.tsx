'use client';

import { Icon } from '@umami/react-zen';
import Link from 'next/link';
import { Favicon } from '@/components/common/Favicon';
import { useNavigation } from '@/components/hooks';
import { ChevronRight, SquarePen } from '@/components/icons';
import styles from './WebsiteCard.module.css';

export function WebsiteCard({
  website,
  showActions = true,
}: {
  website: { id: string; name: string; domain: string };
  showActions?: boolean;
}) {
  const { renderUrl, router } = useNavigation();

  const handleCardClick = () => {
    router.push(renderUrl(`/websites/${website.id}`, false));
  };

  return (
    <div className={styles.card} onClick={handleCardClick} role="link" tabIndex={0}>
      <div className={styles.favicon}>
        <Favicon domain={website.domain} width={24} height={24} />
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{website.name}</div>
        <div className={styles.domain}>{website.domain}</div>
      </div>
      {showActions && (
        <div className={styles.actions}>
          <Link
            href={renderUrl(`/websites/${website.id}/settings`)}
            onClick={e => e.stopPropagation()}
            className={styles.editButton}
          >
            <Icon>
              <SquarePen />
            </Icon>
          </Link>
        </div>
      )}
      <div className={styles.arrow}>
        <ChevronRight size={18} />
      </div>
    </div>
  );
}
