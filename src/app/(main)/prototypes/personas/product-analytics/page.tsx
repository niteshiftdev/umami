import { Metadata } from 'next';
import { ProductAnalyticsPage } from './ProductAnalyticsPage';

export default function () {
  return <ProductAnalyticsPage />;
}

export const metadata: Metadata = {
  title: 'Product Analytics Dashboard',
};
