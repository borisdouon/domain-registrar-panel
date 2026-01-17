import { DurableObject } from "cloudflare:workers";

// Domain lifecycle states
export enum DomainState {
  Available = "available",
  Registered = "registered",
  Active = "active",
  Expiring = "expiring",
  GracePeriod = "grace_period",
  Redemption = "redemption",
  Suspended = "suspended",
  Deleted = "deleted",
}

// Valid state transitions
const VALID_TRANSITIONS: Record<DomainState, DomainState[]> = {
  [DomainState.Available]: [DomainState.Registered],
  [DomainState.Registered]: [DomainState.Active, DomainState.Suspended],
  [DomainState.Active]: [DomainState.Expiring, DomainState.Suspended],
  [DomainState.Expiring]: [DomainState.Active, DomainState.GracePeriod, DomainState.Suspended],
  [DomainState.GracePeriod]: [DomainState.Active, DomainState.Redemption, DomainState.Suspended],
  [DomainState.Redemption]: [DomainState.Active, DomainState.Deleted, DomainState.Suspended],
  [DomainState.Suspended]: [DomainState.Active, DomainState.Deleted],
  [DomainState.Deleted]: [DomainState.Available],
};

export interface TransitionRequest {
  domainId: string;
  domainName: string;
  toState: DomainState;
  triggeredBy: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export interface TransitionResult {
  success: boolean;
  fromState: DomainState;
  toState: DomainState;
  timestamp: string;
  error?: string;
}

interface DomainStateData {
  domainId: string;
  domainName: string;
  currentState: DomainState;
  history: Array<{
    fromState: DomainState;
    toState: DomainState;
    triggeredBy: string;
    reason?: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export class DomainStateMachine extends DurableObject {
  private state: DomainStateData | null = null;

  constructor(ctx: DurableObjectState, env: unknown) {
    super(ctx, env);
  }

  private async loadState(): Promise<DomainStateData | null> {
    if (this.state) return this.state;
    this.state = await this.ctx.storage.get<DomainStateData>("state") || null;
    return this.state;
  }

  private async saveState(): Promise<void> {
    if (this.state) {
      await this.ctx.storage.put("state", this.state);
    }
  }

  async initialize(domainId: string, domainName: string): Promise<DomainStateData> {
    const now = new Date().toISOString();
    this.state = {
      domainId,
      domainName,
      currentState: DomainState.Available,
      history: [],
      createdAt: now,
      updatedAt: now,
    };
    await this.saveState();
    return this.state;
  }

  async getState(): Promise<DomainStateData | null> {
    return await this.loadState();
  }

  async transition(request: TransitionRequest): Promise<TransitionResult> {
    const state = await this.loadState();
    const now = new Date().toISOString();

    if (!state) {
      await this.initialize(request.domainId, request.domainName);
      return this.transition(request);
    }

    const fromState = state.currentState;
    const toState = request.toState;

    const validNextStates = VALID_TRANSITIONS[fromState] || [];
    if (!validNextStates.includes(toState)) {
      return {
        success: false,
        fromState,
        toState,
        timestamp: now,
        error: `Invalid transition from ${fromState} to ${toState}. Valid transitions: ${validNextStates.join(", ")}`,
      };
    }

    state.currentState = toState;
    state.updatedAt = now;
    state.history.push({
      fromState,
      toState,
      triggeredBy: request.triggeredBy,
      reason: request.reason,
      timestamp: now,
    });

    await this.saveState();

    return {
      success: true,
      fromState,
      toState,
      timestamp: now,
    };
  }

  async getHistory(): Promise<DomainStateData["history"]> {
    const state = await this.loadState();
    return state?.history || [];
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (request.method === "GET" && path === "/state") {
        const state = await this.getState();
        return Response.json(state || { error: "Not initialized" });
      }

      if (request.method === "GET" && path === "/history") {
        const history = await this.getHistory();
        return Response.json({ history });
      }

      if (request.method === "POST" && path === "/initialize") {
        const body = await request.json() as { domainId: string; domainName: string };
        const state = await this.initialize(body.domainId, body.domainName);
        return Response.json(state);
      }

      if (request.method === "POST" && path === "/transition") {
        const body = await request.json() as TransitionRequest;
        const result = await this.transition(body);
        return Response.json(result, { status: result.success ? 200 : 400 });
      }

      return Response.json({ error: "Not found" }, { status: 404 });
    } catch (error) {
      return Response.json({ error: String(error) }, { status: 500 });
    }
  }
}

interface Env {
  DOMAIN_STATE: DurableObjectNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const domainName = url.searchParams.get("domain");
    
    if (!domainName) {
      return Response.json({ error: "Domain name is required" }, { status: 400 });
    }

    const doId = env.DOMAIN_STATE.idFromName(domainName);
    const stub = env.DOMAIN_STATE.get(doId);
    
    return stub.fetch(request);
  }
};
