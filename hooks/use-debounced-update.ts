import { useRef, useCallback, useEffect } from "react";

type UpdateFunction<T> = (value: T) => Promise<void>;

/**
 * Hook that debounces updates to prevent race conditions from rapid clicks.
 * Stores the latest value in a ref and only sends the final value after
 * the specified delay of inactivity.
 *
 * @param updateFn - The async function to call with the debounced value
 * @param delay - Debounce delay in milliseconds (default: 400ms)
 * @returns A debounced update function
 */
export function useDebouncedUpdate<T>(
  updateFn: UpdateFunction<T>,
  delay: number = 400
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestValueRef = useRef<T | null>(null);
  const updateFnRef = useRef(updateFn);

  // Keep the update function ref current
  useEffect(() => {
    updateFnRef.current = updateFn;
  });

  const debouncedUpdate = useCallback(
    (value: T) => {
      // Store the latest value
      latestValueRef.current = value;

      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        if (latestValueRef.current !== null) {
          updateFnRef.current(latestValueRef.current);
        }
        timeoutRef.current = null;
      }, delay);
    },
    [delay]
  );

  // Flush pending updates on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        // Flush the pending update
        if (latestValueRef.current !== null) {
          updateFnRef.current(latestValueRef.current);
        }
      }
    };
  }, []);

  return debouncedUpdate;
}
