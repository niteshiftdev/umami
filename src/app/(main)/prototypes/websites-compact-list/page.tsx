import { Metadata } from 'next';
import { WebsitesCompactListPage } from './WebsitesCompactListPage';

export const metadata: Metadata = {
  title: 'Websites - Compact List',
};

export default function Page() {
  return <WebsitesCompactListPage />;
}
