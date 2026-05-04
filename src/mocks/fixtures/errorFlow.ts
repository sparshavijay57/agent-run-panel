import type { FixtureEvent } from '../MockEventEmitter'

export const errorFlow: FixtureEvent[] = [
  {
    delay: 0,
    event: {
      type: 'run_started',
      runId: 'run-002',
      query: 'Analyse competitor pricing strategies across enterprise SaaS markets',
      timestamp: Date.now(),
    },
  },

  {
    delay: 300,
    event: {
      type: 'agent_thought',
      runId: 'run-002',
      timestamp: Date.now(),
      taskId: null,
      agent: 'coordinator',
      thought:
        'Spawning data collection tasks. Will need pricing pages, analyst reports, and customer forums.',
    },
  },

  // --- Task 1 ---
  {
    delay: 200,
    event: {
      type: 'task_spawned',
      runId: 'run-002',
      timestamp: Date.now(),
      taskId: 'etask-1',
      label: 'Collect pricing pages',
      agent: 'scraper',
      parallelGroup: null,
      dependsOn: [],
    },
  },
  {
    delay: 200,
    event: {
      type: 'task_update',
      runId: 'run-002',
      timestamp: Date.now(),
      taskId: 'etask-1',
      status: 'running',
    },
  },
  {
    delay: 400,
    event: {
      type: 'tool_call',
      runId: 'run-002',
      timestamp: Date.now(),
      taskId: 'etask-1',
      callId: 'ecall-1a',
      toolName: 'web_scraper',
      inputSummary:
        'Scrape pricing pages: Salesforce, HubSpot, Zendesk, Intercom',
    },
  },
  {
    delay: 900,
    event: {
      type: 'tool_result',
      runId: 'run-002',
      timestamp: Date.now(),
      taskId: 'etask-1',
      callId: 'ecall-1a',
      outputSummary:
        'Partial success: 2/4 pages scraped. Salesforce and Intercom blocked by bot detection.',
    },
  },
  {
    delay: 300,
    event: {
      type: 'partial_output',
      runId: 'run-002',
      timestamp: Date.now(),
      taskId: 'etask-1',
      content:
        'Partial data collected from HubSpot and Zendesk. Salesforce and Intercom blocked.',
      isFinal: false,
    },
  },
  {
    delay: 400,
    event: {
      type: 'task_output',
      runId: 'run-002',
      timestamp: Date.now(),
      taskId: 'etask-1',
      content:
        'Pricing data collected from 2/4 targets. HubSpot: $45–$1200/mo. Zendesk: $55–$115/agent/mo.',
      isFinal: true,
      qualityScore: 0.61,
    },
  },
  // ✅ Explicit completion (improvement)
  {
    delay: 0,
    event: {
      type: 'task_update',
      runId: 'run-002',
      timestamp: Date.now(),
      taskId: 'etask-1',
      status: 'complete',
    },
  },

  // --- Task 2 (fails) ---
  {
    delay: 200,
    event: {
      type: 'task_spawned',
      runId: 'run-002',
      timestamp: Date.now(),
      taskId: 'etask-2',
      label: 'Fetch analyst reports',
      agent: 'researcher',
      parallelGroup: null,
      dependsOn: [],
    },
  },
  {
    delay: 200,
    event: {
      type: 'task_update',
      runId: 'run-002',
      timestamp: Date.now(),
      taskId: 'etask-2',
      status: 'running',
    },
  },
  {
    delay: 400,
    event: {
      type: 'tool_call',
      runId: 'run-002',
      timestamp: Date.now(),
      taskId: 'etask-2',
      callId: 'ecall-2a',
      toolName: 'report_database',
      inputSummary:
        'Fetch: Gartner and Forrester SaaS pricing reports 2024',
    },
  },
  {
    delay: 600,
    event: {
      type: 'tool_result',
      runId: 'run-002',
      timestamp: Date.now(),
      taskId: 'etask-2',
      callId: 'ecall-2a',
      outputSummary:
        'Access denied: subscription required for Gartner. Forrester report found but decryption failed.',
    },
  },
  {
    delay: 200,
    event: {
      type: 'task_update',
      runId: 'run-002',
      timestamp: Date.now(),
      taskId: 'etask-2',
      status: 'failed',
      reason:
        'Unable to access paywalled analyst reports. Decryption key mismatch on cached copy.',
    },
  },

  // --- Task 3 (never starts) ---
  {
    delay: 200,
    event: {
      type: 'task_spawned',
      runId: 'run-002',
      timestamp: Date.now(),
      taskId: 'etask-3',
      label: 'Mine customer forums',
      agent: 'sentiment-agent',
      parallelGroup: null,
      dependsOn: [],
    },
  },

  // --- Run fails before task-3 starts ---
  {
    delay: 600,
    event: {
      type: 'run_error',
      runId: 'run-002',
      timestamp: Date.now(),
      error:
        'Critical failure: coordinator lost connection to tool registry. Cannot dispatch further tasks. Partial results preserved.',
    },
  },
]