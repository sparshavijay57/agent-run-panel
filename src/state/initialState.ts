import type { RunState } from '../types'

export const initialState: RunState = {
  runId: null,
  query: '',
  status: 'idle',
  startedAt: null,
  endedAt: null,
  finalOutput: null,
  error: null,
  taskOrder: [],
  tasks: {},
  systemThoughts: [],
}