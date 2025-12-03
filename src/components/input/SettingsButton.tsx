import {
  Icon,
  Button,
  MenuTrigger,
  Popover,
  Menu,
  MenuItem,
  MenuSeparator,
  MenuSection,
} from '@umami/react-zen';
import { useMessages, useLoginQuery, useConfig } from '@/components/hooks';
import {
  LogOut,
  LockKeyhole,
  Settings,
  UserCircle,
  LifeBuoy,
  BookText,
  ExternalLink,
} from '@/components/icons';
import { DOCS_URL } from '@/lib/constants';

export function SettingsButton() {
  const { formatMessage, labels } = useMessages();
  const { user } = useLoginQuery();
  const { cloudMode } = useConfig();

  return (
    <MenuTrigger>
      <Button data-test="button-profile" variant="quiet" autoFocus={false}>
        <Icon>
          <UserCircle />
        </Icon>
      </Button>
      <Popover placement="bottom end">
        <Menu autoFocus="last">
          <MenuSection title={user.username}>
            <MenuSeparator />
            <MenuItem
              id="settings"
              href="/settings"
              icon={<Settings />}
              label={formatMessage(labels.settings)}
            />
            {!cloudMode && user.isAdmin && (
              <MenuItem
                id="admin"
                href="/admin"
                icon={<LockKeyhole />}
                label={formatMessage(labels.admin)}
              />
            )}
            {cloudMode && (
              <>
                <MenuItem
                  id="docs"
                  href={DOCS_URL}
                  target="_blank"
                  icon={<BookText />}
                  label={formatMessage(labels.documentation)}
                >
                  <Icon color="muted">
                    <ExternalLink />
                  </Icon>
                </MenuItem>
                <MenuItem
                  id="support"
                  href="/settings/support"
                  icon={<LifeBuoy />}
                  label={formatMessage(labels.support)}
                />
              </>
            )}
            <MenuSeparator />
            <MenuItem
              id="logout"
              href="/logout"
              icon={<LogOut />}
              label={formatMessage(labels.logout)}
            />
          </MenuSection>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
