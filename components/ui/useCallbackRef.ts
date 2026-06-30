import { useCallback, useLayoutEffect, useRef } from "react";

/**
 * Returns a stable function identity that always calls the latest `callback`.
 *
 * Lets an effect depend on a handler (e.g. Modal's `onClose`) without re-running
 * every time the parent passes a freshly-created closure — the effect sets up
 * once, while still calling the current callback. Standard pattern; kept as a
 * `.ts` helper (not a component) so the design-system parity check ignores it.
 */
export function useCallbackRef<Args extends unknown[], Return>(
  callback: (...args: Args) => Return
): (...args: Args) => Return {
  const ref = useRef(callback);

  useLayoutEffect(() => {
    ref.current = callback;
  });

  return useCallback((...args: Args) => ref.current(...args), []);
}
