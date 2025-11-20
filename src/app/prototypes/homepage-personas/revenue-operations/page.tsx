import { Metadata } from 'next';
import { RevenueOperationsHomePage } from './RevenueOperationsHomePage';

export default async function () {
  return <RevenueOperationsHomePage />;
}

export const metadata: Metadata = {
  title: 'Revenue Operations Dashboard',
};
