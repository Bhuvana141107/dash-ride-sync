import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Project Information — Rideshare Dispatch System" },
      {
        name: "description",
        content:
          "DSA Phase 2 project details: team, core data structures and operations of the rideshare dispatch system.",
      },
      { property: "og:title", content: "Project Information — Rideshare Dispatch System" },
      {
        property: "og:description",
        content:
          "DSA Phase 2 project details: team, core data structures and operations of the rideshare dispatch system.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-bold text-card-foreground">Ride-Sharing Dispatch System</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A High-Performance DSA Design for Real-Time Request Matching &amp; Dynamic Price
          Estimation
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-card-foreground">Team</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>D. Bhuvana — CH.SC.U4CSE25211</li>
          <li>Jyothsna Reddy Anday — CH.SC.U4CSE25219</li>
        </ul>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-card-foreground">Core Data Structures</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>Doubly Linked List (FIFO dispatch queue)</li>
            <li>Hash Map — Ride ID → node reference</li>
            <li>Hash Map — Driver ID → driver record</li>
          </ul>
        </section>
        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-card-foreground">Core Operations</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>Enqueue — O(1)</li>
            <li>Dequeue — O(1)</li>
            <li>Cancel — O(1)</li>
            <li>Driver availability — O(1)</li>
            <li>Price calculation — O(1)</li>
          </ul>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-card-foreground">Persistence</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The simulation state — queue nodes, both hash maps, driver statuses, statistics and the
          activity log — is saved to browser localStorage and restored on refresh. Resetting the
          simulation clears the stored state.
        </p>
      </section>
    </div>
  );
}
