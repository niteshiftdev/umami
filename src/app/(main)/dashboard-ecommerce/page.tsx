import { Metadata } from 'next';
import { DashboardEcommercePage } from './DashboardEcommercePage';

export default async function () {
  return <DashboardEcommercePage />;
}

export const metadata: Metadata = {
  title: 'Dashboard - E-commerce Analytics',
};
