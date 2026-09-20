import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Calculator, CheckCircle2 } from "lucide-react";
import {
  DEMAND_LEVELS,
  DEMAND_MULTIPLIERS,
  calculateFare,
  euclideanDistance,
  type DemandLevel,
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
          "Enter pickup and drop coordinates to compute Euclidean distance and a surge-adjusted fare, then enqueue the ride.",
      },
      { property: "og:title", content: "Book Ride — Rideshare Dispatch System" },
      {
        property: "og:description",
        content:
          "Enter pickup and drop coordinates to compute Euclidean distance and a surge-adjusted fare, then enqueue the ride.",
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
  const [showBreakdown, setShowBreakdown] = useState(false);

  const nums = {
    px: Number(px),
    py: Number(py),
    dx: Number(dx),
    dy: Number(dy),
  };
  const valid = Object.values(nums).every((n) => Number.isFinite(n) && px !== "" && py !== "" && dx !== "" && dy !== "");

  const { distance, fare, surge } = useMemo(() => {
    if (!valid) return { distance: 0, fare: 0, surge: DEMAND_MULTIPLIERS[demand] };
    const d = euclideanDistance({ x: nums.px, y: nums.py }, { x: nums.dx, y: nums.dy });
    return {
      distance: d,
      fare: calculateFare(d, demand, sim.pricing.baseFare, sim.pricing.ratePerUnit),
      surge: DEMAND_MULTIPLIERS[demand],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [px, py, dx, dy, demand, sim.pricing.baseFare, sim.pricing.ratePerUnit, valid]);

  const handleCalculate = () => {
    if (!valid) {
      toast.error("Coordinates must be valid numbers.");
      return;
    }
    setShowBreakdown(true);
    store.log(
      `Fare estimated for ${riderName.trim() || "unnamed rider"}: ₹${fare.toFixed(2)}`,
      "PRICE",
      "O(1)",
    );
    toast.success("Fare calculated from live input.");
  };

  const handleConfirm = () => {
    try {
      const node = store.addRide({
        riderName,
        pickup: { x: nums.px, y: nums.py },
        drop: { x: nums.dx, y: nums.dy },
        demandLevel: demand,
      });
      toast.success(`${node.rideId} enqueued at tail — O(1)`);
      setRiderName("");
      setShowBreakdown(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create ride.");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
      <div className="space-y-4 rounded-xl border border-border bg-card p-5">
        <div>
          <h2 className="text-base font-semibold text-card-foreground">Book a Ride</h2>
          <p className="text-xs text-muted-foreground">
            Next ride ID: <span className="font-mono text-primary">{sim.nextRideId()}</span>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rider">Rider Name</Label>
          <Input
            id="rider"
            value={riderName}
            onChange={(e) => setRiderName(e.target.value)}
            placeholder="e.g. Rahul"
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
                    : "border-border bg-muted text-muted-foreground hover:border-primary/60"
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
          <Button onClick={handleConfirm} disabled={!riderName.trim() || !valid}>
            <CheckCircle2 className="h-4 w-4" /> Confirm &amp; Add to Dispatch Queue
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground">Live Estimate</h3>
          <div className="mt-3 space-y-2 font-mono text-xs text-muted-foreground">
            <p>
              distance = sqrt(({nums.dx || 0} - {nums.px || 0})² + ({nums.dy || 0} -{" "}
              {nums.py || 0})²)
            </p>
            <p className="text-card-foreground">
              = <span className="text-primary">{distance.toFixed(3)}</span> units · O(1)
            </p>
            <p className="pt-2">
              fare = base + (distance × rate × surge)
            </p>
            <p className="text-card-foreground">
              = {sim.pricing.baseFare} + ({distance.toFixed(2)} × {sim.pricing.ratePerUnit} ×{" "}
              {surge.toFixed(2)})
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
              <dt className="text-xs text-muted-foreground">Demand</dt>
              <dd className="font-semibold">{demand}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Surge Multiplier</dt>
              <dd className="font-semibold text-warning">×{surge.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Final Estimated Fare</dt>
              <dd className="text-lg font-bold text-success">₹{fare.toFixed(2)}</dd>
            </div>
          </dl>
          {showBreakdown && (
            <p className="mt-3 rounded-lg bg-muted/60 p-2 text-xs text-muted-foreground">
              Estimate locked in from current inputs. Changing any field recalculates instantly.
            </p>
          )}
        </div>
        <ActivityLog limit={6} />
      </div>
    </div>
  );
}
