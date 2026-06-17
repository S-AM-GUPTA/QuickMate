# QuickMate — Complete Product & Design Documentation

# PART 1 — PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Product Overview

### Product Name
QuickMate

### Product Vision
QuickMate is a hyperlocal community-driven helper platform designed to connect people who need quick everyday assistance with nearby verified helpers in real time. The platform focuses on trust, affordability, speed, and accessibility, especially for urban and semi-urban Indian users.

QuickMate aims to become the “on-demand local help layer” for daily life — whether someone needs a delivery completed, groceries picked up, a technician, shifting assistance, or short-duration manpower.

---

# 1. Problem Statement

Millions of people struggle to find trustworthy local help for small but urgent tasks.

Current problems include:

- No reliable platform for hyperlocal micro-tasks
- Unverified helpers and safety concerns
- Delayed service from traditional marketplaces
- Lack of affordable short-duration task services
- Informal communication and payment handling
- Poor discovery of nearby skilled workers
- No real-time task bidding or matching system

At the same time, thousands of local workers, students, freelancers, delivery riders, and part-time workers need flexible earning opportunities.

QuickMate bridges this gap using location intelligence, trust systems, and AI-powered matching.

---

# 2. Target Users

## Primary Users

### 1. Urban Consumers
People needing quick local help for daily tasks.

Examples:
- Grocery pickup
- Delivery assistance
- Home shifting help
- Technician support
- Queue standing services
- Cleaning support
- Local errands

### 2. Local Helpers / Gig Workers
Individuals looking for flexible income opportunities.

Examples:
- Students
- Delivery workers
- Freelancers
- Electricians
- Plumbers
- Drivers
- Handymen
- Daily wage workers

---

# 3. Core Features

- Task Posting System
- Smart Nearby Helper Discovery
- Bidding & Negotiation System
- Real-Time Chat & Updates
- Trust & Safety System

---

# 4. User Stories

## Customer Stories

- As a customer, I want to post a task quickly so I can find nearby help instantly.
- As a customer, I want to compare helper ratings and pricing before selecting someone.
- As a customer, I want live updates so I know task progress.
- As a customer, I want verified helpers so I feel safe.

## Helper Stories

- As a helper, I want to choose tasks freely based on my availability.
- As a helper, I want transparent payment handling.
- As a helper, I want good ratings to improve my task opportunities.

---

# 5. Functional Requirements

## Authentication
- OTP-based login
- JWT authentication
- Role-based access

## Task Management
- Create/edit/delete tasks
- Assign helpers
- Task status management

## Payments
- Escrow support
- UPI integration
- Refund handling

## Notifications
- Push notifications
- SMS alerts
- Bid notifications

---

# 6. Success Metrics

## User Metrics
- Daily active users
- Monthly active users
- Task completion rate
- User retention rate

## Marketplace Metrics
- Average bids per task
- Average task completion time
- Repeat customer percentage

---

# PART 2 — DESIGN DOCUMENT

# QuickMate — Design System & UI/UX Design Document

## Design Inspiration Sources

Primary references:
- https://www.urbancompany.com/delhi-ncr
- https://www.taskrabbit.com/

QuickMate’s design language should combine:
- The premium trust-first minimalism of Urban Company
- The friendly task-marketplace clarity of Taskrabbit

---

# 1. Design Philosophy

## Core Design Principles

### Instant Action
Users should be able to:
- post tasks fast
- discover helpers instantly
- understand screens in under 3 seconds

### Trust-Centered UX
Visual trust indicators:
- verified badges
- ratings
- helper completion stats
- clean whitespace
- predictable flows

### Human & Friendly
Use:
- rounded components
- approachable typography
- warm illustrations
- subtle motion

### Mobile-First
Primary audience:
- Indian smartphone users
- gig workers
- urban consumers

---

# 2. Visual Identity

## Brand Personality

| Trait | Description |
|---|---|
| Reliable | Feels secure and professional |
| Fast | Immediate task resolution |
| Friendly | Community-oriented |
| Smart | AI-powered ecosystem |
| Local | Hyperlocal and accessible |

---

# 3. Color System

## Primary Palette

### Primary Brand Color
- #2563EB
- #1D4ED8

### Success Green
- #22C55E

### Accent Orange
- #F97316

### Neutral Palette
- #FFFFFF
- #F8FAFC
- #E2E8F0
- #64748B
- #0F172A

---

# 4. Typography

## Primary Font
- Inter

Alternative:
- Poppins
- Plus Jakarta Sans

## Typography Style
- Bold headings
- Clean spacing
- Comfortable readability

---

# 5. Layout System

## Design Style
- large whitespace
- modular card layouts
- soft shadows
- clean grid systems

## Grid System
- Mobile: 4-column
- Tablet: 8-column
- Desktop: 12-column

---

# 6. UI Component Language

## Cards
- Rounded corners
- Soft shadows
- Elevated hover states

## Buttons
### Primary Buttons
- Filled blue
- rounded-xl
- bold typography

### Secondary Buttons
- outline style
- subtle hover

---

# 7. Homepage Design

## Hero Section

Suggested headline:

> “Get trusted local help in minutes.”

Subtext:
> “From deliveries to repairs — QuickMate connects you with verified nearby helpers instantly.”

---

# 8. Homepage Sections

## Categories
Examples:
- Delivery
- Repair
- Moving
- Cleaning
- Tech Help

## Nearby Helpers
Cards include:
- helper image
- rating
- distance
- skills
- response time

## Live Tasks
Dynamic task feed showing:
- urgent requests
- nearby jobs
- bidding activity

---

# 9. Motion Design

## Animation Philosophy
Fast + subtle.

Use:
- fade transitions
- card lift hovers
- smooth loading skeletons

Avoid:
- flashy transitions
- excessive animations

---

# 10. Dashboard Design

## Customer Dashboard
- active tasks
- recent bookings
- saved helpers
- notifications
- payment history

## Helper Dashboard
- earnings
- nearby tasks
- active bids
- reputation score
- analytics

---

# 11. Suggested Tech Stack for UI

## Frontend
- React
- Vite
- Tailwind CSS

## UI Libraries
- shadcn/ui
- Framer Motion
- Lucide Icons

---

# 12. Final Aesthetic Summary

QuickMate should visually feel like:

> “A modern AI-powered local helper network built for India.”

The final experience should combine:
- Urban Company’s premium cleanliness
- Taskrabbit’s marketplace clarity
- modern SaaS dashboard polish
- hyperlocal real-time energy
