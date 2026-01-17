// Custom worker entry point that exports both Astro handler and Durable Object
export { DomainStateMachine } from "./src/workers/domain-state-machine";

// The Astro handler will be bundled separately - this file is used for DO export during wrangler deploy
// Wrangler will use the main entry from wrangler.jsonc for the actual handler
