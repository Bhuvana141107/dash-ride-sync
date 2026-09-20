import { Terminal } from "lucide-react";
import { useSimulation } from "@/hooks/use-simulation";

export function ActivityLog({ limit = 12 }: { limit?: number }) {
  const sim = useSimulation();
  const logs = sim.logs.slice(0, limit);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
        <Terminal className="h-4 w-4 text-primary" />
        Activity Log
      </div>
      <div className="max-h-80 space-y-2 overflow-y-auto font-mono text-xs">
        {logs.length === 0 && (
          <p className="text-muted-foreground">No operations recorded yet.</p>
        )}
        {logs.map((l) => (
          <div key={l.id} className="rounded-lg bg-muted/50 p-2">
            <span className="text-muted-foreground">[{l.time}]</span>{" "}
            <span className="text-card-foreground">{l.message}</span>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              Operation: <span className="text-primary">{l.operation}</span> · Complexity:{" "}
              <span className="text-success">{l.complexity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
