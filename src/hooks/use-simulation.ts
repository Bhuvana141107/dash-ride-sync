import { useSyncExternalStore } from "react";
import { store } from "@/lib/simulation";

/** Re-renders whenever the real data structures change. */
export function useSimulation() {
  useSyncExternalStore(store.subscribe, store.getVersion, () => 0);
  return store;
}
