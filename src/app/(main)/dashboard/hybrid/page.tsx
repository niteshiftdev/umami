import { Metadata } from 'next';
import { HybridDashboardPage } from '../HybridDashboardPage';

export default async function () {
  return <HybridDashboardPage />;
}

export const metadata: Metadata = {
  title: 'Hybrid Dashboard',
};
