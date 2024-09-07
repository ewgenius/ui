import { useState } from "react";
import { useTimeout } from "./useTimeout";

export function useCopy() {
  const [copied, setCopied] = useState(false);
  const { set } = useTimeout();

  const copy = (value: string) => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      set(() => setCopied(false), 2500);
    }
  };

  return { copy, copied };
}
