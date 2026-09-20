import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Save, Star, MapPin } from "lucide-react";
import { VEHICLES, VEHICLE_BY_TYPE, type VehicleType } from "@/lib/dsa";
import { store } from "@/lib/simulation";
import { useSimulation } from "@/hooks/use-simulation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Rideshare Dispatch System" },
      {
        name: "description",
        content:
          "Rider profile with saved home and work locations, preferred vehicle class and full ride history.",
      },
      { property: "og:title", content: "My Profile — Rideshare Dispatch System" },
      {
        property: "og:description",
        content:
          "Rider profile with saved home and work locations, preferred vehicle class and full ride history.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const sim = useSimulation();
  const p = sim.profile;
  const [form, setForm] = useState({
    name: p.name,
    phone: p.phone,
    email: p.email,
    homeX: String(p.home.x),
    homeY: String(p.home.y),
    workX: String(p.work.x),
    workY: String(p.work.y),
    preferredVehicle: p.preferredVehicle as VehicleType,
  });

  const save = () => {
    try {
      const nums = [form.homeX, form.homeY, form.workX, form.workY].map(Number);
      if (nums.some((n) => !Number.isFinite(n))) {
        toast.error("Saved place coordinates must be valid numbers.");
        return;
      }
      store.setProfile({
        name: form.name,
        phone: form.phone,
        email: form.email,
        home: { x: nums[0]!, y: nums[1]! },
        work: { x: nums[2]!, y: nums[3]! },
        preferredVehicle: form.preferredVehicle,
      });
      toast.success("Profile saved.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save profile.");
    }
  };

  const matched = sim.history.filter((h) => h.outcome === "Matched");
  const spent = matched.reduce((s, h) => s + h.fare, 0);
  const initials = p.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      <section className="card-elevated flex flex-wrap items-center gap-5 rounded-2xl p-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
          {initials || "R"}
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-card-foreground">{p.name}</h2>
          <p className="text-sm text-muted-foreground">
            {p.phone} · {p.email}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-warning">
            <Star className="h-3.5 w-3.5 fill-current" /> 4.9 rider rating
          </p>
        </div>
        <div className="ml-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Rides</p>
            <p className="text-xl font-bold">{matched.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Spent</p>
            <p className="text-xl font-bold">₹{spent.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cancelled</p>
            <p className="text-xl font-bold text-destructive">
              {sim.history.length - matched.length}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <section className="card-elevated space-y-4 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-card-foreground">Account Details</h3>
          <div className="space-y-2">
            <Label htmlFor="pname">Full Name</Label>
            <Input
              id="pname"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pphone">Phone</Label>
              <Input
                id="pphone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pemail">Email</Label>
              <Input
                id="pemail"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Saved Places</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border p-3">
                <p className="flex items-center gap-1 text-xs font-semibold">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> Home
                </p>
                <div className="mt-2 flex gap-2">
                  <Input
                    aria-label="Home X"
                    type="number"
                    value={form.homeX}
                    onChange={(e) => setForm({ ...form, homeX: e.target.value })}
                  />
                  <Input
                    aria-label="Home Y"
                    type="number"
                    value={form.homeY}
                    onChange={(e) => setForm({ ...form, homeY: e.target.value })}
                  />
                </div>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="flex items-center gap-1 text-xs font-semibold">
                  <MapPin className="h-3.5 w-3.5 text-accent" /> Work
                </p>
                <div className="mt-2 flex gap-2">
                  <Input
                    aria-label="Work X"
                    type="number"
                    value={form.workX}
                    onChange={(e) => setForm({ ...form, workX: e.target.value })}
                  />
                  <Input
                    aria-label="Work Y"
                    type="number"
                    value={form.workY}
                    onChange={(e) => setForm({ ...form, workY: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Preferred Vehicle</Label>
            <div className="flex flex-wrap gap-2">
              {VEHICLES.map((v) => (
                <button
                  key={v.type}
                  type="button"
                  onClick={() => setForm({ ...form, preferredVehicle: v.type })}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    form.preferredVehicle === v.type
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/60"
                  }`}
                >
                  {v.emoji} {v.type}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={save}>
            <Save className="h-4 w-4" /> Save Profile
          </Button>
        </section>

        <section className="card-elevated rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-card-foreground">Ride History</h3>
          {sim.history.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No rides yet. Book one and match it from the dispatch queue.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {sim.history.map((h) => (
                <li key={`${h.rideId}-${h.at}`} className="flex items-center gap-3 py-3">
                  <span className="text-xl">
                    {VEHICLE_BY_TYPE[h.vehicleType]?.emoji ?? "🚗"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-card-foreground">
                      {h.rideId} · {h.riderName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {h.vehicleType} · {h.distance.toFixed(2)} u ·{" "}
                      {h.driverName !== "—" ? `${h.driverName} (${h.driverId})` : "no driver"} ·{" "}
                      {new Date(h.at).toLocaleTimeString("en-GB", { hour12: false })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">₹{h.fare.toFixed(2)}</p>
                    <p
                      className={`text-[11px] ${
                        h.outcome === "Matched" ? "text-success" : "text-destructive"
                      }`}
                    >
                      {h.outcome}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
