import { Metadata } from 'next';

export default function ({ children }) {
  return children;
}

export const metadata: Metadata = {
  title: {
    template: '%s | Umami Prototypes',
    default: 'Umami Prototypes',
  },
};
