import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Activity,
  BadgeIndianRupee,
  CarFront,
  CheckCircle2,
  Layers,
  UserCheck,
  UserX,
  XCircle,
  Zap,
} from "lucide-react";
import { useSimulation } from "@/hooks/use-simulation";
import { store } from "@/lib/simulation";
import { Button } from "@/components/ui/button";
import { QueueVisualizer } from "@/components/QueueVisualizer";
import { DataStructureState } from "@/components/DataStructureState";
import { ActivityLog } from "@/components/ActivityLog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Rideshare Dispatch System" },
      {
        name: "description",
        content:
          "Live dispatch dashboard showing the real doubly linked list queue, hash map state and driver availability.",
      },
      { property: "og:title", content: "Dashboard — Rideshare Dispatch System" },
      {
        property: "og:description",
        content:
          "Live dispatch dashboard showing the real doubly linked list queue, hash map state and driver availability.",
      },
    ],
  }),
  component: Dashboard,
});

function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "primary" | "success" | "warning" | "destructive" | "accent";
}) {
  const toneClass = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
    accent: "text-accent",
  }[tone];

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/50">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className={`h-4 w-4 ${toneClass}`} />
      </div>
      <p className="mt-2 text-2xl font-bold text-card-foreground">{value}</p>
    </div>
  );
}

function Dashboard() {
  const sim = useSimulation();

  const handleMatch = () => {
    try {
      const { ride, driver } = store.matchNextRide();
      toast.success(`${ride.rideId} matched with ${driver.driverId} (${driver.name})`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Matching failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        <StatCard label="Active Requests" value={sim.rides.length} icon={CarFront} />
        <StatCard
          label="Available Drivers"
          value={sim.availableCount}
          icon={UserCheck}
          tone="success"
        />
        <StatCard label="Busy Drivers" value={sim.busyCount} icon={UserX} tone="warning" />
        <StatCard
          label="Matched Rides"
          value={sim.stats.matched}
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Cancelled Rides"
          value={sim.stats.cancelled}
          icon={XCircle}
          tone="destructive"
        />
        <StatCard label="Queue Size" value={sim.queue.size} icon={Layers} tone="accent" />
        <StatCard
          label="Average Fare"
          value={`₹${sim.averageFare.toFixed(2)}`}
          icon={BadgeIndianRupee}
        />
      </div>

      <section className="rounded-xl border border-border bg-surface p-4 lg:p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Live Dispatch Queue (Doubly Linked List)</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
            traverse O(R)
          </span>
          <Button className="ml-auto" onClick={handleMatch}>
            <Zap className="h-4 w-4" /> Match Next Ride
          </Button>
        </div>
        <QueueVisualizer nodes={sim.rides} />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <DataStructureState />
        <ActivityLog />
      </div>
    </div>
  );
}
