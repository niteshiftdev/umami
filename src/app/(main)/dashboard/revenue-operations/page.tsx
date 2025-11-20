import { Metadata } from 'next';
import { RevenueOperationsPage } from '../RevenueOperationsPage';

export default async function () {
  return <RevenueOperationsPage />;
}

export const metadata: Metadata = {
  title: 'Revenue Operations - Dashboard',
};
