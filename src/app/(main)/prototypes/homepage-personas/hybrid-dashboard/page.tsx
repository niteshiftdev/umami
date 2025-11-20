import { Metadata } from 'next';
import { HybridDashboardPage } from './HybridDashboardPage';

export default function () {
  return <HybridDashboardPage />;
}

export const metadata: Metadata = {
  title: 'Hybrid Dashboard',
};
