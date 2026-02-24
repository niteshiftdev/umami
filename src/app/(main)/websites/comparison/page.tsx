import type { Metadata } from 'next';
import { ComparisonPage } from './ComparisonPage';

export default function () {
  return <ComparisonPage />;
}

export const metadata: Metadata = {
  title: 'Website Comparison',
};
