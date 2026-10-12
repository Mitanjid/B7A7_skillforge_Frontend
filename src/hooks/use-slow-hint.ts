"use client";

import { useEffect, useState } from "react";

export function useSlowHint(active: boolean, delayMs = 4000) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!active) {
      setSlow(false);
      return;
    }
    const id = setTimeout(() => setSlow(true), delayMs);
    return () => clearTimeout(id);
  }, [active, delayMs]);

  return slow;
}
