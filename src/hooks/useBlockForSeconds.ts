import { useCallback, useEffect, useRef, useState } from "react";

export function useBlockForSeconds(seconds = 3) {
  const [enabled, setEnabled] = useState(true);
  const timeout = useRef<any>(null);

  useEffect(() => {
    if (!enabled) {
      timeout.current = setTimeout(() => {
        setEnabled(true);
      }, seconds * 1000);
    }

    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [enabled]);

  const block = useCallback(() => {
    setEnabled(false);
  }, []);

  return [enabled, block] as const;
}
