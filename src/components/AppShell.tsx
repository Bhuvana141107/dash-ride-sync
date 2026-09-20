import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CarFront,
  ListOrdered,
  Users,
  GitBranch,
  Gauge,
  Info,
  Database,
  Play,
  RotateCcw,
  Menu,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { store } from "@/lib/simulation";
import { runDemo } from "@/lib/demo";
import { useSimulation } from "@/hooks/use-simulation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/book", label: "Book Ride", icon: CarFront },
  { to: "/queue", label: "Dispatch Queue", icon: ListOrdered },
  { to: "/drivers", label: "Drivers", icon: Users },
  { to: "/algorithms", label: "Algorithm Visualization", icon: GitBranch },
  { to: "/complexity", label: "Complexity Analysis", icon: Gauge },
  { to: "/about", label: "Project Info", icon: Info },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const sim = useSimulation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSample = () => {
    if (sim.drivers.length > 0 || sim.rides.length > 0) {
      toast.error("Reset the simulation before loading sample data.");
      return;
    }
    store.loadSampleData();
    toast.success("Sample drivers and rides created in the real structures.");
  };

  const handleDemo = async () => {
    if (demoRunning) return;
    setDemoRunning(true);
    try {
      await runDemo((msg) => toast.info(msg));
      toast.success("Demo complete.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Demo failed.");
    } finally {
      setDemoRunning(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <Database className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold tracking-wide text-sidebar-foreground">
            DISPATCH OS
          </span>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-4 w-4 text-sidebar-foreground" />
          </button>
        </div>
        <nav className="space-y-1 p-3">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-sidebar-border p-3">
          <Button variant="secondary" className="w-full justify-start" onClick={handleSample}>
            <Database className="h-4 w-4" /> Load Sample Data
          </Button>
          <Button
            variant="default"
            className="w-full justify-start"
            onClick={handleDemo}
            disabled={demoRunning}
          >
            <Play className="h-4 w-4" /> {demoRunning ? "Demo running…" : "Start Demo"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full justify-start">
                <RotateCcw className="h-4 w-4" /> Reset Simulation
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset the entire simulation?</AlertDialogTitle>
                <AlertDialogDescription>
                  This clears the dispatch queue, both hash maps, all drivers, statistics,
                  the activity log and saved browser data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    store.reset();
                    toast.success("Simulation reset.");
                  }}
                >
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-background/70 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface px-4 lg:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold tracking-wide sm:text-base">
              🚕 RIDESHARE DISPATCH SYSTEM
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              DSA-Powered Real-Time Dispatch
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
            <span className="h-2 w-2 rounded-full bg-success" />
            System Online
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 lg:p-6">{mounted ? children : null}</main>
      </div>
    </div>
  );
}
