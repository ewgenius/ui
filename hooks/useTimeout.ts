import { useRef } from "react";

export function useTimeout() {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const clear = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const set = (callback: (args: void) => void, ms?: number) => {
    clear();
    timeoutRef.current = setTimeout(callback, ms);
  };

  return {
    set,
    clear,
  };
}
