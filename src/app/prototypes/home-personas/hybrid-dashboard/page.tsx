import { Metadata } from 'next';
import { HybridDashboardHome } from './HybridDashboardHome';

export default function () {
  return <HybridDashboardHome />;
}

export const metadata: Metadata = {
  title: 'Hybrid Dashboard',
};
