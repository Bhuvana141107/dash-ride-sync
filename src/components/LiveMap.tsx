import { useState } from "react";
import { VEHICLE_BY_TYPE, type Driver, type RideNode } from "@/lib/dsa";

const GRID_MAX = 20;

/**
 * Live city map. Purely local SVG rendering of the real driverMap / queue
 * coordinates — no external map service.
 */
export function LiveMap({
  drivers,
  rides = [],
  height = "aspect-[4/3]",
}: {
  drivers: Driver[];
  rides?: RideNode[];
  height?: string;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const pos = (v: number) => Math.min(100, Math.max(0, (v / GRID_MAX) * 100));

  return (
    <div className="space-y-3">
      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-border bg-secondary/40 ${height}`}
      >
        {/* city blocks */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in oklab, var(--border) 85%, transparent) 1px, transparent 1px)," +
              "linear-gradient(to bottom, color-mix(in oklab, var(--border) 85%, transparent) 1px, transparent 1px)",
            backgroundSize: "10% 10%",
          }}
        />
        {/* arterial roads */}
        <div className="absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-muted" />
        <div className="absolute left-1/2 top-0 h-full w-2 -translate-x-1/2 rounded-full bg-muted" />
        <div className="absolute left-0 top-1/4 h-1 w-full bg-muted/70" />
        <div className="absolute left-3/4 top-0 h-full w-1 bg-muted/70" />

        {/* pending pickups from the dispatch queue */}
        {rides.map((r) => (
          <div
            key={`p-${r.rideId}`}
            className="absolute -translate-x-1/2 translate-y-1/2"
            style={{ left: `${pos(r.pickup.x)}%`, bottom: `${pos(r.pickup.y)}%` }}
            title={`${r.rideId} pickup — ${r.riderName}`}
          >
            <span className="block h-3 w-3 rotate-45 rounded-sm border-2 border-accent bg-background" />
          </div>
        ))}

        {/* drivers */}
        {drivers.map((d) => {
          const vehicle = VEHICLE_BY_TYPE[d.vehicleType];
          const available = d.status === "Available";
          return (
            <button
              type="button"
              key={d.driverId}
              onMouseEnter={() => setHover(d.driverId)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(d.driverId)}
              onBlur={() => setHover(null)}
              className="absolute -translate-x-1/2 translate-y-1/2 focus:outline-none"
              style={{ left: `${pos(d.locationX)}%`, bottom: `${pos(d.locationY)}%` }}
              aria-label={`${d.name}, ${d.vehicleType}, ${d.status}`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 bg-card text-[13px] shadow-sm ${
                  available
                    ? "border-success text-success ping-dot"
                    : "border-warning text-warning"
                }`}
              >
                {vehicle?.emoji ?? "🚗"}
              </span>
              {hover === d.driverId && (
                <span className="absolute bottom-9 left-1/2 z-10 w-44 -translate-x-1/2 rounded-lg border border-border bg-popover p-2 text-left text-[11px] text-popover-foreground shadow-lg">
                  <span className="block font-semibold">{d.name}</span>
                  <span className="block font-mono text-muted-foreground">
                    {d.driverId} · ({d.locationX}, {d.locationY})
                  </span>
                  <span className="block">
                    {d.vehicleType} · ★ {d.rating.toFixed(1)}
                  </span>
                  <span
                    className={available ? "block text-success" : "block text-warning"}
                  >
                    {d.status}
                    {d.currentRide ? ` · ${d.currentRide}` : ""}
                  </span>
                </span>
              )}
            </button>
          );
        })}

        <span className="absolute bottom-1.5 right-2 text-[10px] text-muted-foreground">
          X →
        </span>
        <span className="absolute left-2 top-1.5 text-[10px] text-muted-foreground">
          Y ↑
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-success" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-warning" /> On a trip
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rotate-45 border-2 border-accent" /> Waiting pickup
        </span>
        <span className="ml-auto font-mono">Driver status lookup: O(1)</span>
      </div>
    </div>
  );
}
