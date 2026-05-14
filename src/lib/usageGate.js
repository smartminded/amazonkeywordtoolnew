// Client-side usage gate.
// After FREE_LIMIT searches, the user must either wait LOCK_DURATION_MS or submit
// an email to keep using the tool. State is persisted to localStorage.
//
// IMPORTANT: this is trivially bypassable (clear storage / incognito / new browser).
// It's a marketing email-capture gate, not a security control.

import { useCallback, useState } from 'react';

const KEY = 'akt-usage-v1';
export const FREE_LIMIT = 2;
export const LOCK_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 1 week

function defaultState() {
  return {
    uses: 0,
    lockedAt: null,    // ISO when the limit was first hit
    unlockedAt: null,  // ISO when the user unlocked via email
    email: null,
  };
}

function safeParse(raw) {
  try {
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

// Read state and auto-reset if the lock has expired.
function read() {
  if (typeof window === 'undefined') return defaultState();
  let s = { ...defaultState(), ...safeParse(localStorage.getItem(KEY)) };
  if (s.lockedAt && !s.unlockedAt) {
    const until = new Date(s.lockedAt).getTime() + LOCK_DURATION_MS;
    if (Date.now() >= until) {
      s = defaultState();
      write(s);
    }
  }
  return s;
}

function write(state) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

function derive(state) {
  if (state.unlockedAt) {
    return { canUse: true, usesLeft: Infinity, lockedUntil: null, isUnlimited: true };
  }
  if (state.lockedAt) {
    return {
      canUse: false,
      usesLeft: 0,
      lockedUntil: new Date(new Date(state.lockedAt).getTime() + LOCK_DURATION_MS),
      isUnlimited: false,
    };
  }
  return {
    canUse: true,
    usesLeft: Math.max(0, FREE_LIMIT - state.uses),
    lockedUntil: null,
    isUnlimited: false,
  };
}

export function useUsageGate() {
  const [state, setState] = useState(read);
  const status = derive(state);

  const recordUse = useCallback(() => {
    setState((prev) => {
      const s = derive(prev);
      // No-op if unlimited or already locked.
      if (s.isUnlimited || !s.canUse) return prev;
      const newUses = prev.uses + 1;
      const next = {
        ...prev,
        uses: newUses,
        lockedAt: newUses >= FREE_LIMIT && !prev.lockedAt ? new Date().toISOString() : prev.lockedAt,
      };
      write(next);
      return next;
    });
  }, []);

  const submitEmail = useCallback(async (email) => {
    const trimmed = (email || '').trim();
    if (!trimmed) throw new Error('EMAIL_REQUIRED');

    const next = {
      ...read(),
      email: trimmed,
      unlockedAt: new Date().toISOString(),
    };
    write(next);
    setState(next);

    // Forward the email to Kit (formerly ConvertKit) via its public Forms API.
    // Host is api.convertkit.com (Kit kept the legacy hostname after rebranding).
    // The Kit API key is intentionally public — it only allows subscribing to forms.
    // Best-effort: if the request fails the user is still unlocked locally;
    // we surface the failure to the console so it doesn't pass silently.
    const kitFormId = import.meta.env.VITE_KIT_FORM_ID;
    const kitApiKey = import.meta.env.VITE_KIT_API_KEY;
    if (kitFormId && kitApiKey) {
      try {
        const res = await fetch(`https://api.convertkit.com/v3/forms/${kitFormId}/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: kitApiKey,
            email: trimmed,
            fields: { source: 'amazon-keyword-tool' },
          }),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.warn(`[usageGate] Kit subscribe failed: ${res.status} ${text}`);
        }
      } catch (err) {
        console.warn('[usageGate] Kit subscribe network error:', err);
      }
    }

    // Optional: also POST to a generic webhook if configured. Useful for logging
    // or forwarding to systems other than Kit.
    const url = import.meta.env.VITE_EMAIL_CAPTURE_URL;
    if (url) {
      try {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmed, source: 'amazon-keyword-tool', ts: new Date().toISOString() }),
        });
      } catch {
        /* ignore */
      }
    }
  }, []);

  return { ...status, recordUse, submitEmail };
}
