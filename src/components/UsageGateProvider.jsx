import { useCallback, useState } from 'react';
import { useUsageGate } from '@/lib/usageGate';
import { UsageGateContext } from '@/lib/usageGateContext';
import UsageLockModal from './UsageLockModal';

export default function UsageGateProvider({ children }) {
  const gate = useUsageGate();
  const [modalOpen, setModalOpen] = useState(false);

  // Tabs call this before running a search. Returns `true` when the search
  // should proceed; opens the modal and returns `false` otherwise.
  const requestUse = useCallback(() => {
    if (gate.canUse) return true;
    setModalOpen(true);
    return false;
  }, [gate.canUse]);

  const value = {
    canUse: gate.canUse,
    usesLeft: gate.usesLeft,
    lockedUntil: gate.lockedUntil,
    isUnlimited: gate.isUnlimited,
    requestUse,
    recordUse: gate.recordUse,
    submitEmail: gate.submitEmail,
  };

  return (
    <UsageGateContext.Provider value={value}>
      {children}
      {modalOpen && (
        <UsageLockModal
          lockedUntil={gate.lockedUntil}
          onSubmitEmail={gate.submitEmail}
          onClose={() => setModalOpen(false)}
        />
      )}
    </UsageGateContext.Provider>
  );
}
