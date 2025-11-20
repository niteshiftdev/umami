import { Metadata } from 'next';
import { MarketingAttributionHomePage } from './MarketingAttributionHomePage';

export default async function () {
  return <MarketingAttributionHomePage />;
}

export const metadata: Metadata = {
  title: 'Marketing Attribution Dashboard',
};
