import { Column } from '@umami/react-zen';

export default function PrototypesLayout({ children }: { children: React.ReactNode }) {
  return (
    <Column width="100%" minHeight="100vh" backgroundColor="1">
      <Column alignItems="center" flex="1" overflowY="auto">
        {children}
      </Column>
    </Column>
  );
}
