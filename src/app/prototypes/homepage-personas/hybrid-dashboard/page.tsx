import { Metadata } from 'next';
import { HybridDashboardHomePage } from './HybridDashboardHomePage';

export default async function () {
  return <HybridDashboardHomePage />;
}

export const metadata: Metadata = {
  title: 'Hybrid Dashboard',
};
