import { Metadata } from 'next';
import { RevenueOperationsHome } from './RevenueOperationsHome';

export default function () {
  return <RevenueOperationsHome />;
}

export const metadata: Metadata = {
  title: 'Revenue Operations Dashboard',
};
