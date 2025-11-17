import { Metadata } from 'next';
import { DesignSystemPage } from './DesignSystemPage';

export default async function () {
  return <DesignSystemPage />;
}

export const metadata: Metadata = {
  title: 'Design System',
};
