DomainRegistrar Control Plane

A Registrar-Grade Domain Lifecycle Platform built entirely on Cloudflare

1. The Project

DomainRegistrar Control Plane is a cloud-native, registrar-grade domain lifecycle management platform designed to operate fully at the edge using Cloudflare Workers and Cloudflare’s developer ecosystem.

The platform provides a single, unified control plane to manage the complete lifecycle of internet domains — from registration to expiration — while enforcing compliance, security, auditability, and performance at global scale.

This project is intentionally built to mirror real-world registrar infrastructure, focusing on correctness, state management, observability, and trust.

2. The Concept

Modern domain management is not just CRUD.

A domain is a regulated digital asset governed by:

ICANN rules

Registry constraints

Abuse & Trust policies

DNS and DNSSEC integrity

Time-based state transitions

The core concept behind EdgeRegistrar is:

Treat domains as stateful entities governed by deterministic rules, not as simple records.

Instead of scattered tools, EdgeRegistrar centralizes:

Domain state machines

Compliance enforcement

Trust & Safety actions

Observability and audit trails

Customer-facing and internal workflows

All without servers, running entirely on Cloudflare’s edge network.

3. The Vision
Build the reference architecture for registrar-grade systems at the edge.

EdgeRegistrar envisions a future where:

Registrar systems are globally distributed by default

Compliance and security are first-class citizens

Domain operations are observable, explainable, and auditable

Engineering teams can iterate without sacrificing trust or stability

This platform is designed to be:

A production-grade internal tool

A future SaaS-ready foundation

A proof that complex, regulated systems can run serverlessly at the edge

4. The Mission

The mission of EdgeRegistrar Control Plane is to:

Model the full domain lifecycle correctly

Enforce compliance automatically

Expose safe, intuitive control surfaces for users and operators

Provide deep observability into domain operations

Operate globally with near-zero latency using Cloudflare’s edge

This project demonstrates how Cloudflare Workers + Astro can replace traditional registrar backends while remaining simpler, faster, and more resilient.

5. How the Platform Is Supposed to Work
High-Level Flow

User or Operator accesses the dashboard

Requests domain operations (register, renew, lock, update DNS, suspend)

Worker validates action against domain state rules

State transition is executed if valid

All actions are logged immutably

Metrics and analytics are emitted in real time

UI updates instantly from edge-served APIs

Domain Lifecycle States (Simplified)

Available

Registered

Active

Expiring

Grace Period

Redemption

Suspended (Abuse / Legal)

Deleted

Each transition is:

Explicit

Validated

Audited

Observable

Invalid transitions are rejected by design.

6. Target Users
Primary Targets

Registrar Engineering Teams

Internal tooling

Domain operations dashboards

Compliance workflows

Trust & Safety Teams

Abuse detection

Domain suspension workflows

Investigation timelines

Platform & SRE Teams

System health

Error rates

State transition anomalies

Secondary Targets

Hosting providers

Managed DNS platforms

Enterprises managing large domain portfolios

SaaS companies embedding registrar functionality

7. Definitions (Key Concepts)
Term	Definition
Domain Lifecycle	The complete regulated journey of a domain from availability to deletion
Control Plane	The authoritative system that validates and executes domain operations
State Machine	Deterministic rules governing allowed domain transitions
Compliance Event	Any action requiring auditability or policy enforcement
Edge Execution	Running logic as close as possible to the user via Cloudflare Workers
8. Technology Stack (100% Cloudflare + Astro)
Frontend

Astro (Cloudflare adapter)

Server-side rendering at the edge

Component-driven UI

React (Islands architecture)

shadcn/ui

Sidebar

Cards

Tables

Charts

Forms

TailwindCSS

Dark, professional, enterprise-grade UI

Backend & Platform

Cloudflare Workers

Core business logic

Domain state validation

Durable Objects

Domain state coordination

D1 Database

Relational domain records

State history

KV Storage

Fast lookups

Cached policies

Analytics Engine

Metrics

Events

Aggregations

Workers Analytics

Operational insights

Secrets Store

Secure credentials handling

Observability & Metrics

Domain state transition rates

Error frequencies

Abuse action metrics

Latency per operation

Activity by region

Designed to integrate with:

Grafana

Prometheus-style metrics

Kibana-like log analysis (via structured logs)

9. AI Integration (Optional / Forward-Looking)

Abuse pattern detection

Anomaly detection on domain behavior

Risk scoring for domains

Assisted operator decision-making

All inference runs via:

Cloudflare Workers AI

No external dependencies

10. Why This Project Matters

This is not a demo app.

EdgeRegistrar Control Plane proves that:

Complex registrar systems can run serverlessly

Compliance and performance can coexist

Cloudflare Workers are capable of serious infrastructure workloads

Edge-native design simplifies global systems

It directly reflects the engineering mindset Cloudflare looks for:

Correctness over shortcuts

Systems thinking

Trust-first design

Deep understanding of edge infrastructure

Final Positioning Statement (for Resume / Interviews)

“DomainRegistrar Control Plane is a registrar-grade domain lifecycle platform built entirely on Cloudflare Workers and Astro, designed to model real-world domain compliance, trust workflows, and observability at global edge scale.”