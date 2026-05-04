import type { RunState, TaskState, ThoughtEntry, RunEvent } from '../types'
import { initialState } from './initialState'


export function runReducer(state: RunState, event: RunEvent): RunState {
  switch (event.type) {

    case 'run_started': {
      return {
        ...initialState,               // reset everything for a fresh run
        runId: event.runId,
        query: event.query,
        status: 'running',
        startedAt: event.timestamp,
      }
    }

    case 'task_spawned': {
      const newTask: TaskState = {
        id: event.taskId,
        label: event.label,
        agent: event.agent,
        status: 'pending',
        parallelGroup: event.parallelGroup,
        dependsOn: event.dependsOn,
        toolCalls: [],
        partialOutputs: [],
        finalOutput: null,
        qualityScore: null,
        thoughts: [],
        failureHistory: [],
        cancellationReason: null,
        startedAt: null,
        endedAt: null,
      }

      return {
        ...state,
        taskOrder: [...state.taskOrder, event.taskId],
        tasks: {
          ...state.tasks,
          [event.taskId]: newTask,
        },
      }
    }

    case 'task_update': {
      const task = state.tasks[event.taskId]
      if (!task) return state   // guard: unknown task

      switch (event.status) {

        case 'running': {
  const isRetry = task.failureHistory.length > 0

  return updateTask(state, event.taskId, {
    status: 'running',
    startedAt: task.startedAt ?? event.timestamp,
    partialOutputs: isRetry ? [] : task.partialOutputs,
  })
}

        case 'failed': {
          const failureRecord = {
            attemptNumber: task.failureHistory.length + 1,
            reason: event.reason ?? 'Unknown error',
            failedAt: event.timestamp,
          }
          return updateTask(state, event.taskId, {
            status: 'failed',
            endedAt: event.timestamp,
            failureHistory: [...task.failureHistory, failureRecord],
          })
        }

        case 'cancelled': {
          return updateTask(state, event.taskId, {
            status: 'cancelled',
            endedAt: event.timestamp,
            cancellationReason: event.reason ?? null,
          })
        }

        case 'complete': {
          return updateTask(state, event.taskId, {
            status: 'complete',
            endedAt: event.timestamp,
          })
        }

        default:
          return state
      }
    }

    case 'tool_call': {
      const task = state.tasks[event.taskId]
      if (!task) return state

      const newCall = {
        callId: event.callId,
        toolName: event.toolName,
        inputSummary: event.inputSummary,
        outputSummary: null,
        calledAt: event.timestamp,
        resolvedAt: null,
      }

      return updateTask(state, event.taskId, {
        toolCalls: [...task.toolCalls, newCall],
      })
    }

    case 'tool_result': {
      const task = state.tasks[event.taskId]
      if (!task) return state

      const updatedCalls = task.toolCalls.map(call =>
        call.callId === event.callId
          ? { ...call, outputSummary: event.outputSummary, resolvedAt: event.timestamp }
          : call
      )

      return updateTask(state, event.taskId, {
        toolCalls: updatedCalls,
      })
    }

    case 'agent_thought': {
      const thought: ThoughtEntry = {
        id: `${event.taskId ?? 'system'}-${event.timestamp}`,
        content: event.thought,
        agent: event.agent,
        receivedAt: event.timestamp,
      }

      // System-level thought (taskId null) goes to systemThoughts
      if (event.taskId === null) {
        return {
          ...state,
          systemThoughts: [...state.systemThoughts, thought],
        }
      }

      // Task-scoped thought
      const task = state.tasks[event.taskId]
      if (!task) return state

      return updateTask(state, event.taskId, {
        thoughts: [...task.thoughts, thought],
      })
    }

    case 'partial_output': {
      const task = state.tasks[event.taskId]
      if (!task) return state

      const newPartial = {
        index: task.partialOutputs.length,
        content: event.content,
        isFinal: false,
        receivedAt: event.timestamp,
      }

      return updateTask(state, event.taskId, {
        partialOutputs: [...task.partialOutputs, newPartial],
      })
    }

    case 'task_output': {
      const task = state.tasks[event.taskId]
      if (!task) return state

      return updateTask(state, event.taskId, {
        finalOutput: event.content,
        qualityScore: event.qualityScore,
        status: 'complete',
        endedAt: event.timestamp,
      })
    }

    case 'run_complete': {
      return {
        ...state,
        status: 'complete',
        endedAt: event.timestamp,
        finalOutput: event.finalOutput,
      }
    }

    case 'run_error': {
      return {
        ...state,
        status: 'failed',
        endedAt: event.timestamp,
        error: event.error,
      }
    }

    default: {
      // TypeScript exhaustiveness check
      const _exhaustive: never = event
      console.warn('Unhandled event type:', _exhaustive)
      return state
    }
  }
}


function updateTask(
  state: RunState,
  taskId: string,
  patch: Partial<TaskState>
): RunState {
  return {
    ...state,
    tasks: {
      ...state.tasks,
      [taskId]: {
        ...state.tasks[taskId],
        ...patch,
      },
    },
  }
}