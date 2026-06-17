# QuickMate Project Todo List

This todo list outlines the implementation plan for the QuickMate hyperlocal helper marketplace MVP. Each task is atomic, sequentially ordered, and structured such that there are no overlapping dependencies. 

---

## Phase 1: Environment & Project Initialization

### [ ] TASK-001: Monorepo / Workspace Directory Setup
- **Goal**: Establish the repository structure for web, mobile, and backend.
- **Details**:
  - Initialize a Node.js monorepo using npm/yarn workspaces.
  - Create directories: `backend`, `frontend-web`, `frontend-mobile`, and `shared` (for shared interfaces/constants).
  - Configure root eslint, prettier, and typescript rules.
- **Dependencies**: None.

### [ ] TASK-002: PostgreSQL & PostGIS Database Provisioning
- **Goal**: Provision the database and configure geospatial queries.
- **Details**:
  - Set up a PostgreSQL instance and enable the PostGIS extension (`CREATE EXTENSION postgis;`).
  - Write initialization schema migrations containing primary tables: `users`, `tasks`, `bids`, `reviews`, `messages`, `activity_logs`.
  - Add spatial indexes (`GIST` index) on coordinate columns to support rapid distance calculations.
- **Dependencies**: TASK-001.

---

## Phase 2: Backend Core & Authentication (NestJS)

### [ ] TASK-003: NestJS Backend Core Setup
- **Goal**: Initialize the server framework and establish database connection.
- **Details**:
  - Bootstrap a NestJS application inside the `/backend` workspace.
  - Implement config service validation to manage database credentials, JWT keys, and API tokens.
  - Configure TypeORM/Prisma to establish a stable pool connection to the PostGIS-enabled database.
- **Dependencies**: TASK-002.

### [ ] TASK-004: Clerk Authentication & Webhook Integration
- **Goal**: Implement secure user identity verification.
- **Details**:
  - Integrate Clerk authentication SDK inside NestJS.
  - Implement a global guard/middleware in NestJS to validate Clerk JWT tokens on incoming requests.
  - Build a webhook endpoint (`/webhooks/clerk`) to sync newly created/updated Clerk users into the local PostgreSQL `users` table.
- **Dependencies**: TASK-003.

### [ ] TASK-005: User Profiles API
- **Goal**: Manage user roles, details, and skills.
- **Details**:
  - Implement `GET /users/me` and `PATCH /users/profile` endpoints.
  - Schema details: `name`, `role` (`customer`, `helper`, `admin`), `phone`, `skills` (array of strings), and last known `location` coordinates.
  - Add input validations ensuring longitude falls within `[-180, 180]` and latitude within `[-90, 90]`.
- **Dependencies**: TASK-004.

---

## Phase 3: Infrastructure Services

### [ ] TASK-006: Cloudflare R2 Upload Service
- **Goal**: Enable media uploads for profiles, helper verifications, and task posts.
- **Details**:
  - Set up an AWS S3/Cloudflare R2 Client module inside NestJS.
  - Implement a controller endpoint `POST /storage/presigned-url` to generate secure upload URLs for frontend direct upload.
  - Configure R2 bucket security policy for public read access to uploaded task/profile photos.
- **Dependencies**: TASK-005.

---

## Phase 4: Core Task Management API

### [ ] TASK-007: Task Creation (Post a Task) API
- **Goal**: Allow customers to submit requests for local help.
- **Details**:
  - Create validation schemas for task posting.
  - Implement `POST /tasks` endpoint.
  - Fields required: `title`, `description`, `budget`, `category`, `urgency` (`low`, `medium`, `urgent`), `location` (latitude/longitude stored as a PostGIS point), `scheduled_time`, and optional `attachment_urls` array.
- **Dependencies**: TASK-006.

### [ ] TASK-008: Customer Task Dashboard API
- **Goal**: Provide customers access to their posted tasks.
- **Details**:
  - Implement `GET /tasks/customer` returning tasks posted by the authenticated customer.
  - Add query filters for status: `Open`, `Assigned`, `In Progress`, `Completed`, `Cancelled`, `Disputed`.
  - Implement pagination parameters.
- **Dependencies**: TASK-007.

### [ ] TASK-009: Geolocation Discovery API (Nearby Tasks / Helpers)
- **Goal**: Power helper discovery of tasks and customer discovery of helpers.
- **Details**:
  - Implement `GET /tasks/nearby` for helpers. Query filters: coordinates, radius (default 5km), and category. Returns open tasks ordered by proximity using PostGIS `ST_DistanceSphere`.
  - Implement `GET /helpers/nearby` for customers to search active helpers nearby.
- **Dependencies**: TASK-008.

---

## Phase 5: Bidding & Negotiation API

### [ ] TASK-010: Helper Bidding API (Place Bid)
- **Goal**: Allow helpers to express interest and propose pricing.
- **Details**:
  - Implement `POST /bids` endpoint.
  - Fields: `task_id`, `proposed_amount`, `estimated_completion_time` (ETA), and a note.
  - Validation: Verify that the task status is `Open`, and that the helper has not already bid on this task.
- **Dependencies**: TASK-009.

### [ ] TASK-011: Bidding Lifecycle API (Accept / Reject)
- **Goal**: Permit customers to select a helper for their task.
- **Details**:
  - Implement `GET /tasks/:id/bids` to fetch all bids for a task.
  - Implement `POST /bids/:id/accept` which updates the task state to `Assigned`, sets `assigned_helper_id`, and marks the accepted bid status as `Accepted` (other bids are marked as `Rejected`).
  - Implement `POST /bids/:id/reject` to manually dismiss a bid.
- **Dependencies**: TASK-010.

---

## Phase 6: Real-Time Communication & Updates

### [ ] TASK-012: NestJS WebSocket Gateway (Socket.IO) Setup
- **Goal**: Setup WebSocket server layer for dynamic communication.
- **Details**:
  - Set up a WebSocket Gateway in NestJS using `@nestjs/websockets` and `@nestjs/platform-socket.io`.
  - Implement security guard checking Clerk JWT tokens on connection.
  - Integrate Redis Adapter (`@socket.io/redis-adapter`) to prepare the real-time server for horizontal scaling.
- **Dependencies**: TASK-011.

### [ ] TASK-013: Live Chat API & WebSocket Sync
- **Goal**: Connect customer and helper in a direct real-time chat interface.
- **Details**:
  - Create messages database table: `id`, `task_id`, `sender_id`, `message_text`, `media_url`, `created_at`.
  - Implement `GET /chats/:task_id/messages` returning message history.
  - Implement WebSocket handler `send_message` that saves the message and emits it instantly to the other party's socket channel.
- **Dependencies**: TASK-012.

### [ ] TASK-014: Live Task Status Update Gateway
- **Goal**: Broadcast real-time status transitions.
- **Details**:
  - Map status change events (`TaskStarted`, `TaskCompleted`, `TaskCancelled`).
  - Whenever a task state changes on the database, push a WebSocket notification to the participant nodes to instantly reload UI views.
- **Dependencies**: TASK-013.

---

## Phase 7: Reviews, Ratings & Helper Trust Score

### [ ] TASK-015: Reviews & Ratings API
- **Goal**: Capture post-task feedback.
- **Details**:
  - Implement `POST /reviews` endpoint.
  - Input parameters: `task_id`, `target_user_id`, `rating` (integer 1-5), and `feedback_text`.
  - Validation: Verify the task status is `Completed`, the request initiator is a task participant, and the target is the other participant.
- **Dependencies**: TASK-014.

### [ ] TASK-016: User Rating & Reputation Engine
- **Goal**: Recalculate helper trust scores based on rating events.
- **Details**:
  - Create database hook/service to update the target helper's dynamic metadata (average rating, total completed tasks, response speed).
  - Implement logic to assign "Verified Badge" flag based on manual verification or rating achievements.
- **Dependencies**: TASK-015.

---

## Phase 8: Escrow Payments (Razorpay)

### [ ] TASK-017: Razorpay Order Creation API
- **Goal**: Initiate transactions targeting the Indian market payment flow.
- **Details**:
  - Setup Razorpay SDK on the backend.
  - Implement `POST /payments/checkout` which verifies task budget, initializes a Razorpay order entity, and stores a local payment transaction entry as `Pending`.
- **Dependencies**: TASK-016.

### [ ] TASK-018: Razorpay Webhook & Escrow Release API
- **Goal**: Release funds upon successful delivery of service.
- **Details**:
  - Implement `POST /payments/webhook` to handle Razorpay payment success notifications, moving local state to `Held in Escrow`.
  - Implement `POST /payments/:task_id/release` allowing the customer to trigger transfer from escrow to the helper's account details.
  - Add refund automation triggers in case of agreed cancellations.
- **Dependencies**: TASK-017.

---

## Phase 9: Basic Security & Rate Limiting

### [ ] TASK-019: API Rate Limiter & Audit Logger
- **Goal**: Protect API endpoints from automated attacks or spam.
- **Details**:
  - Set up NestJS Throttler/Rate-limiter on authentication, bidding, and task posting routes.
  - Create middleware to log metadata of high-frequency events into `activity_logs`.
- **Dependencies**: TASK-018.

---

## Phase 10: Next.js Web Frontend Development

### [ ] TASK-020: Next.js Web Initialization & UI Core
- **Goal**: Set up the web codebase structure and components.
- **Details**:
  - Scaffold a Next.js app in `/frontend-web`.
  - Install Tailwind CSS and initialize shadcn/ui.
  - Add global theme colors matching the Design doc (#2563EB primary, HSL gray neutral range).
- **Dependencies**: TASK-019.

### [ ] TASK-021: Web Authentication Screen (Clerk Integration)
- **Goal**: Integrate login flows in the frontend.
- **Details**:
  - Connect Clerk React/Next.js SDK.
  - Build styled login/signup flows supporting email/phone OTP input.
- **Dependencies**: TASK-020.

### [ ] TASK-022: Web Profiles & User Onboarding Form
- **Goal**: Guide new sign-ups into helper or customer flows.
- **Details**:
  - Implement onboarding multi-step forms.
  - Capture roles, verify phone numbers, select skill tags (if helper), and save details using the profile endpoints.
- **Dependencies**: TASK-021.

### [ ] TASK-023: Web "Post a Task" Interface
- **Goal**: Customer UI to detail and locate their task.
- **Details**:
  - Build task posting form containing budget, urgency levels, category icons.
  - Integrate Mapbox Address Search/Geocoding and a map component to place a location pin.
  - Integrate Cloudflare R2 file uploader.
- **Dependencies**: TASK-022.

### [ ] TASK-024: Web Customer Dashboard UI
- **Goal**: Dashboard showing customer's active postings.
- **Details**:
  - Build dashboard to list open, assigned, and past tasks.
  - Design a detail sub-panel displaying bids.
  - Display helper details: rating, completed jobs, distance from task.
- **Dependencies**: TASK-023.

### [ ] TASK-025: Web Helper Dashboard & Task Map Feed
- **Goal**: Dashboard showing active jobs and nearby work.
- **Details**:
  - Build helper main screen summarizing current metrics: total earnings, average rating, active bids.
  - Implement nearby task feed: sidebar list coupled with Mapbox interactive markers representing nearby tasks.
- **Dependencies**: TASK-024.

### [ ] TASK-026: Web Bidding Interaction Panel
- **Goal**: Interface for helper negotiations.
- **Details**:
  - Design modal for helpers to write message notes, offer pricing, specify ETA.
  - Display interactive timeline showing bid status (Sent, Under Review, Accepted/Rejected).
- **Dependencies**: TASK-025.

### [ ] TASK-027: Web Chat & Live Status Component
- **Goal**: Real-time communication interface.
- **Details**:
  - Integrate Socket.IO-client.
  - Design a split view screen: left column showing task details and action buttons (e.g. "Mark In Progress", "Request Release"), right column containing active messaging thread.
- **Dependencies**: TASK-026.

### [ ] TASK-028: Web Razorpay Checkout Integration
- **Goal**: Enable web payment execution.
- **Details**:
  - Integrate Razorpay frontend JS script.
  - Configure payment modal popup to load when a customer clicks "Accept Bid & Pay Escrow".
- **Dependencies**: TASK-027.

### [ ] TASK-029: Web Feedback & Review Form
- **Goal**: Review submission on task completion.
- **Details**:
  - Design modal triggered upon task status changing to `Completed`.
  - Add 5-star selector and review message fields.
- **Dependencies**: TASK-028.

---

## Phase 11: React Native / Expo Mobile App Development

### [ ] TASK-030: React Native + Expo Project Initialization
- **Goal**: Set up mobile development workflow.
- **Details**:
  - Scaffold React Native application with Expo inside `/frontend-mobile`.
  - Install Expo Router, Tailwind/NativeWind, Lucide Icons, and configure native permission handlers for locations.
- **Dependencies**: TASK-029.

### [ ] TASK-031: Mobile Authentication Interface
- **Goal**: Support user login on mobile devices.
- **Details**:
  - Integrate Clerk mobile authentication (expo-clerk).
  - Design mobile-first layout for login and OTP validation.
- **Dependencies**: TASK-030.

### [ ] TASK-032: Mobile Background Location Service
- **Goal**: Real-time tracking of helper coordinates.
- **Details**:
  - Configure background location fetching in Expo (using `expo-location`).
  - Implement API sync that periodic uploads helper latitude/longitude to the NestJS backend to keep the nearby search system accurate.
- **Dependencies**: TASK-031.

### [ ] TASK-033: Mobile Tab Navigation & Dashboards
- **Goal**: Standard navigation structure.
- **Details**:
  - Implement bottom tab navigation (Home, Find Tasks, Messages, Profile).
  - Render customized dashboard screens depending on the logged-in user role.
- **Dependencies**: TASK-032.

### [ ] TASK-034: Mobile Task Creation & Camera Upload
- **Goal**: Native image capturing for task details.
- **Details**:
  - Set up image attachment pickers using `expo-image-picker`.
  - Build location selector utilizing native mobile map interfaces (Mapbox Mobile or Expo Maps).
- **Dependencies**: TASK-033.

### [ ] TASK-035: Mobile Nearby Tasks Discovery Feed
- **Goal**: Mobile geolocation searching tool.
- **Details**:
  - Build interactive list view and map overlays showcasing pins of tasks within current radius.
  - Add tap gestures on pins to load preview panels.
- **Dependencies**: TASK-034.

### [ ] TASK-036: Mobile Bidding & Bid Management screens
- **Goal**: Native bid placing screens.
- **Details**:
  - Implement screen sliders and numeric text inputs for helpers to customize their offer parameters quickly.
- **Dependencies**: TASK-035.

### [ ] TASK-037: Mobile Chat & Push Notification Client
- **Goal**: Instant messaging with push support.
- **Details**:
  - Build mobile chat screens with native scroll physics and virtual keyboard layout behaviors.
  - Integrate push notifications using Expo Notifications service to trigger system alerts for new messages.
- **Dependencies**: TASK-036.

### [ ] TASK-038: Mobile Payment Integration
- **Goal**: Trigger UPI and card checkout screens on mobile devices.
- **Details**:
  - Set up Razorpay SDK integrations for React Native to trigger the Razorpay Android/iOS overlay.
- **Dependencies**: TASK-037.

### [ ] TASK-039: Mobile Rating & Review Overlay
- **Goal**: Native feedback rating layout.
- **Details**:
  - Create completion check screens showing modal selectors for ratings.
- **Dependencies**: TASK-038.

---

## Phase 12: Analytics, Optimization & Deployment

### [ ] TASK-040: End-to-End Integration Testing
- **Goal**: Certify system validity before deploy.
- **Details**:
  - Write regression integration scripts testing complete flow from creation to completion.
  - Verify PostGIS distance queries under peak stress.
- **Dependencies**: TASK-039.

### [ ] TASK-041: Sentry Monitoring & PostHog Analytics Setup
- **Goal**: Setup system observability.
- **Details**:
  - Integrate Sentry SDK on Backend, Next.js Web, and React Native platforms to capture exceptions.
  - Integrate PostHog script elements to monitor customer acquisition metrics and conversion rates.
- **Dependencies**: TASK-040.

### [ ] TASK-042: Production Infrastructure Deployment
- **Goal**: Deploy web, backend, database to cloud servers.
- **Details**:
  - Deploy NestJS backend, Redis, PostgreSQL on Railway / AWS.
  - Deploy Next.js on Vercel.
  - Configure CORS, verify clerk production redirection URLs, verify SSL certificate layers.
- **Dependencies**: TASK-041.
