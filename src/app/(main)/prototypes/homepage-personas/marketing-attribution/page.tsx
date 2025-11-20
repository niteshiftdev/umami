import { Metadata } from 'next';
import { MarketingAttributionPage } from './MarketingAttributionPage';

export default function () {
  return <MarketingAttributionPage />;
}

export const metadata: Metadata = {
  title: 'Marketing Attribution Dashboard',
};
