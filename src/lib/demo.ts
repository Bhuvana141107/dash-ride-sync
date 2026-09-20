import { store } from "./simulation";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Demo mode performs REAL operations on the same DispatchQueue / Maps
 * the rest of the application uses.
 */
export async function runDemo(onStep: (msg: string) => void) {
  store.reset();
  onStep("STEP 1 — On-duty fleet loaded into driverMap");
  await wait(900);

  onStep("STEP 2 — enqueue(RIDE-101) · Cab Mini");
  store.addRide({
    riderName: "Rahul",
    pickup: { x: 2, y: 3 },
    drop: { x: 10, y: 8 },
    demandLevel: "Normal",
    vehicleType: "Cab Mini",
  });
  await wait(900);

  onStep("STEP 3 — enqueue(RIDE-102) · Bike");
  store.addRide({
    riderName: "Priya",
    pickup: { x: 4, y: 9 },
    drop: { x: 14, y: 2 },
    demandLevel: "High",
    vehicleType: "Bike",
  });
  await wait(900);

  onStep("STEP 4 — enqueue(RIDE-103) · Auto");
  store.addRide({
    riderName: "Arjun",
    pickup: { x: 1, y: 1 },
    drop: { x: 6, y: 5 },
    demandLevel: "Very High",
    vehicleType: "Auto",
  });
  await wait(900);

  onStep("STEP 5 — Queue: R101 ↔ R102 ↔ R103");
  await wait(900);

  onStep("STEP 6 — cancel('RIDE-102') via hash map lookup");
  store.cancelRide("RIDE-102");
  await wait(1200);

  onStep("STEP 7 — Pointer reconnection complete, node removed");
  await wait(900);

  onStep("STEP 8 — Queue: R101 ↔ R103");
  await wait(900);

  onStep("STEP 9 — Match Next Ride → dequeue() → nearest Cab Mini");
  store.matchNextRide();
  await wait(900);

  onStep("STEP 10 — RIDE-101 assigned, driver status Available → Busy");
  await wait(900);

  onStep("Demo complete — all operations O(1), space O(R + D)");
}
