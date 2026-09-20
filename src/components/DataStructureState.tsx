import { useSimulation } from "@/hooks/use-simulation";

export function DataStructureState() {
  const sim = useSimulation();
  const rides = sim.rides;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-card-foreground">
        Live Data Structure State
      </h3>

      <div className="mt-3 space-y-4 font-mono text-xs">
        <div>
          <p className="mb-1 text-muted-foreground">A · DISPATCH QUEUE (DLL)</p>
          <p className="break-words rounded-lg bg-muted/50 p-2 text-card-foreground">
            {rides.length
              ? `HEAD → ${rides.map((r) => r.rideId.replace("RIDE-", "R")).join(" ↔ ")} ← TAIL`
              : "HEAD → null ← TAIL"}
          </p>
        </div>

        <div>
          <p className="mb-1 text-muted-foreground">
            B · RIDE HASH MAP ({sim.queue.rideMap.size} entries)
          </p>
          <div className="space-y-1 rounded-lg bg-muted/50 p-2">
            {rides.length === 0 && <p className="text-muted-foreground">empty</p>}
            {rides.map((r) => (
              <p key={r.rideId} className="text-card-foreground">
                {r.rideId} → Node&#123;{r.riderName}&#125;
              </p>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1 text-muted-foreground">
            C · DRIVER HASH MAP ({sim.driverMap.size} entries)
          </p>
          <div className="space-y-1 rounded-lg bg-muted/50 p-2">
            {sim.drivers.length === 0 && <p className="text-muted-foreground">empty</p>}
            {sim.drivers.map((d) => (
              <p key={d.driverId} className="text-card-foreground">
                {d.driverId} →{" "}
                <span className={d.status === "Available" ? "text-success" : "text-warning"}>
                  {d.status}
                </span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
