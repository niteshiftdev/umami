import { Metadata } from 'next';
import { MarketingAttributionHome } from './MarketingAttributionHome';

export default function () {
  return <MarketingAttributionHome />;
}

export const metadata: Metadata = {
  title: 'Marketing Attribution Dashboard',
};
