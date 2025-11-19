import { Metadata } from 'next';
import { DashboardCreatorPage } from './DashboardCreatorPage';

export default async function () {
  return <DashboardCreatorPage />;
}

export const metadata: Metadata = {
  title: 'Dashboard - Creator Analytics',
};
