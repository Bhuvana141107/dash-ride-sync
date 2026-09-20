import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { MapPin, Plus } from "lucide-react";
import { useSimulation } from "@/hooks/use-simulation";
import { store } from "@/lib/simulation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/drivers")({
  head: () => ({
    meta: [
      { title: "Drivers — Rideshare Dispatch System" },
      {
        name: "description",
        content:
          "Driver hash map with O(1) availability lookup and a coordinate grid showing live driver positions.",
      },
      { property: "og:title", content: "Drivers — Rideshare Dispatch System" },
      {
        property: "og:description",
        content:
          "Driver hash map with O(1) availability lookup and a coordinate grid showing live driver positions.",
      },
    ],
  }),
  component: DriversPage,
});

const GRID_MAX = 20;

function DriversPage() {
  const sim = useSimulation();
  const [name, setName] = useState("");
  const [x, setX] = useState("8");
  const [y, setY] = useState("8");

  const addDriver = () => {
    const nx = Number(x);
    const ny = Number(y);
    if (!name.trim()) {
      toast.error("Driver name cannot be empty.");
      return;
    }
    if (!Number.isFinite(nx) || !Number.isFinite(ny) || nx < 0 || ny < 0) {
      toast.error("Driver coordinates must be non-negative numbers.");
      return;
    }
    const driver = store.addDriver(name.trim(), nx, ny);
    store.log(`${driver.driverId} registered in driverMap`, "LOOKUP", "O(1)");
    store.setDriverStatus(driver.driverId, "Available");
    setName("");
    toast.success(`${driver.driverId} added to the driver hash map.`);
  };

  const act = (fn: () => void) => {
    try {
      fn();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Operation failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Drivers</p>
          <p className="text-2xl font-bold">{sim.driverMap.size}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Available</p>
          <p className="text-2xl font-bold text-success">{sim.availableCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Busy</p>
          <p className="text-2xl font-bold text-warning">{sim.busyCount}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold text-card-foreground">
              Register Driver (driverMap.set — O(1))
            </h2>
            <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:items-end">
              <div className="space-y-2">
                <Label htmlFor="dname">Name</Label>
                <Input id="dname" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dx">Location X</Label>
                <Input id="dx" type="number" value={x} onChange={(e) => setX(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dy">Location Y</Label>
                <Input id="dy" type="number" value={y} onChange={(e) => setY(e.target.value)} />
              </div>
              <Button onClick={addDriver}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {sim.drivers.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No drivers yet. Add one or load sample data.
              </p>
            )}
            {sim.drivers.map((d) => (
              <div key={d.driverId} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm font-bold text-primary">{d.driverId}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      d.status === "Available"
                        ? "bg-success/15 text-success"
                        : "bg-warning/15 text-warning"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-card-foreground">{d.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> ({d.locationX}, {d.locationY})
                </p>
                <p className="text-xs text-muted-foreground">
                  Current ride: {d.currentRide ?? "—"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => act(() => store.setDriverStatus(d.driverId, "Available"))}
                  >
                    Set Available
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => act(() => store.setDriverStatus(d.driverId, "Busy"))}
                  >
                    Set Busy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => act(() => store.resetDriver(d.driverId))}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-card-foreground">
            Driver Location Grid (0–{GRID_MAX})
          </h2>
          <div className="relative mt-4 aspect-square w-full rounded-lg border border-border bg-muted/30">
            <div className="absolute left-0 top-1/2 h-px w-full bg-border" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-border" />
            {sim.drivers.map((d) => {
              const left = Math.min(100, Math.max(0, (d.locationX / GRID_MAX) * 100));
              const bottom = Math.min(100, Math.max(0, (d.locationY / GRID_MAX) * 100));
              return (
                <div
                  key={d.driverId}
                  className="absolute -translate-x-1/2 translate-y-1/2 text-center"
                  style={{ left: `${left}%`, bottom: `${bottom}%` }}
                  title={`${d.driverId} (${d.locationX}, ${d.locationY})`}
                >
                  <span
                    className={`block h-3 w-3 rounded-full ${
                      d.status === "Available" ? "bg-success" : "bg-warning"
                    }`}
                  />
                  <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
                    {d.driverId.replace("DRIVER-", "D")}
                  </span>
                </div>
              );
            })}
            <span className="absolute bottom-1 right-2 text-[10px] text-muted-foreground">
              X →
            </span>
            <span className="absolute left-2 top-1 text-[10px] text-muted-foreground">Y ↑</span>
          </div>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Driver Availability Lookup: O(1)
          </p>
        </section>
      </div>
    </div>
  );
}
