import { Metadata } from 'next';
import { ProductAnalyticsHomePage } from './ProductAnalyticsHomePage';

export default async function () {
  return <ProductAnalyticsHomePage />;
}

export const metadata: Metadata = {
  title: 'Product Analytics Dashboard',
};
