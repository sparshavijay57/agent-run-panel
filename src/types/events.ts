
export type RunStartedEvent = {
  type: 'run_started'
  runId: string
  query: string
  timestamp: number
}

export type TaskSpawnedEvent = {
  type: 'task_spawned'
  runId: string
  timestamp: number
  taskId: string
  label: string
  agent: string
  parallelGroup: string | null
  dependsOn: string[]
}


export type TaskUpdateEvent = {
  type: 'task_update'
  runId: string
  timestamp: number
  taskId: string
  status: 'running' | 'complete' | 'failed' | 'cancelled'
  reason?: string
}

export type ToolCallEvent = {
  type: 'tool_call'
  runId: string
  timestamp: number
  taskId: string
  callId: string
  toolName: string
  inputSummary: string
}

export type ToolResultEvent = {
  type: 'tool_result'
  runId: string
  timestamp: number
  taskId: string
  callId: string
  outputSummary: string
}

export type AgentThoughtEvent = {
  type: 'agent_thought'
  runId: string
  timestamp: number
  taskId: string | null   // null = system/coordinator level
  agent: string
  thought: string
}

export type PartialOutputEvent = {
  type: 'partial_output'
  runId: string
  timestamp: number
  taskId: string
  content: string
  isFinal: false
}


export type TaskOutputEvent = {
  type: 'task_output'
  runId: string
  timestamp: number
  taskId: string
  content: string
  isFinal: true
  qualityScore: number
}

export type RunCompleteEvent = {
  type: 'run_complete'
  runId: string
  timestamp: number
  finalOutput: string
}

export type RunErrorEvent = {
  type: 'run_error'
  runId: string
  timestamp: number
  error: string
}

export type RunEvent =
  | RunStartedEvent
  | TaskSpawnedEvent
  | TaskUpdateEvent
  | ToolCallEvent
  | ToolResultEvent
  | AgentThoughtEvent
  | PartialOutputEvent
  | TaskOutputEvent
  | RunCompleteEvent
  | RunErrorEvent

  export type EventType = RunEvent['type']