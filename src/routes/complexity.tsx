import { createFileRoute } from "@tanstack/react-router";
import { useSimulation } from "@/hooks/use-simulation";

export const Route = createFileRoute("/complexity")({
  head: () => ({
    meta: [
      { title: "Complexity Analysis — Rideshare Dispatch System" },
      {
        name: "description",
        content:
          "Time and space complexity of every dispatch operation, plus why a doubly linked list and hash maps were chosen.",
      },
      { property: "og:title", content: "Complexity Analysis — Rideshare Dispatch System" },
      {
        property: "og:description",
        content:
          "Time and space complexity of every dispatch operation, plus why a doubly linked list and hash maps were chosen.",
      },
    ],
  }),
  component: ComplexityPage,
});

const ROWS = [
  ["Enqueue (add ride)", "Doubly Linked List", "O(1)"],
  ["Dequeue (match ride)", "Doubly Linked List", "O(1)"],
  ["Cancel any ride", "Hash Map + Doubly Linked List", "O(1)"],
  ["Driver availability lookup", "Hash Map", "O(1)"],
  ["Price calculation", "Mathematical calculation", "O(1)"],
  ["Display / traverse queue", "Doubly Linked List", "O(R)"],
];

const WHY = [
  {
    title: "Doubly Linked List",
    points: [
      "Maintains strict FIFO order of ride requests.",
      "Insertion at tail in constant time.",
      "Removal from head in constant time.",
      "prev + next pointers allow removal of any node without traversal.",
    ],
  },
  {
    title: "Hash Map (rideMap)",
    points: [
      "Direct lookup of a ride by Ride ID.",
      "Stores Ride ID → actual node reference.",
      "Avoids searching the queue when cancelling.",
      "Keeps cancellation at O(1) regardless of queue length.",
    ],
  },
  {
    title: "Hash Map (driverMap)",
    points: [
      "Driver ID → driver object in constant time.",
      "Status updates (Available ↔ Busy) are O(1).",
      "Availability scan is bounded by driver count D, not ride count R.",
    ],
  },
  {
    title: "FIFO Queue & Euclidean Distance",
    points: [
      "Earliest request is always matched first — fair sequential dispatch.",
      "Euclidean distance is a constant-time coordinate calculation.",
      "Linked-list traversal is used only when rendering the queue, O(R).",
    ],
  },
];

function ComplexityPage() {
  const sim = useSimulation();
  const R = sim.queue.size;
  const D = sim.driverMap.size;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-card-foreground">Time Complexity</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-2">Operation</th>
                <th>Data Structure</th>
                <th className="text-right">Time Complexity</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([op, ds, c]) => (
                <tr key={op} className="border-b border-border/60">
                  <td className="py-2">{op}</td>
                  <td className="text-muted-foreground">{ds}</td>
                  <td className="text-right font-mono text-success">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          R = number of active ride requests (currently {R}) · D = registered drivers (currently{" "}
          {D})
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-card-foreground">Space Complexity — O(R + D)</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>The doubly linked list stores one node per active ride request → O(R).</li>
          <li>The ride hash map stores one Ride ID → node reference per active ride → O(R).</li>
          <li>The driver hash map stores one record per registered driver → O(D).</li>
          <li>
            Total: O(R) + O(R) + O(D) = <span className="font-mono text-primary">O(R + D)</span>.
            Current usage: R = {R}, D = {D}.
          </li>
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-card-foreground">Why These Data Structures?</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {WHY.map((w) => (
            <div key={w.title} className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-sm font-semibold text-primary">{w.title}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                {w.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-card-foreground">
          Standard Queue vs Proposed Hybrid Design
        </h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm font-semibold">Standard Queue</p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>Enqueue → O(1)</li>
              <li>Dequeue → O(1)</li>
              <li>Arbitrary cancellation → must first locate the request</li>
            </ul>
          </div>
          <div className="rounded-lg border border-primary/50 bg-primary/10 p-4">
            <p className="text-sm font-semibold text-primary">
              Proposed: Doubly Linked List + Hash Map
            </p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>DLL maintains FIFO order and supports pointer-based removal.</li>
              <li>Hash map locates the exact node directly by Ride ID.</li>
              <li>Cancellation therefore completes in O(1) after direct node lookup.</li>
            </ul>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          The advantage comes from combining the two structures: neither alone gives both ordered
          FIFO dispatch and constant-time removal of an arbitrary request.
        </p>
      </section>
    </div>
  );
}
