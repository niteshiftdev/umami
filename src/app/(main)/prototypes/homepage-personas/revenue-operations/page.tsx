import { Metadata } from 'next';
import { RevenueOperationsPage } from './RevenueOperationsPage';

export default function () {
  return <RevenueOperationsPage />;
}

export const metadata: Metadata = {
  title: 'Revenue Operations Dashboard',
};
