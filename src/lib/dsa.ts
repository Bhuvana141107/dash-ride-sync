/**
 * Core data structures for the Rideshare Dispatch System.
 *
 * - RideNode        : node of a REAL doubly linked list (prev / next pointers)
 * - DispatchQueue   : FIFO queue implemented on top of the doubly linked list
 * - rideMap         : Map<rideId, RideNode>  -> O(1) arbitrary cancellation
 * - driverMap       : Map<driverId, Driver>  -> O(1) availability lookup
 */

export type DemandLevel = "Low" | "Normal" | "High" | "Very High";
export type RideStatus = "Waiting" | "Matched" | "Cancelled";
export type DriverStatus = "Available" | "Busy";

export interface Point {
  x: number;
  y: number;
}

export const DEMAND_MULTIPLIERS: Record<DemandLevel, number> = {
  Low: 1.0,
  Normal: 1.0,
  High: 1.25,
  "Very High": 1.5,
};

export const DEMAND_LEVELS: DemandLevel[] = ["Low", "Normal", "High", "Very High"];

/* ----------------------------- vehicle classes ---------------------------- */

export type VehicleType =
  | "Bike"
  | "Auto"
  | "Cab Mini"
  | "Cab Sedan"
  | "Cab SUV"
  | "Premium"
  | "Parcel";

export interface VehicleClass {
  type: VehicleType;
  emoji: string;
  /** scales both base fare and per-unit rate */
  multiplier: number;
  capacity: number;
  /** minutes of extra pickup delay used in ETA display */
  etaBias: number;
  tagline: string;
}

export const VEHICLES: VehicleClass[] = [
  { type: "Bike", emoji: "🏍️", multiplier: 0.5, capacity: 1, etaBias: 1, tagline: "Cheapest, beats traffic" },
  { type: "Auto", emoji: "🛺", multiplier: 0.7, capacity: 3, etaBias: 2, tagline: "Metered three-wheeler" },
  { type: "Cab Mini", emoji: "🚗", multiplier: 1.0, capacity: 4, etaBias: 3, tagline: "Compact AC hatchback" },
  { type: "Cab Sedan", emoji: "🚙", multiplier: 1.25, capacity: 4, etaBias: 3, tagline: "Extra legroom & boot" },
  { type: "Cab SUV", emoji: "🚐", multiplier: 1.6, capacity: 6, etaBias: 4, tagline: "Groups and luggage" },
  { type: "Premium", emoji: "🏎️", multiplier: 2.0, capacity: 4, etaBias: 5, tagline: "Top-rated captains" },
  { type: "Parcel", emoji: "📦", multiplier: 0.6, capacity: 0, etaBias: 2, tagline: "Send a package" },
];

export const VEHICLE_BY_TYPE: Record<VehicleType, VehicleClass> = VEHICLES.reduce(
  (acc, v) => {
    acc[v.type] = v;
    return acc;
  },
  {} as Record<VehicleType, VehicleClass>,
);

/** Euclidean distance -> O(1) */
export function euclideanDistance(a: Point, b: Point): number {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

/**
 * Demand-based load surge from the design doc:
 *   surge = queue size ÷ available drivers, clamped to [1.0, 2.0]   -> O(1)
 */
export function loadSurge(queueSize: number, availableDrivers: number): number {
  if (queueSize <= 0) return 1;
  if (availableDrivers <= 0) return 2;
  const raw = queueSize / availableDrivers;
  return Math.round(Math.min(2, Math.max(1, raw)) * 100) / 100;
}

/** Fare = (base + distance × rate) × vehicle × demand surge × load surge -> O(1) */
export function calculateFare(
  distance: number,
  demand: DemandLevel,
  baseFare: number,
  ratePerUnit: number,
  vehicleMultiplier = 1,
  load = 1,
): number {
  const surge = (DEMAND_MULTIPLIERS[demand] ?? 1) * (load || 1);
  const fare =
    (baseFare + Math.max(0, distance) * ratePerUnit) * vehicleMultiplier * surge;
  return Math.round(fare * 100) / 100;
}

/** A real doubly linked list node. */
export class RideNode {
  rideId: string;
  riderName: string;
  pickup: Point;
  drop: Point;
  distance: number;
  fare: number;
  demandLevel: DemandLevel;
  vehicleType: VehicleType;
  status: RideStatus;
  createdAt: number;
  assignedDriverId: string | null = null;
  prev: RideNode | null = null;
  next: RideNode | null = null;

  constructor(init: {
    rideId: string;
    riderName: string;
    pickup: Point;
    drop: Point;
    distance: number;
    fare: number;
    demandLevel: DemandLevel;
    vehicleType?: VehicleType;
    status?: RideStatus;
    createdAt?: number;
    assignedDriverId?: string | null;
  }) {
    this.rideId = init.rideId;
    this.riderName = init.riderName;
    this.pickup = init.pickup;
    this.drop = init.drop;
    this.distance = init.distance;
    this.fare = init.fare;
    this.demandLevel = init.demandLevel;
    this.vehicleType = init.vehicleType ?? "Cab Mini";
    this.status = init.status ?? "Waiting";
    this.createdAt = init.createdAt ?? Date.now();
    this.assignedDriverId = init.assignedDriverId ?? null;
  }
}

export interface Driver {
  driverId: string;
  name: string;
  locationX: number;
  locationY: number;
  status: DriverStatus;
  currentRide: string | null;
  vehicleType: VehicleType;
  vehicleNumber: string;
  rating: number;
  trips: number;
}

/** FIFO dispatch queue backed by a doubly linked list + hash map. */
export class DispatchQueue {
  head: RideNode | null = null;
  tail: RideNode | null = null;
  size = 0;
  /** rideId -> actual node reference (direct access, no traversal) */
  rideMap: Map<string, RideNode> = new Map();

  /** Insert at tail. O(1) */
  enqueue(ride: RideNode): RideNode {
    if (this.rideMap.has(ride.rideId)) {
      throw new Error(`Duplicate Ride ID: ${ride.rideId}`);
    }
    ride.prev = this.tail;
    ride.next = null;
    if (this.tail) {
      this.tail.next = ride;
    } else {
      this.head = ride;
    }
    this.tail = ride;
    this.rideMap.set(ride.rideId, ride);
    this.size++;
    return ride;
  }

  /** Remove from head. O(1) */
  dequeue(): RideNode | null {
    const node = this.head;
    if (!node) return null;
    this.head = node.next;
    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }
    node.prev = null;
    node.next = null;
    this.rideMap.delete(node.rideId);
    this.size--;
    return node;
  }

  /** Remove any node by direct reference. O(1) — no traversal. */
  remove(node: RideNode): RideNode {
    const prev = node.prev;
    const next = node.next;

    if (prev) prev.next = next;
    else this.head = next;

    if (next) next.prev = prev;
    else this.tail = prev;

    node.prev = null;
    node.next = null;
    this.rideMap.delete(node.rideId);
    this.size--;
    return node;
  }

  /** Hash-map lookup + pointer surgery. O(1) — no traversal. */
  cancel(rideId: string): RideNode | null {
    const node = this.rideMap.get(rideId); // STEP: hash map lookup
    if (!node) return null;
    this.remove(node);
    node.status = "Cancelled";
    return node;
  }

  /** First ride in FIFO order. O(1) */
  peek(): RideNode | null {
    return this.head;
  }

  isEmpty(): boolean {
    return this.head === null;
  }

  /** Linked-list traversal for display. O(R) */
  getAllRequests(): RideNode[] {
    const out: RideNode[] = [];
    let cur = this.head;
    while (cur) {
      out.push(cur);
      cur = cur.next;
    }
    return out;
  }
}
