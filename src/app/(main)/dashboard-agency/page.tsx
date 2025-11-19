import { Metadata } from 'next';
import { DashboardAgencyPage } from './DashboardAgencyPage';

export default async function () {
  return <DashboardAgencyPage />;
}

export const metadata: Metadata = {
  title: 'Dashboard - Marketing Agency',
};
