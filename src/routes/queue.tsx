import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Trash2, Zap } from "lucide-react";
import { useSimulation } from "@/hooks/use-simulation";
import { store } from "@/lib/simulation";
import { Button } from "@/components/ui/button";
import { QueueVisualizer } from "@/components/QueueVisualizer";
import { DataStructureState } from "@/components/DataStructureState";
import { ActivityLog } from "@/components/ActivityLog";

export const Route = createFileRoute("/queue")({
  head: () => ({
    meta: [
      { title: "Dispatch Queue — Rideshare Dispatch System" },
      {
        name: "description",
        content:
          "Inspect the doubly linked list dispatch queue and cancel any ride in O(1) through direct hash map node access.",
      },
      { property: "og:title", content: "Dispatch Queue — Rideshare Dispatch System" },
      {
        property: "og:description",
        content:
          "Inspect the doubly linked list dispatch queue and cancel any ride in O(1) through direct hash map node access.",
      },
    ],
  }),
  component: QueuePage,
});

function QueuePage() {
  const sim = useSimulation();
  const [highlight, setHighlight] = useState<string | null>(null);

  const handleCancel = (rideId: string) => {
    setHighlight(rideId);
    window.setTimeout(() => {
      try {
        store.cancelRide(rideId);
        toast.success(`${rideId} cancelled — O(1)`);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Cancellation failed.");
      } finally {
        setHighlight(null);
      }
    }, 450);
  };

  const handleMatch = () => {
    try {
      const { ride, driver } = store.matchNextRide();
      toast.success(`${ride.rideId} matched with ${driver.driverId}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Matching failed.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-surface p-4 lg:p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold">Dispatch Queue Visualization</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
            size = {sim.queue.size}
          </span>
          <Button className="ml-auto" onClick={handleMatch}>
            <Zap className="h-4 w-4" /> Match Next Ride
          </Button>
        </div>
        <QueueVisualizer nodes={sim.rides} highlight={highlight} />
      </section>

      <section className="rounded-xl border border-border bg-card p-4 lg:p-5">
        <h2 className="mb-3 text-sm font-semibold text-card-foreground">
          Active Ride Requests (FIFO order)
        </h2>
        {sim.rides.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No ride requests in queue. Book a ride or load sample data.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2">Ride ID</th>
                  <th>Rider</th>
                  <th>Pickup</th>
                  <th>Drop</th>
                  <th>Distance</th>
                  <th>Fare</th>
                  <th>Demand</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {sim.rides.map((r) => (
                  <tr
                    key={r.rideId}
                    className={`border-b border-border/60 transition-colors ${
                      highlight === r.rideId ? "bg-destructive/10" : ""
                    }`}
                  >
                    <td className="py-2 font-mono text-primary">{r.rideId}</td>
                    <td>{r.riderName}</td>
                    <td className="font-mono text-xs">
                      ({r.pickup.x}, {r.pickup.y})
                    </td>
                    <td className="font-mono text-xs">
                      ({r.drop.x}, {r.drop.y})
                    </td>
                    <td>{r.distance.toFixed(2)}</td>
                    <td className="font-semibold">₹{r.fare.toFixed(2)}</td>
                    <td>{r.demandLevel}</td>
                    <td>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                        {r.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancel(r.rideId)}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-border bg-card p-4 lg:p-5">
        <h2 className="text-sm font-semibold text-card-foreground">
          Cancellation Walkthrough {sim.lastCancelledId && `— ${sim.lastCancelledId}`}
        </h2>
        {sim.lastCancelSteps.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Cancel a ride (including one in the middle) to see the real O(1) algorithm steps.
          </p>
        ) : (
          <ol className="mt-3 space-y-2">
            {sim.lastCancelSteps.map((s) => (
              <li key={s.title} className="rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-xs font-semibold text-primary">{s.title}</p>
                <p className="font-mono text-xs text-card-foreground">{s.detail}</p>
              </li>
            ))}
            <li className="rounded-lg border border-success/50 bg-success/10 p-3 text-sm text-success">
              ✓ Ride cancelled successfully — Time Complexity: O(1) (no list traversal)
            </li>
          </ol>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <DataStructureState />
        <ActivityLog />
      </div>
    </div>
  );
}
