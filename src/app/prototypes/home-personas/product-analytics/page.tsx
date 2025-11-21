import { Metadata } from 'next';
import { ProductAnalyticsHome } from './ProductAnalyticsHome';

export default function () {
  return <ProductAnalyticsHome />;
}

export const metadata: Metadata = {
  title: 'Product Analytics Dashboard',
};
