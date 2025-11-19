'use client';
import { createContext, useContext, ReactNode } from 'react';

interface ChartThemeContextType {
  theme: string;
}

const ChartThemeContext = createContext<ChartThemeContextType>({ theme: 'default' });

export function ChartThemeProvider({
  theme,
  children,
}: {
  theme: string;
  children: ReactNode;
}) {
  return <ChartThemeContext.Provider value={{ theme }}>{children}</ChartThemeContext.Provider>;
}

export function useChartTheme() {
  return useContext(ChartThemeContext);
}
