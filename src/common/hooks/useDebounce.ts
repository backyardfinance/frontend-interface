import { type DependencyList, useEffect } from "react";

import { useTimeoutFn } from "./useTimeoutFn";

export type UseDebounceReturn = [() => boolean | null, () => void];

export const useDebounce = (fn: () => void, ms: number = 0, deps: DependencyList = []): UseDebounceReturn => {
  const [isReady, cancel, reset] = useTimeoutFn(fn, ms);

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(reset, deps);

  return [isReady, cancel];
};
