import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { MapPin, Plus, Star } from "lucide-react";
import { useSimulation } from "@/hooks/use-simulation";
import { store } from "@/lib/simulation";
import { VEHICLES, VEHICLE_BY_TYPE, type VehicleType } from "@/lib/dsa";
import { LiveMap } from "@/components/LiveMap";
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
          "Live driver map with O(1) availability lookup, on-duty fleet across bikes, autos, cabs and parcel riders.",
      },
      { property: "og:title", content: "Drivers — Rideshare Dispatch System" },
      {
        property: "og:description",
        content:
          "Live driver map with O(1) availability lookup, on-duty fleet across bikes, autos, cabs and parcel riders.",
      },
    ],
  }),
  component: DriversPage,
});

function DriversPage() {
  const sim = useSimulation();
  const [name, setName] = useState("");
  const [x, setX] = useState("8");
  const [y, setY] = useState("8");
  const [plate, setPlate] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("Cab Mini");
  const [filter, setFilter] = useState<"All" | VehicleType>("All");

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
    const driver = store.addDriver(
      name.trim(),
      nx,
      ny,
      vehicleType,
      plate.trim() || "TN 00 XX 0000",
    );
    store.log(
      `${driver.driverId} (${vehicleType}) registered in driverMap`,
      "LOOKUP",
      "O(1)",
    );
    store.setDriverStatus(driver.driverId, "Available");
    setName("");
    setPlate("");
    toast.success(`${driver.driverId} added to the driver hash map.`);
  };

  const act = (fn: () => void) => {
    try {
      fn();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Operation failed.");
    }
  };

  const availability = sim.availabilityByVehicle();
  const visible =
    filter === "All" ? sim.drivers : sim.drivers.filter((d) => d.vehicleType === filter);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="card-elevated rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Total Drivers</p>
          <p className="text-2xl font-bold">{sim.driverMap.size}</p>
        </div>
        <div className="card-elevated rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Available</p>
          <p className="text-2xl font-bold text-success">{sim.availableCount}</p>
        </div>
        <div className="card-elevated rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">On a Trip</p>
          <p className="text-2xl font-bold text-warning">{sim.busyCount}</p>
        </div>
        <div className="card-elevated rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Vehicle Classes</p>
          <p className="text-2xl font-bold text-primary">{VEHICLES.length}</p>
        </div>
      </div>

      <section className="card-elevated rounded-2xl p-4 lg:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold text-card-foreground">
            Live Fleet Map — driver status in real time
          </h2>
          <span className="ml-auto rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
            driverMap.get(id) → O(1)
          </span>
        </div>
        <LiveMap drivers={sim.drivers} rides={sim.rides} height="aspect-[16/9]" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(["All", ...VEHICLES.map((v) => v.type)] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f as "All" | VehicleType)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  filter === f
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/60"
                }`}
              >
                {f === "All" ? "All" : `${VEHICLE_BY_TYPE[f].emoji} ${f}`}
                {f !== "All" && ` · ${availability[f] ?? 0}`}
              </button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {visible.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No drivers in this class yet — register one on the right.
              </p>
            )}
            {visible.map((d) => (
              <div key={d.driverId} className="card-elevated rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm font-bold text-primary">{d.driverId}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      d.status === "Available"
                        ? "bg-success/12 text-success"
                        : "bg-warning/15 text-warning"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-2 text-sm font-medium text-card-foreground">
                  <span className="text-lg">{VEHICLE_BY_TYPE[d.vehicleType]?.emoji}</span>
                  {d.name}
                  <span className="flex items-center gap-0.5 text-xs text-warning">
                    <Star className="h-3 w-3 fill-current" />
                    {d.rating.toFixed(1)}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {d.vehicleType} · {d.vehicleNumber} · {d.trips} trips
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> ({d.locationX}, {d.locationY}) · current ride:{" "}
                  {d.currentRide ?? "—"}
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

        <section className="card-elevated h-fit space-y-3 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-card-foreground">
            Register a New Driver (driverMap.set — O(1))
          </h2>
          <div className="space-y-2">
            <Label htmlFor="dname">Name</Label>
            <Input id="dname" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plate">Vehicle Number</Label>
            <Input
              id="plate"
              value={plate}
              placeholder="TN 09 AB 1234"
              onChange={(e) => setPlate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="dx">Location X</Label>
              <Input id="dx" type="number" value={x} onChange={(e) => setX(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dy">Location Y</Label>
              <Input id="dy" type="number" value={y} onChange={(e) => setY(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Vehicle Class</Label>
            <div className="flex flex-wrap gap-2">
              {VEHICLES.map((v) => (
                <button
                  key={v.type}
                  type="button"
                  onClick={() => setVehicleType(v.type)}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                    vehicleType === v.type
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/60"
                  }`}
                >
                  {v.emoji} {v.type}
                </button>
              ))}
            </div>
          </div>
          <Button className="w-full" onClick={addDriver}>
            <Plus className="h-4 w-4" /> Register Driver
          </Button>
          <p className="font-mono text-xs text-muted-foreground">
            Driver Availability Lookup: O(1)
          </p>
        </section>
      </div>
    </div>
  );
}
