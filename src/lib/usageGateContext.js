import { createContext, useContext } from 'react';

export const UsageGateContext = createContext(null);

export function useUsageGateContext() {
  const ctx = useContext(UsageGateContext);
  if (!ctx) throw new Error('useUsageGateContext must be used inside <UsageGateProvider>');
  return ctx;
}
