'use client';
import { type ReactNode, useEffect, useRef, useState } from 'react';

export function LazyLoad({
  children,
  rootMargin = '200px',
  placeholder,
}: {
  children: ReactNode;
  rootMargin?: string;
  placeholder?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  if (visible) {
    return <>{children}</>;
  }

  return <div ref={ref}>{placeholder}</div>;
}
