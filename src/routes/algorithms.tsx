import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { useSimulation } from "@/hooks/use-simulation";
import { DataStructureState } from "@/components/DataStructureState";

export const Route = createFileRoute("/algorithms")({
  head: () => ({
    meta: [
      { title: "Algorithm Visualization — Rideshare Dispatch System" },
      {
        name: "description",
        content:
          "Step-by-step flows for enqueue, dequeue, hash-map cancellation and driver lookup with their complexities.",
      },
      { property: "og:title", content: "Algorithm Visualization — Rideshare Dispatch System" },
      {
        property: "og:description",
        content:
          "Step-by-step flows for enqueue, dequeue, hash-map cancellation and driver lookup with their complexities.",
      },
    ],
  }),
  component: AlgorithmsPage,
});

const FLOWS: Array<{ title: string; steps: string[]; complexity: string; code: string }> = [
  {
    title: "1 · ENQUEUE (add ride)",
    steps: [
      "New ride input",
      "Create RideNode",
      "Insert at tail",
      "Update prev / next pointers",
      "rideMap.set(rideId, node)",
      "Queue updated",
    ],
    complexity: "O(1)",
    code: `ride.prev = tail;
if (tail) tail.next = ride; else head = ride;
tail = ride;
rideMap.set(ride.rideId, ride);
size++;`,
  },
  {
    title: "2 · DEQUEUE (match ride)",
    steps: [
      "Read HEAD",
      "Retrieve first node",
      "head = head.next",
      "head.prev = null (or tail = null)",
      "rideMap.delete(rideId)",
      "Assign driver",
    ],
    complexity: "O(1)",
    code: `const node = head;
head = node.next;
if (head) head.prev = null; else tail = null;
rideMap.delete(node.rideId);
size--;`,
  },
  {
    title: "3 · CANCEL (any position)",
    steps: [
      "Ride ID",
      "rideMap.get(rideId) — hash map lookup",
      "Direct node reference (no traversal)",
      "prev.next = next  |  next.prev = prev",
      "Remove node from list",
      "rideMap.delete(rideId)",
    ],
    complexity: "O(1)",
    code: `const node = rideMap.get(rideId);
const { prev, next } = node;
if (prev) prev.next = next; else head = next;
if (next) next.prev = prev; else tail = prev;
rideMap.delete(rideId);
size--;`,
  },
  {
    title: "4 · DRIVER LOOKUP",
    steps: ["Driver ID", "driverMap.get(driverId)", "Read / update driver status"],
    complexity: "O(1)",
    code: `const driver = driverMap.get(driverId);
driver.status = "Busy";
driver.currentRide = ride.rideId;
driverMap.set(driverId, driver);`,
  },
  {
    title: "5 · PRICE CALCULATION",
    steps: [
      "Pickup & drop coordinates",
      "Euclidean distance",
      "Surge multiplier from demand",
      "fare = base + distance × rate × surge",
    ],
    complexity: "O(1)",
    code: `const d = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
const fare = baseFare + d * ratePerUnit * surge;`,
  },
];

function AlgorithmsPage() {
  const sim = useSimulation();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-2">
        {FLOWS.map((flow) => (
          <section key={flow.title} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-card-foreground">{flow.title}</h2>
              <span className="rounded-full bg-success/15 px-2 py-0.5 font-mono text-xs text-success">
                {flow.complexity}
              </span>
            </div>
            <ol className="mt-4 space-y-1">
              {flow.steps.map((s, i) => (
                <li key={s} className="flex flex-col items-start">
                  <span className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-card-foreground">
                    {s}
                  </span>
                  {i < flow.steps.length - 1 && (
                    <ArrowDown className="ml-4 h-3 w-3 text-muted-foreground" />
                  )}
                </li>
              ))}
            </ol>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-background p-3 font-mono text-[11px] text-muted-foreground">
              {flow.code}
            </pre>
          </section>
        ))}
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-card-foreground">
          Last Cancellation Executed {sim.lastCancelledId && `— ${sim.lastCancelledId}`}
        </h2>
        {sim.lastCancelSteps.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No cancellation performed yet in this session.
          </p>
        ) : (
          <ol className="mt-3 grid gap-2 md:grid-cols-2">
            {sim.lastCancelSteps.map((s) => (
              <li key={s.title} className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-xs font-semibold text-primary">{s.title}</p>
                <p className="font-mono text-xs text-card-foreground">{s.detail}</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <DataStructureState />
    </div>
  );
}
