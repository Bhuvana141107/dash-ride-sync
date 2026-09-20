# Swift Dispatch

Build a complete, fully functional, interactive web application called:

============================================================

🚕 RIDESHARE DISPATCH SYSTEM

============================================================

Subtitle:

“DSA-Powered Real-Time Request Matching & Dynamic Price Estimation”

This is a DSA Phase 2 academic project.

The application must be a REAL WORKING WEB APPLICATION, not a static website, mockup, UI prototype, or collection of fake animations.

The application must accept dynamic user input, process it using REAL data structures and algorithms implemented in JavaScript/TypeScript, generate dynamic outputs, and update the interface immediately.

The main DSA concept is:

DOUBLY LINKED LIST + HASH MAP

for efficient ride request management and O(1) cancellation.

The project also uses:

- Hash Map for driver availability

- FIFO queue behavior for sequential ride matching

- Euclidean distance calculation

- Dynamic fare calculation

- Queue operations

- Linked-list traversal for visualization

============================================================

1. PROJECT OBJECTIVE

============================================================

Build a ride-sharing dispatch simulation that demonstrates how data structures can efficiently manage real-time ride requests.

The application must allow a user to:

1. Create a ride request.

2. Calculate distance dynamically.

3. Calculate dynamic fare.

4. Add the request to a FIFO dispatch queue.

5. View the actual Doubly Linked List.

6. Cancel ANY ride, including a ride in the middle of the queue.

7. Perform cancellation using a Hash Map that stores direct references to Doubly Linked List nodes.

8. Match the first ride with an available driver.

9. Track driver availability using a Hash Map.

10. View algorithm steps.

11. View time and space complexity.

12. Load sample data.

13. Run an interactive demo.

14. Reset the entire simulation.

15. Persist simulation data using localStorage.

The application must demonstrate the actual DSA implementation rather than merely displaying a visual representation.

============================================================

2. TECHNOLOGY

============================================================

Use:

- React

- Vite

- TypeScript

- Tailwind CSS or clean CSS

- Lucide React icons

No backend is required.

Use browser localStorage for persistence.

The application must run using:

npm install

npm run dev

Do not require any paid APIs.

Do not require Google Maps API.

Do not require Firebase.

Do not require a backend server.

The entire core DSA simulation must work locally in the browser.

============================================================

3. VERY IMPORTANT — ACTUAL DATA STRUCTURES

============================================================

DO NOT fake the DSA implementation.

DO NOT simply use an Array and call it a linked list.

Implement a REAL Doubly Linked List class.

Create:

class RideNode

with:

- rideId

- riderName

- pickup

- drop

- distance

- fare

- demandLevel

- status

- prev

- next

Create:

class DispatchQueue

with:

- head

- tail

- size

Methods:

- enqueue(ride)

- dequeue()

- cancel(rideId)

- peek()

- isEmpty()

- getAllRequests()

The queue must actually use:

head

tail

prev

next

pointers.

============================================================

4. DOUBLY LINKED LIST

============================================================

The dispatch queue must maintain strict FIFO order.

Example:

HEAD

 ↓

RIDE-101

 ↕

RIDE-102

 ↕

RIDE-103

 ↕

RIDE-104

 ↓

TAIL

Each node must contain:

prev ← NODE → next

When a new ride is added:

enqueue()

must insert the node at the tail.

Complexity:

O(1)

When the first ride is matched:

dequeue()

must remove the node at the head.

Complexity:

O(1)

When a ride is cancelled:

cancel(rideId)

must remove the corresponding node without traversing the entire list.

Complexity:

O(1)

============================================================

5. HASH MAP FOR RIDE CANCELLATION

============================================================

Create an actual JavaScript Map:

const rideMap = new Map();

Store:

rideId → actual RideNode reference

Example:

rideMap.set("RIDE-101", node);

This is critical.

When the user cancels:

RIDE-103

the application must:

1. Perform:

rideMap.get("RIDE-103")

2. Retrieve the actual node reference.

3. Access:

node.prev

node.next

4. Reconnect the surrounding nodes.

5. Remove the node from the Doubly Linked List.

6. Delete the Hash Map entry:

rideMap.delete("RIDE-103")

7. Update the UI.

DO NOT search through the linked list to find the ride.

The purpose of the Hash Map is direct node access.

Display:

Cancellation Time Complexity: O(1)

============================================================

6. DRIVER HASH MAP

============================================================

Create another actual JavaScript Map:

const driverMap = new Map();

Use:

driverId → driver object

Each driver must contain:

- driverId

- name

- locationX

- locationY

- status

- currentRide

Possible status:

- Available

- Busy

Example:

DRIVER-01 → Available

DRIVER-02 → Busy

DRIVER-03 → Available

Driver lookup and status updates must use the Hash Map.

Display:

Driver Availability Lookup: O(1)

============================================================

7. REAL DYNAMIC DATA — VERY IMPORTANT

============================================================

The application must NOT use hardcoded outputs.

All important outputs must depend on the user's input and current application state.

For example:

If the user enters:

Rider Name:

Rahul

Pickup:

2,3

Drop:

10,8

Demand:

High

the application must dynamically calculate:

- Distance

- Surge multiplier

- Fare

- Ride ID

- Ride status

Then create a real RideNode and add it to the real DispatchQueue.

If the user creates another ride, the queue must actually change.

If the user cancels a ride, the actual data structure must change.

If the user matches a ride, the actual driver status must change.

Nothing should be pre-scripted except the optional sample-data/demo feature.

============================================================

8. APPLICATION LAYOUT

============================================================

Create a professional dashboard.

Main navigation/sidebar:

1. Dashboard

2. Book Ride

3. Dispatch Queue

4. Drivers

5. Algorithm Visualization

6. Complexity Analysis

Header:

RIDESHARE DISPATCH SYSTEM

Subtitle:

DSA-Powered Real-Time Dispatch

Show:

🟢 System Online

Also include:

- Load Sample Data

- Start Demo

- Reset Simulation

============================================================

9. DASHBOARD

============================================================

Create a dashboard containing:

STATISTICS CARDS:

- Active Ride Requests

- Available Drivers

- Busy Drivers

- Completed Rides

- Cancelled Rides

- Queue Size

- Average Fare

These values must be dynamically calculated from the actual application state.

Do NOT hardcode the numbers.

============================================================

10. LIVE DISPATCH QUEUE

============================================================

Show the actual current queue.

Example:

HEAD

RIDE-101

Rider: Rahul

Fare: ₹180

Status: Waiting

↓

RIDE-102

Rider: Priya

Fare: ₹220

Status: Waiting

↓

RIDE-103

Rider: Arjun

Fare: ₹150

Status: Waiting

TAIL

Each ride should have:

- Ride ID

- Rider

- Pickup

- Drop

- Distance

- Fare

- Demand

- Status

- Cancel button

The order must be the actual linked-list order.

============================================================

11. BOOK RIDE PAGE

============================================================

Create a working form.

Fields:

Rider Name

Pickup X

Pickup Y

Drop X

Drop Y

Demand Level

Demand options:

Low

Normal

High

Very High

Button:

CALCULATE FARE

Then show:

Distance

Base Fare

Rate per Distance Unit

Demand Level

Surge Multiplier

Final Estimated Fare

Button:

CONFIRM & ADD TO DISPATCH QUEUE

When clicked:

1. Generate a unique Ride ID.

2. Calculate distance.

3. Calculate fare.

4. Create a RideNode.

5. Enqueue the node.

6. Add rideId → node to rideMap.

7. Update queue.

8. Update statistics.

9. Add activity log.

10. Show success notification.

============================================================

12. DISTANCE CALCULATION

============================================================

Use Euclidean distance:

distance =

sqrt((x2 - x1)^2 + (y2 - y1)^2)

Display the formula clearly.

Example:

Pickup = (2,3)

Drop = (10,8)

Distance:

sqrt((10-2)^2 + (8-3)^2)

The result must be calculated dynamically.

Complexity:

O(1)

============================================================

13. DYNAMIC PRICING

============================================================

Use a simple transparent pricing formula:

Fare =

Base Fare +

(Distance × Rate Per Unit × Surge Multiplier)

Suggested default values:

Base Fare = ₹50

Rate Per Unit = ₹15

Demand multipliers:

Low = 1.0

Normal = 1.0

High = 1.25

Very High = 1.50

Make these values configurable in the UI.

If the user changes:

Pickup

Drop

Demand

the fare must change automatically.

Do NOT use fake predetermined fares.

============================================================

14. DISPATCH MATCHING

============================================================

Create:

MATCH NEXT RIDE

button.

When clicked:

1. Check if queue is empty.

2. If empty, show:

“No ride requests in queue.”

3. Check driverMap for an Available driver.

4. If no driver is available, show:

“No drivers currently available.”

Do NOT remove the ride from the queue in this case.

5. If a driver is available:

   - Take the first queue node.

   - Dequeue it.

   - Assign it to the driver.

   - Change driver status to Busy.

   - Change ride status to Matched.

   - Increment completed/matched count.

   - Add activity log.

   - Update UI.

The first ride must always be processed first.

This demonstrates FIFO behavior.

============================================================

15. DRIVER PAGE

============================================================

Create a Drivers page.

Display driver cards/table.

Each driver should show:

Driver ID

Driver Name

Location

Status

Current Ride

Example:

DRIVER-01

Ravi

Location: (5,8)

Status: Available

Buttons:

Set Available

Set Busy

Reset Driver

All status changes must update the actual driverMap.

Show:

Total Drivers

Available

Busy

These numbers must be calculated dynamically.

============================================================

16. DRIVER LOCATION VISUALIZATION

============================================================

Create a simple coordinate-based visual panel.

Do NOT use an external map.

Show drivers as points on a coordinate grid.

Example:

          Y

          ↑

     D2 ●

          |

          |

 D1 ●─────┼─────● D3

          |

          |

          └────────→ X

The positions must correspond to the actual driver coordinates.

If driver coordinates change, the visualization should update.

============================================================

17. DISPATCH QUEUE VISUALIZATION

============================================================

Create a dedicated visual representation of the actual Doubly Linked List.

Example:

                  DISPATCH QUEUE

HEAD                                               TAIL

 ↓                                                   ↓

┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐

│ R101    │ ↔  │ R102    │ ↔  │ R103    │ ↔  │ R104    │

│ Rahul   │    │ Priya   │    │ Arjun   │    │ Neha    │

└─────────┘    └─────────┘    └─────────┘    └─────────┘

Show:

← prev

next →

The visualization must be generated from the actual linked-list nodes.

Do not hardcode the diagram.

============================================================

18. CANCELLATION DEMONSTRATION

============================================================

This is one of the MOST IMPORTANT parts of the project.

Suppose:

R101 ↔ R102 ↔ R103 ↔ R104

User clicks:

Cancel R103

Show an algorithm visualization:

STEP 1

User requests cancellation:

R103

↓

STEP 2

Hash Map lookup:

rideMap.get("R103")

↓

STEP 3

Actual node found.

↓

STEP 4

Access:

R103.prev

R103.next

↓

STEP 5

Reconnect:

R102.next = R104

R104.prev = R102

↓

STEP 6

Delete:

rideMap.delete("R103")

↓

FINAL:

R101 ↔ R102 ↔ R104

Display:

✓ Ride cancelled successfully

Time Complexity: O(1)

The UI should animate/highlight the node being removed.

============================================================

19. DATA STRUCTURE STATE PANEL

============================================================

Create a panel called:

LIVE DATA STRUCTURE STATE

Show actual current values.

SECTION A:

DISPATCH QUEUE

HEAD → R101 ↔ R102 ↔ R104 ← TAIL

SECTION B:

RIDE HASH MAP

R101 → Node

R102 → Node

R104 → Node

SECTION C:

DRIVER HASH MAP

DRIVER-01 → Available

DRIVER-02 → Busy

DRIVER-03 → Available

These must update whenever the underlying data changes.

============================================================

20. ALGORITHM VISUALIZATION PAGE

============================================================

Create a professional algorithm visualization page.

SECTION 1 — ENQUEUE

Show:

New Ride

↓

Create RideNode

↓

Insert at Tail

↓

Update prev/next

↓

Add rideId → node to Hash Map

↓

Queue Updated

Display:

Time Complexity: O(1)

SECTION 2 — DEQUEUE

Show:

HEAD

↓

Retrieve first node

↓

Update HEAD

↓

Remove node

↓

Assign Driver

Display:

Time Complexity: O(1)

SECTION 3 — CANCEL

Show:

Ride ID

↓

Hash Map Lookup

↓

Direct Node Reference

↓

Update Previous/Next

↓

Remove Node

↓

Delete Hash Map Entry

Display:

Time Complexity: O(1)

SECTION 4 — DRIVER LOOKUP

Show:

Driver ID

↓

Hash Map Lookup

↓

Driver Status

Display:

Time Complexity: O(1)

============================================================

21. COMPLEXITY ANALYSIS PAGE

============================================================

Create a clear complexity table.

Operation | Data Structure | Time Complexity

Enqueue | Doubly Linked List | O(1)

Dequeue | Doubly Linked List | O(1)

Cancel | Hash Map + Doubly Linked List | O(1)

Driver Availability | Hash Map | O(1)

Price Calculation | Mathematical Calculation | O(1)

Display/Traverse Queue | Doubly Linked List | O(R)

where:

R = number of active ride requests

SPACE COMPLEXITY:

O(R + D)

where:

R = active ride requests

D = registered drivers

Explain why:

- DLL stores active ride nodes.

- Hash Map stores ride-to-node references.

- Driver Hash Map stores driver information.

============================================================

22. TECHNIQUE SELECTION PAGE

============================================================

Create a section:

WHY THESE DATA STRUCTURES?

DOUBLY LINKED LIST

Used because:

- Maintains FIFO queue order.

- Supports insertion at tail.

- Supports removal from head.

- Allows pointer-based node removal.

HASH MAP

Used because:

- Provides direct lookup by Ride ID.

- Stores Ride ID → Node reference.

- Avoids searching through the entire queue for cancellation.

- Provides fast driver status lookup.

FIFO QUEUE

Used because:

- Ride requests should be handled sequentially.

- The earliest request is matched first.

EUCLIDEAN DISTANCE

Used because:

- Simple coordinate-based distance calculation.

- Constant-time calculation.

Do not add unrelated sorting algorithms just to increase the number of algorithms.

============================================================

23. STANDARD QUEUE VS PROPOSED DESIGN

============================================================

Create a comparison for educational purposes.

STANDARD QUEUE:

Enqueue → O(1)

Dequeue → O(1)

Arbitrary cancellation → requires locating the requested request first

PROPOSED HYBRID DESIGN:

Doubly Linked List:

- Maintains FIFO order.

- Supports pointer-based removal.

Hash Map:

- Directly locates the required node.

Therefore:

Cancellation can be performed in O(1) after direct node lookup through the Hash Map.

Clearly explain that the advantage comes from combining the two data structures.

============================================================

24. ACTIVITY LOG

============================================================

Create a live activity/event console.

Examples:

[14:31:02]

RIDE-101 added to queue

Operation: ENQUEUE

Complexity: O(1)

[14:31:10]

RIDE-102 added to queue

Operation: ENQUEUE

Complexity: O(1)

[14:31:18]

RIDE-101 matched with DRIVER-02

Operation: DEQUEUE

Complexity: O(1)

[14:31:25]

RIDE-103 cancelled

Operation: CANCEL

Complexity: O(1)

The timestamps should be generated dynamically.

Do not hardcode timestamps.

============================================================

25. SAMPLE DATA

============================================================

Create a button:

LOAD SAMPLE DATA

When clicked, actually create:

5-8 sample drivers

and

5-8 sample rides

using the actual data structures.

Example drivers:

DRIVER-01

DRIVER-02

DRIVER-03

DRIVER-04

DRIVER-05

Example rides:

RIDE-101

RIDE-102

RIDE-103

RIDE-104

RIDE-105

These should be actual RideNode objects inserted into the real queue.

Do not merely display sample cards.

============================================================

26. DEMO MODE

============================================================

Create:

START DEMO

The demo must perform REAL operations on the same data structures used by the application.

Demo sequence:

STEP 1:

Create sample drivers.

STEP 2:

Create RIDE-101.

Call:

enqueue()

STEP 3:

Create RIDE-102.

Call:

enqueue()

STEP 4:

Create RIDE-103.

Call:

enqueue()

STEP 5:

Show:

R101 ↔ R102 ↔ R103

STEP 6:

Cancel R102.

Call:

cancel("R102")

STEP 7:

Show:

Hash Map lookup

↓

Node found

↓

Pointer reconnection

↓

Node removed

STEP 8:

Show:

R101 ↔ R103

STEP 9:

Click/execute:

Match Next Ride

STEP 10:

Call:

dequeue()

STEP 11:

Assign R101 to an available driver.

STEP 12:

Change driver status:

Available → Busy

STEP 13:

Show final complexity information.

IMPORTANT:

Demo Mode must modify the actual queue, Maps, drivers, statistics, and logs.

Do not use fake animations that are disconnected from the actual state.

============================================================

27. LOCAL STORAGE

============================================================

Use localStorage to persist:

- Active rides

- Queue state

- Drivers

- Driver statuses

- Ride statuses

- Statistics

- Activity logs

When the browser refreshes:

restore the current simulation state.

The application must not lose all data on every refresh.

============================================================

28. RESET SIMULATION

============================================================

Create:

RESET SIMULATION

When clicked:

- Clear queue

- Clear rideMap

- Clear driverMap

- Reset drivers

- Reset statistics

- Clear activity log

- Clear localStorage

- Restore initial system state

Ask for confirmation before resetting.

============================================================

29. ERROR HANDLING

============================================================

Handle:

1. Empty rider name

2. Invalid coordinates

3. Duplicate Ride ID

4. Invalid ride ID

5. Cancelling a non-existent ride

6. Empty queue

7. No available drivers

8. Invalid pricing values

9. Negative distance if applicable

10. Invalid demand selection

Show clear user-friendly error messages.

Do not allow the application to crash.

============================================================

30. RESPONSIVE UI

============================================================

The website must work on:

- Laptop

- Desktop

- Tablet

- Mobile browser

However, prioritize laptop/desktop because this application will be demonstrated during a college presentation.

============================================================

31. DESIGN

============================================================

Make the UI look like a professional technology/transportation dashboard.

Use:

- Dark navy/blue technology theme

- White/light cards

- Blue/purple accents

- Green = Available / Success

- Red = Cancel / Error

- Orange/Yellow = Surge / Warning

Use:

- Rounded cards

- Clean typography

- Subtle shadows

- Smooth transitions

- Clear icons

- Professional spacing

- Responsive layout

Do not make it look like a generic template.

Do not overcrowd the screen.

The DSA information must remain easy to understand.

============================================================

32. PROJECT INFORMATION

============================================================

Add an About/Project Information section.

Title:

Ride-Sharing Dispatch System

Subtitle:

A High-Performance DSA Design for Real-Time Request Matching & Dynamic Price Estimation

Team:

D. Bhuvana – CH.SC.U4CSE25211

Jyothsna Reddy Anday – CH.SC.U4CSE25219

Core Data Structures:

Doubly Linked List

Hash Map

Core Operations:

Enqueue

Dequeue

Cancel

Driver Availability

Price Calculation

============================================================

33. IMPORTANT ACADEMIC REQUIREMENTS

============================================================

The application must clearly support these evaluation criteria:

1. ALGORITHM DESIGN — 30 MARKS

Show the actual algorithms for:

- Enqueue

- Dequeue

- Cancel

- Driver lookup

- Price calculation

2. COMPLEXITY ANALYSIS — 30 MARKS

Clearly display:

Enqueue → O(1)

Dequeue → O(1)

Cancel → O(1)

Driver Availability → O(1)

Price Calculation → O(1)

Space → O(R + D)

3. SELECTION OF SEARCHING / SORTING / TRAVERSAL TECHNIQUE — 30 MARKS

Explain:

- Why Hash Map is used for direct lookup.

- Why Doubly Linked List is used for queue management.

- Why FIFO processing is used for sequential ride matching.

- How linked-list traversal is used when displaying queue contents.

- Why Euclidean distance is used for coordinate-based distance calculation.

4. PRESENTATION & INTERACTION — 10 MARKS

Make the application visually clear and interactive.

The professor must be able to:

- Add a ride.

- See it enter the queue.

- Cancel a middle ride.

- See the actual node disappear.

- See the Hash Map state update.

- Match a ride.

- See a driver become Busy.

- Calculate fare.

- See complexity information.

============================================================

34. DO NOT DO THESE THINGS

============================================================

DO NOT:

- Create a static mockup.

- Use fake buttons.

- Use hardcoded outputs.

- Pretend an Array is a linked list.

- Traverse the linked list to find a ride during cancellation.

- Create animations that do not modify actual data.

- Display fake complexity values.

- Make the Hash Map visualization disconnected from the real Map.

- Use external APIs unnecessarily.

- Add unnecessary sorting algorithms.

- Create a backend unless absolutely required.

- Leave TODO placeholders.

- Leave broken buttons.

- Leave console errors.

============================================================

35. FINAL FUNCTIONAL TEST

============================================================

Before considering the project complete, test the following exact scenario:

TEST 1:

Load Sample Data.

Verify:

- Drivers exist in driverMap.

- Rides exist in rideMap.

- Queue contains actual RideNodes.

TEST 2:

Add a new ride manually.

Verify:

- New RideNode created.

- Node added at tail.

- rideMap updated.

- Queue size increases.

TEST 3:

Cancel a middle ride.

Example:

R101 ↔ R102 ↔ R103 ↔ R104

Cancel R102.

Verify:

R101 ↔ R103 ↔ R104

Verify:

- R102 removed from linked list.

- R102 removed from rideMap.

- Queue size decreases.

- Activity log updated.

TEST 4:

Match next ride.

Verify:

- R101 is removed from head.

- An Available driver is selected.

- Driver becomes Busy.

- Ride becomes Matched.

- Statistics update.

TEST 5:

Try to match another ride when no drivers are available.

Verify:

- Ride remains in queue.

- Error/notification says no drivers available.

TEST 6:

Change demand from Normal to Very High.

Verify:

- Surge multiplier changes.

- Fare changes.

TEST 7:

Refresh browser.

Verify:

- Current simulation state is restored from localStorage.

TEST 8:

Reset Simulation.

Verify:

- All simulation state is cleared/reset.

============================================================

36. FINAL REQUIREMENT

============================================================

The most important requirement is:

THIS MUST BE A REAL WORKING DSA APPLICATION.

The user should be able to enter dynamic data and receive dynamically calculated outputs.

The actual application state must be represented by:

1. Doubly Linked List

2. Ride Hash Map

3. Driver Hash Map

The visualizations must reflect those actual structures.

For example:

User adds:

RIDE-101

RIDE-102

RIDE-103

Actual structure:

HEAD

 ↓

R101 ↔ R102 ↔ R103

              ↑

             TAIL

Actual Map:

R101 → Node101

R102 → Node102

R103 → Node103

User cancels R102.

Actual result:

HEAD

 ↓

R101 ↔ R103

       ↑

      TAIL

Actual Map:

R101 → Node101

R103 → Node103

R102 must no longer exist.

This should happen through the actual implemented algorithms, not through manually changing the displayed HTML.

============================================================

37. FINAL OUTPUT

============================================================

Generate the complete project.

Include:

- All React components

- Data structure classes

- Algorithms

- Styling

- State management

- localStorage logic

- Sample data

- Demo mode

- Dashboard

- Booking page

- Queue visualization

- Driver page

- Algorithm visualization

- Complexity analysis

- Activity log

- Error handling

- Responsive UI

Make sure:

npm install

and

npm run dev

work without errors.

Before finishing, verify there are no compilation errors, runtime errors, broken imports, unused critical functions, or non-functional buttons.

The final application should be presentation-ready for a DSA Phase 2 review.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://dash-ride-sync.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/55c0bcc1-0943-5e59-a57e-cbf05cc66af3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
