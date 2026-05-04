import type { FixtureEvent } from '../MockEventEmitter'

export const successFlow: FixtureEvent[] = [
  {
    delay: 0,
    event: {
      type: 'run_started',
      runId: 'run-001',
      query: 'Research the impact of large language models on software engineering productivity',
      timestamp: Date.now(),
    },
  },

  // --- Coordinator thought ---
  {
    delay: 300,
    event: {
      type: 'agent_thought',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: null,
      agent: 'coordinator',
      thought: 'Breaking down the research query into parallel sub-tasks: academic literature, industry reports, and developer surveys.',
    },
  },

  // --- Task 1: Sequential intro task ---
  {
    delay: 200,
    event: {
      type: 'task_spawned',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-1',
      label: 'Define research scope',
      agent: 'planner',
      parallelGroup: null,
      dependsOn: [],
    },
  },
  {
    delay: 300,
    event: {
      type: 'task_update',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-1',
      status: 'running',
    },
  },
  {
    delay: 400,
    event: {
      type: 'agent_thought',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-1',
      agent: 'planner',
      thought: 'Identifying key dimensions: productivity metrics, code quality, developer experience, adoption rates.',
    },
  },
  {
    delay: 600,
    event: {
      type: 'tool_call',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-1',
      callId: 'call-1a',
      toolName: 'search_knowledge_base',
      inputSummary: 'Query: "LLM software engineering productivity definitions"',
    },
  },
  {
    delay: 700,
    event: {
      type: 'tool_result',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-1',
      callId: 'call-1a',
      outputSummary: 'Found 12 relevant definitions across 8 sources. Key themes: velocity, quality, satisfaction.',
    },
  },
  {
    delay: 400,
    event: {
      type: 'partial_output',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-1',
      content: 'Research scope identified: focusing on four dimensions — ',
      isFinal: false,
    },
  },
  {
    delay: 400,
    event: {
      type: 'partial_output',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-1',
      content: 'developer velocity, code quality metrics, cognitive load reduction, and tool adoption rates.',
      isFinal: false,
    },
  },
  {
    delay: 500,
    event: {
      type: 'task_output',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-1',
      content: 'Research scope defined across four dimensions: developer velocity, code quality metrics, cognitive load reduction, and tool adoption rates. These will guide all sub-agent queries.',
      isFinal: true,
      qualityScore: 0.91,
    },
  },

  // --- Parallel group: 3 research tasks ---
  {
    delay: 200,
    event: {
      type: 'task_spawned',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-2',
      label: 'Survey academic literature',
      agent: 'researcher-a',
      parallelGroup: 'research-parallel',
      dependsOn: ['task-1'],
    },
  },
  {
    delay: 0,
    event: {
      type: 'task_spawned',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-3',
      label: 'Analyse industry reports',
      agent: 'researcher-b',
      parallelGroup: 'research-parallel',
      dependsOn: ['task-1'],
    },
  },
  {
    delay: 0,
    event: {
      type: 'task_spawned',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-4',
      label: 'Gather developer surveys',
      agent: 'researcher-c',
      parallelGroup: 'research-parallel',
      dependsOn: ['task-1'],
    },
  },

  // All three start running simultaneously
  {
    delay: 200,
    event: { type: 'task_update', runId: 'run-001', timestamp: Date.now(), taskId: 'task-2', status: 'running' },
  },
  {
    delay: 0,
    event: { type: 'task_update', runId: 'run-001', timestamp: Date.now(), taskId: 'task-3', status: 'running' },
  },
  {
    delay: 0,
    event: { type: 'task_update', runId: 'run-001', timestamp: Date.now(), taskId: 'task-4', status: 'running' },
  },

  // task-2: academic literature — runs fine, then gets cancelled (sufficient data)
  {
    delay: 300,
    event: {
      type: 'tool_call',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-2',
      callId: 'call-2a',
      toolName: 'semantic_scholar_search',
      inputSummary: 'Search: "LLM code generation developer productivity" (2022–2024)',
    },
  },
  {
    delay: 800,
    event: {
      type: 'tool_result',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-2',
      callId: 'call-2a',
      outputSummary: 'Retrieved 47 papers. Top finding: 55% average productivity gain reported in controlled studies.',
    },
  },
  {
    delay: 400,
    event: {
      type: 'partial_output',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-2',
      content: 'Academic consensus shows 40–60% productivity gains in controlled environments. ',
      isFinal: false,
    },
  },
  {
    delay: 300,
    event: {
      type: 'partial_output',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-2',
      content: 'Key caveat: real-world gains are lower (20–35%) due to review overhead.',
      isFinal: false,
    },
  },
  {
    delay: 500,
    event: {
      type: 'task_update',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-2',
      status: 'cancelled',
      reason: 'sufficient_data',
    },
  },

  // task-3: industry reports — fails, retries, then completes
  {
    delay: 100,
    event: {
      type: 'tool_call',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-3',
      callId: 'call-3a',
      toolName: 'web_fetch',
      inputSummary: 'Fetch: McKinsey 2024 developer productivity report',
    },
  },
  {
    delay: 600,
    event: {
      type: 'tool_result',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-3',
      callId: 'call-3a',
      outputSummary: 'Error: Rate limit exceeded on external fetch (429).',
    },
  },
  {
    delay: 200,
    event: {
      type: 'task_update',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-3',
      status: 'failed',
      reason: 'Rate limit hit on web_fetch tool (HTTP 429)',
    },
  },
  // Retry
  {
    delay: 800,
    event: {
      type: 'task_update',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-3',
      status: 'running',
    },
  },
  {
    delay: 300,
    event: {
      type: 'agent_thought',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-3',
      agent: 'researcher-b',
      thought: 'Retrying with exponential backoff. Switching to cached mirror endpoint.',
    },
  },
  {
    delay: 400,
    event: {
      type: 'tool_call',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-3',
      callId: 'call-3b',
      toolName: 'web_fetch',
      inputSummary: 'Fetch: McKinsey 2024 report (cached mirror)',
    },
  },
  {
    delay: 700,
    event: {
      type: 'tool_result',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-3',
      callId: 'call-3b',
      outputSummary: 'Success. Retrieved 34-page report. Key stat: 30% reduction in time-to-merge for AI-assisted PRs.',
    },
  },
  {
    delay: 300,
    event: {
      type: 'partial_output',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-3',
      content: 'Industry data confirms productivity gains, particularly in PR cycle time (−30%).',
      isFinal: false,
    },
  },
  {
    delay: 500,
    event: {
      type: 'task_output',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-3',
      content: 'Industry reports confirm: 30% reduction in PR merge time, 25% fewer review cycles. McKinsey and GitHub both cite LLM tools as top productivity driver in 2023–2024.',
      isFinal: true,
      qualityScore: 0.87,
    },
  },

  // task-4: developer surveys
  {
    delay: 200,
    event: {
      type: 'tool_call',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-4',
      callId: 'call-4a',
      toolName: 'survey_database_query',
      inputSummary: 'Query: Stack Overflow Developer Survey 2023–2024, AI tool usage section',
    },
  },
  {
    delay: 900,
    event: {
      type: 'tool_result',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-4',
      callId: 'call-4a',
      outputSummary: '78% of developers report using AI tools weekly. 62% say it improves their output quality.',
    },
  },
  {
    delay: 400,
    event: {
      type: 'partial_output',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-4',
      content: 'Developer sentiment: overwhelmingly positive adoption (78% weekly users).',
      isFinal: false,
    },
  },
  {
    delay: 600,
    event: {
      type: 'task_output',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-4',
      content: 'Developer surveys show 78% weekly AI tool adoption. 62% report quality improvement. Main concern: over-reliance and skill atrophy (cited by 41%).',
      isFinal: true,
      qualityScore: 0.89,
    },
  },

  // --- Final synthesis task ---
  {
    delay: 300,
    event: {
      type: 'task_spawned',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-5',
      label: 'Synthesise findings',
      agent: 'synthesiser',
      parallelGroup: null,
      dependsOn: ['task-2', 'task-3', 'task-4'],
    },
  },
  {
    delay: 300,
    event: {
      type: 'task_update',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-5',
      status: 'running',
    },
  },
  {
    delay: 400,
    event: {
      type: 'agent_thought',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-5',
      agent: 'synthesiser',
      thought: 'Weighting sources by recency and sample size. Academic studies get 40% weight, industry reports 35%, surveys 25%.',
    },
  },
  {
    delay: 500,
    event: {
      type: 'partial_output',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-5',
      content: 'Synthesising across 3 data sources. Weighted confidence: 88%. ',
      isFinal: false,
    },
  },
  {
    delay: 500,
    event: {
      type: 'partial_output',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-5',
      content: 'Key finding emerging: productivity gains are real but context-dependent.',
      isFinal: false,
    },
  },
  {
    delay: 700,
    event: {
      type: 'task_output',
      runId: 'run-001',
      timestamp: Date.now(),
      taskId: 'task-5',
      content: 'Synthesis complete. LLM tools deliver measurable productivity gains (20–55% depending on task type), with strongest effects in boilerplate generation and code review. Real-world gains average 28% when accounting for review overhead. Developer sentiment is broadly positive but concerns around skill atrophy merit attention.',
      isFinal: true,
      qualityScore: 0.94,
    },
  },

  // --- Run complete ---
  {
    delay: 400,
    event: {
      type: 'run_complete',
      runId: 'run-001',
      timestamp: Date.now(),
      finalOutput: `LLM tools have a measurable, positive impact on software engineering productivity, with gains of 20–55% depending on task type and context.

**Key findings:**
- Boilerplate and repetitive code: 40–55% faster generation
- PR review cycles: ~30% shorter time-to-merge (industry data)  
- Real-world net gain: ~28% after review and correction overhead
- Developer adoption: 78% use AI tools weekly; 62% report quality improvement

**Caveats:** Controlled study gains (55%) do not fully translate to production environments. Skill atrophy is a legitimate concern cited by 41% of surveyed developers.

**Confidence:** High (88% weighted across academic, industry, and survey sources)`,
    },
  },
]