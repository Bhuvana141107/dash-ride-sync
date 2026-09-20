import { ArrowLeftRight } from "lucide-react";
import type { RideNode } from "@/lib/dsa";

export function QueueVisualizer({
  nodes,
  highlight,
}: {
  nodes: RideNode[];
  highlight?: string | null;
}) {
  if (!nodes.length) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Queue is empty — HEAD → null ← TAIL
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max items-stretch gap-3">
        <div className="flex flex-col justify-center pr-1 text-xs font-semibold text-success">
          HEAD →
        </div>
        {nodes.map((node, i) => (
          <div key={node.rideId} className="flex items-stretch gap-3">
            <div
              className={`w-44 rounded-xl border p-3 transition-all ${
                highlight === node.rideId
                  ? "border-destructive bg-destructive/10 animate-pulse"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>prev</span>
                <span>next</span>
              </div>
              <p className="mt-1 font-mono text-sm font-bold text-primary">
                {node.rideId}
              </p>
              <p className="text-sm text-card-foreground">{node.riderName}</p>
              <p className="text-xs text-muted-foreground">
                ₹{node.fare.toFixed(2)} · {node.distance.toFixed(2)} u
              </p>
              <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                <span>{node.prev ? node.prev.rideId.replace("RIDE-", "R") : "null"}</span>
                <span>{node.next ? node.next.rideId.replace("RIDE-", "R") : "null"}</span>
              </div>
            </div>
            {i < nodes.length - 1 && (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <ArrowLeftRight className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        <div className="flex flex-col justify-center pl-1 text-xs font-semibold text-warning">
          ← TAIL
        </div>
      </div>
    </div>
  );
}
