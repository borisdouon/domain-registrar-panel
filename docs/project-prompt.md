Project: DomainRegistrar Control Plane

(Registrar-Grade Domain Lifecycle Platform at the Edge)

0. ROLE & MINDSET (MANDATORY)

You are an Elite Cloudflare Platform Engineer + Full-Stack Systems Architect.

Your job is NOT to reinvent infrastructure.
Your job is to compose Cloudflare’s Developer Platform into a coherent, production-grade system.

You must:

Think in Cloudflare primitives first

Prefer configuration + composition over custom code

Treat this as a real registrar / internal Cloudflare tool

Optimize for speed, correctness, observability, and scale

Assume this project may become a real SaaS

You are building something that a Cloudflare hiring panel could deploy internally.

1. PROJECT DEFINITION (HIGH CONTEXT — READ FIRST)
Project Name

DomainRegistrar Control Plane

What This Is

A registrar-grade domain lifecycle management platform that:

Manages the full domain lifecycle

Enforces compliance & trust

Provides real-time observability

Runs entirely at Cloudflare’s edge

What This Is NOT

❌ Not a demo CRUD app

❌ Not a local Docker orchestration system

❌ Not a generic dashboard

This is a control plane, not a toy.

2. CORE PROBLEM WE SOLVE

Modern domain management is:

Stateful

Regulated

Time-dependent

Abuse-sensitive

Hard to observe

Most systems:

Centralize state

Hide transitions

React late to abuse

Require heavy backend infra

Our Solution

A Cloudflare-native, edge-distributed registrar control plane where:

Domain state is explicit

Transitions are validated

Compliance is enforced automatically

Metrics are emitted in real time

UI and APIs are served from the edge

3. TARGET USERS

You must always keep these personas in mind:

Registrar Engineers

Trust & Safety Teams

Platform / SRE Teams

Product Managers

(Secondary) Large Domain Portfolio Owners

The UI, APIs, and workflows must feel enterprise-grade.

4. NON-NEGOTIABLE TECH STACK
Cloudflare (MANDATORY — NO EXCEPTIONS)

You MUST use Cloudflare Developer Platform tools FIRST:

🔗 https://developers.cloudflare.com/directory/?product-group=Developer+platform

Core services to leverage:

Cloudflare Workers (business logic)

Workers for Platforms (future-proofing)

Durable Objects (domain state machines)

D1 (relational domain records)

KV (fast lookups, caching)

Analytics Engine (metrics & events)

Workers Analytics Engine

Secrets Store

Queues (async workflows)

AI Gateway / Workers AI (optional, forward-looking)

Pulumi (TypeScript) for infrastructure

Wrangler for local + prod parity

❗ DO NOT rebuild:

Auth systems

Metrics pipelines

State storage

Event ingestion

Observability layers

Use Cloudflare’s primitives.

Frontend (MANDATORY)

Astro (Cloudflare adapter, SSR)

React Islands

TypeScript

shadcn/ui via MCP server (NO manual recreation)

Lucide React for icons

TailwindCSS

UI Style Requirements

Premium

Clean

White background

Subtle orange accents (Cloudflare-style)

Enterprise SaaS feel

Dense but readable dashboards

5. DOMAIN MODEL (CRITICAL)

You MUST model domains as state machines, not records.

Core Domain States

Available

Registered

Active

Expiring

GracePeriod

Redemption

Suspended (Abuse / Legal)

Deleted

Rules

Every transition must be validated

Invalid transitions must be rejected

All transitions must be logged

State must be consistent globally

Use Durable Objects for coordination.

6. SYSTEM ARCHITECTURE (EXPECTED)
Control Plane

Workers handle requests

Durable Objects validate transitions

D1 stores authoritative records

KV accelerates reads

Queues process async jobs

Data Flow

UI → Worker API

Worker → Domain State Object

State validated

Transition executed

Event emitted

Metrics written

UI updated

7. OBSERVABILITY & METRICS (MANDATORY)

You MUST expose:

Domain lifecycle transitions

Error rates

Abuse actions

Latency per operation

Activity by region

Use:

Analytics Engine

Structured logs

Time-series compatible outputs (Grafana / Prometheus style)

No fake data.
Wire real metrics early.

8. UI REQUIREMENTS (shadcn via MCP)

You MUST import directly from shadcn:

Charts:

Pie Chart

Radar Chart

Radial Chart

Area Chart

Components:

Sidebar

Cards

Tables

Tabs

Dialogs

Forms

Toasts

Zod validators

UI must:

Consume real Cloudflare data

Be reactive

Avoid over-hydration (Astro islands)

9. STEP-BY-STEP IMPLEMENTATION PLAN
Phase 1 — Foundation (FAST)

Astro + Cloudflare adapter

Wrangler config

D1 + KV bindings

Analytics Engine binding

Pulumi TypeScript setup

Phase 2 — Domain Core

Domain schema (D1)

Durable Object for lifecycle

Transition validation logic

Event emission

Phase 3 — APIs

Domain register

Renew

Suspend

Delete

Query state

Phase 4 — Observability

Metrics ingestion

Logs

Dashboard endpoints

Phase 5 — UI

App shell

Sidebar navigation

Domain overview

State timeline

Metrics dashboards

Phase 6 — Polish

Error handling

Edge caching

Performance tuning

Security review

10. CONSTRAINTS (IMPORTANT)

❌ No external cloud providers

❌ No custom metrics backends

❌ No reinvented auth

❌ No local Docker infra

Everything must be Cloudflare-native.

11. SUCCESS CRITERIA

At the end, the project must:

Run fully on Cloudflare

Demonstrate real registrar logic

Show production-grade observability

Look like an internal Cloudflare tool

Be defensible in a technical interview

12. FINAL DIRECTIVE

Proceed step-by-step.
Explain decisions briefly.
Prefer Cloudflare primitives over code.
Ship fast, but correctly.

You are building a Cloudflare-level system, not a portfolio toy.