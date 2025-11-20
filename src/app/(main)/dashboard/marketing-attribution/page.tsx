import { Metadata } from 'next';
import { MarketingAttributionPage } from '../MarketingAttributionPage';

export default async function () {
  return <MarketingAttributionPage />;
}

export const metadata: Metadata = {
  title: 'Marketing Attribution - Dashboard',
};
