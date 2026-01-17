/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
  DOMAIN_CACHE: KVNamespace;
  DOMAIN_STATE: DurableObjectNamespace;
  METRICS: AnalyticsEngineDataset;
  ASSETS: Fetcher;
}

declare namespace App {
  interface Locals {
    runtime: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}
