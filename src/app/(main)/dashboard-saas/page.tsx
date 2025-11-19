import { Metadata } from 'next';
import { DashboardSaasPage } from './DashboardSaasPage';

export default async function () {
  return <DashboardSaasPage />;
}

export const metadata: Metadata = {
  title: 'Dashboard - SaaS Metrics',
};
