import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Calculator, CheckCircle2, Home, Briefcase } from "lucide-react";
import {
  DEMAND_LEVELS,
  DEMAND_MULTIPLIERS,
  VEHICLES,
  VEHICLE_BY_TYPE,
  calculateFare,
  euclideanDistance,
  loadSurge,
  type DemandLevel,
  type VehicleType,
} from "@/lib/dsa";
import { store } from "@/lib/simulation";
import { useSimulation } from "@/hooks/use-simulation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActivityLog } from "@/components/ActivityLog";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book Ride — Rideshare Dispatch System" },
      {
        name: "description",
        content:
          "Pick a bike, auto, cab or parcel, compute Euclidean distance with live surge pricing, and enqueue the ride.",
      },
      { property: "og:title", content: "Book Ride — Rideshare Dispatch System" },
      {
        property: "og:description",
        content:
          "Pick a bike, auto, cab or parcel, compute Euclidean distance with live surge pricing, and enqueue the ride.",
      },
    ],
  }),
  component: BookRide,
});

function BookRide() {
  const sim = useSimulation();
  const [riderName, setRiderName] = useState("");
  const [px, setPx] = useState("2");
  const [py, setPy] = useState("3");
  const [dx, setDx] = useState("10");
  const [dy, setDy] = useState("8");
  const [demand, setDemand] = useState<DemandLevel>("Normal");
  const [vehicleType, setVehicleType] = useState<VehicleType>("Cab Mini");
  const [showBreakdown, setShowBreakdown] = useState(false);

  const nums = {
    px: Number(px),
    py: Number(py),
    dx: Number(dx),
    dy: Number(dy),
  };
  const valid =
    Object.values(nums).every((n) => Number.isFinite(n)) &&
    px !== "" &&
    py !== "" &&
    dx !== "" &&
    dy !== "";

  const availability = sim.availabilityByVehicle();
  const load = loadSurge(sim.queue.size, sim.availableCount);
  const effectiveName = riderName.trim() || sim.profile.name;

  const { distance, fares } = useMemo(() => {
    if (!valid) {
      return { distance: 0, fares: {} as Record<string, number> };
    }
    const d = euclideanDistance({ x: nums.px, y: nums.py }, { x: nums.dx, y: nums.dy });
    const map: Record<string, number> = {};
    for (const v of VEHICLES) {
      map[v.type] = calculateFare(
        d,
        demand,
        sim.pricing.baseFare,
        sim.pricing.ratePerUnit,
        v.multiplier,
        load,
      );
    }
    return { distance: d, fares: map };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [px, py, dx, dy, demand, sim.pricing.baseFare, sim.pricing.ratePerUnit, load, valid]);

  const vehicle = VEHICLE_BY_TYPE[vehicleType];
  const surge = DEMAND_MULTIPLIERS[demand] * load;
  const fare = fares[vehicleType] ?? 0;

  const useSaved = (place: "home" | "work", field: "pickup" | "drop") => {
    const p = sim.profile[place];
    if (field === "pickup") {
      setPx(String(p.x));
      setPy(String(p.y));
    } else {
      setDx(String(p.x));
      setDy(String(p.y));
    }
  };

  const handleCalculate = () => {
    if (!valid) {
      toast.error("Coordinates must be valid numbers.");
      return;
    }
    setShowBreakdown(true);
    store.log(
      `Fare estimated for ${effectiveName} (${vehicleType}): ₹${fare.toFixed(2)}`,
      "PRICE",
      "O(1)",
    );
    toast.success("Fare calculated from live input.");
  };

  const handleConfirm = () => {
    try {
      const node = store.addRide({
        riderName: effectiveName,
        pickup: { x: nums.px, y: nums.py },
        drop: { x: nums.dx, y: nums.dy },
        demandLevel: demand,
        vehicleType,
      });
      toast.success(`${node.rideId} · ${vehicleType} enqueued at tail — O(1)`);
      setRiderName("");
      setShowBreakdown(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create ride.");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
      <div className="space-y-5 card-elevated rounded-2xl p-5">
        <div>
          <h2 className="text-base font-semibold text-card-foreground">Book a Ride</h2>
          <p className="text-xs text-muted-foreground">
            Next ride ID: <span className="font-mono text-primary">{sim.nextRideId()}</span> ·
            booking as <span className="font-medium">{effectiveName}</span>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rider">Rider Name</Label>
          <Input
            id="rider"
            value={riderName}
            onChange={(e) => setRiderName(e.target.value)}
            placeholder={sim.profile.name}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="px">Pickup X</Label>
            <Input id="px" type="number" value={px} onChange={(e) => setPx(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="py">Pickup Y</Label>
            <Input id="py" type="number" value={py} onChange={(e) => setPy(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dx">Drop X</Label>
            <Input id="dx" type="number" value={dx} onChange={(e) => setDx(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dy">Drop Y</Label>
            <Input id="dy" type="number" value={dy} onChange={(e) => setDy(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => useSaved("home", "pickup")}>
            <Home className="h-3.5 w-3.5" /> Home → Pickup
          </Button>
          <Button size="sm" variant="outline" onClick={() => useSaved("work", "drop")}>
            <Briefcase className="h-3.5 w-3.5" /> Work → Drop
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Choose a Vehicle</Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {VEHICLES.map((v) => {
              const free = availability[v.type] ?? 0;
              const active = vehicleType === v.type;
              return (
                <button
                  key={v.type}
                  type="button"
                  onClick={() => setVehicleType(v.type)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    active
                      ? "border-primary bg-primary/8 shadow-sm"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <span className="text-2xl">{v.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                      {v.type}
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                          free > 0
                            ? "bg-success/12 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {free > 0 ? `${free} nearby` : "none free"}
                      </span>
                    </span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {v.tagline} · {v.capacity ? `${v.capacity} seats` : "parcel"} ·{" "}
                      {v.etaBias + 2} min
                    </span>
                  </span>
                  <span className="text-sm font-bold text-primary">
                    ₹{(fares[v.type] ?? 0).toFixed(0)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Demand Level</Label>
          <div className="flex flex-wrap gap-2">
            {DEMAND_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDemand(level)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  demand === level
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/60"
                }`}
              >
                {level} ×{DEMAND_MULTIPLIERS[level].toFixed(2)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="base">Base Fare (₹)</Label>
            <Input
              id="base"
              type="number"
              value={sim.pricing.baseFare}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (Number.isFinite(v) && v >= 0) store.setPricing({ baseFare: v });
                else toast.error("Base fare must be a non-negative number.");
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rate">Rate per Distance Unit (₹)</Label>
            <Input
              id="rate"
              type="number"
              value={sim.pricing.ratePerUnit}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (Number.isFinite(v) && v >= 0) store.setPricing({ ratePerUnit: v });
                else toast.error("Rate must be a non-negative number.");
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleCalculate}>
            <Calculator className="h-4 w-4" /> Calculate Fare
          </Button>
          <Button onClick={handleConfirm} disabled={!valid}>
            <CheckCircle2 className="h-4 w-4" /> Confirm &amp; Add to Dispatch Queue
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="card-elevated rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-card-foreground">
            Live Estimate · {vehicle.emoji} {vehicleType}
          </h3>
          <div className="mt-3 space-y-2 font-mono text-xs text-muted-foreground">
            <p>
              distance = sqrt(({nums.dx || 0} - {nums.px || 0})² + ({nums.dy || 0} -{" "}
              {nums.py || 0})²)
            </p>
            <p className="text-card-foreground">
              = <span className="text-primary">{distance.toFixed(3)}</span> units · O(1)
            </p>
            <p className="pt-2">
              loadSurge = queueSize / availableDrivers = {sim.queue.size} /{" "}
              {sim.availableCount} → ×{load.toFixed(2)}
            </p>
            <p className="pt-2">fare = (base + distance × rate) × vehicle × surge</p>
            <p className="text-card-foreground">
              = ({sim.pricing.baseFare} + {distance.toFixed(2)} × {sim.pricing.ratePerUnit}) ×{" "}
              {vehicle.multiplier} × {surge.toFixed(2)}
            </p>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Distance</dt>
              <dd className="font-semibold">{distance.toFixed(2)} u</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Base Fare</dt>
              <dd className="font-semibold">₹{sim.pricing.baseFare}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Rate / Unit</dt>
              <dd className="font-semibold">₹{sim.pricing.ratePerUnit}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Vehicle Multiplier</dt>
              <dd className="font-semibold">×{vehicle.multiplier.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Total Surge</dt>
              <dd className="font-semibold text-warning">×{surge.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Final Estimated Fare</dt>
              <dd className="text-lg font-bold text-success">₹{fare.toFixed(2)}</dd>
            </div>
          </dl>
          {showBreakdown && (
            <p className="mt-3 rounded-lg bg-muted/70 p-2 text-xs text-muted-foreground">
              Estimate locked in from current inputs. Changing any field recalculates instantly.
            </p>
          )}
        </div>
        <ActivityLog limit={6} />
      </div>
    </div>
  );
}
