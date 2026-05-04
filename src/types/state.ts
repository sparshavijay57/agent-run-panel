/**
 * State shape for the entire agent run panel.
 * Derived from events via the reducer — never mutated directly.
 */

export type TaskStatus =
  | 'pending'
  | 'running'
  | 'complete'
  | 'failed'
  | 'cancelled'

export type RunStatus =
  | 'idle'
  | 'running'
  | 'complete'
  | 'failed'

export type ToolCall = {
  callId: string
  toolName: string
  inputSummary: string
  outputSummary: string | null   // null until tool_result arrives
  calledAt: number
  resolvedAt: number | null
}

export type PartialOutput = {
  index: number
  content: string
  isFinal: boolean
  receivedAt: number
}

export type ThoughtEntry = {
  id: string                     // generated on insert: `${taskId ?? 'system'}-${timestamp}`
  content: string
  agent: string
  receivedAt: number
}

/**
 * One entry per failure. Grows on each task_update with status 'failed'.
 * retryCount is derived as failureHistory.length.
 */
export type FailureRecord = {
  attemptNumber: number
  reason: string
  failedAt: number
}

export type TaskState = {
  id: string
  label: string
  agent: string
  status: TaskStatus
  parallelGroup: string | null
  dependsOn: string[]
  toolCalls: ToolCall[]
  partialOutputs: PartialOutput[]
  finalOutput: string | null
  qualityScore: number | null
  thoughts: ThoughtEntry[]
  failureHistory: FailureRecord[]
  cancellationReason: string | null
  startedAt: number | null
  endedAt: number | null
}

export type RunState = {
  runId: string | null
  query: string
  status: RunStatus
  startedAt: number | null
  endedAt: number | null
  finalOutput: string | null
  error: string | null
  taskOrder: string[]                   // insertion order, drives render order
  tasks: Record<string, TaskState>
  systemThoughts: ThoughtEntry[]        // agent_thought where taskId === null
}