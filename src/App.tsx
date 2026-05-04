import { useState } from 'react'
import { useRunSimulation } from './hooks/useRunSimulation'

export default function App() {
  const [mode, setMode] = useState<'success' | 'error'>('success')
const { state, restart } = useRunSimulation(mode)

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">
        Agent Run Panel
      </h1>

      <div className="mb-6 flex gap-3">
  <button
    onClick={() => setMode('success')}
    className="px-4 py-2 bg-green-600 rounded"
  >
    Success Flow
  </button>

  <button
    onClick={() => setMode('error')}
    className="px-4 py-2 bg-red-600 rounded"
  >
    Error Flow
  </button>

  <button
    onClick={restart}
    className="px-4 py-2 bg-blue-600 rounded"
  >
    Restart
  </button>
</div>

      <div className="mb-4">
        <p><span className="font-semibold">Run ID:</span> {state.runId}</p>
        <p><span className="font-semibold">Status:</span> {state.status}</p>
        <p><span className="font-semibold">Query:</span> {state.query}</p>
      </div>

{state.systemThoughts.length > 0 && (
  <div className="mb-4 text-sm text-purple-400">
    <p className="font-semibold">System Thoughts:</p>

    {state.systemThoughts.map((t) => (
      <p key={t.id}>• {t.content}</p>
    ))}
  </div>
)}

      <div className="space-y-4">
        {state.taskOrder.map((taskId) => {
          const task = state.tasks[taskId]

          return (
            <div key={taskId} className="border border-gray-800 bg-gray-900 rounded-xl p-4 shadow-md">
              <h2 className="font-semibold text-lg">{task.label}</h2>
              <p className="text-sm text-gray-400">Agent: {task.agent}</p>
              <p>
  Status:{' '}
  {task.toolCalls.length > 0 && (
  <div className="mt-2 text-xs text-gray-400">
    <p className="font-medium">Tool Calls:</p>

    {task.toolCalls.map((call) => (
      <p key={call.callId}>
        {call.toolName} → {call.outputSummary || '...'}
      </p>
    ))}
  </div>
)}
  <span
    className={
      task.status === 'running'
        ? 'text-blue-400'
        : task.status === 'complete'
        ? 'text-green-400'
        : task.status === 'failed'
        ? 'text-red-400'
        : task.status === 'cancelled'
        ? 'text-yellow-400'
        : 'text-gray-400'
    }
  >
    {task.status}
  </span>
</p>

              {/* Partial Outputs */}
              {task.partialOutputs.length > 0 && (
                <div className="mt-2 text-sm text-gray-300">
                  <p className="font-medium">Streaming Output:</p>
                  {task.partialOutputs.map((p) => (
                    <p key={p.index}>• {p.content}</p>
                  ))}
                </div>
              )}

              {/* Final Output */}
              {task.finalOutput && (
                <div className="mt-2 text-green-400 text-sm">
                  <p className="font-medium">Final Output:</p>
                  <p>{task.finalOutput}</p>
                </div>
              )}

              {/* Failures */}
              {task.failureHistory.length > 0 && (
                <div className="mt-2 text-red-400 text-sm">
                  <p className="font-medium">Failures:</p>
                  {task.failureHistory.map((f, i) => (
                    <p key={i}>
                      Attempt {f.attemptNumber}: {f.reason}
                    </p>
                  ))}
                </div>
              )}

              {/* Cancellation */}
              {task.status === 'cancelled' && (
                <p className="text-yellow-400 text-sm mt-2">
                  Cancelled: {task.cancellationReason}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Final Result */}
      {state.finalOutput && (
        <div className="mt-6 p-5 border border-green-600 bg-green-950/40 rounded-xl">
          <h2 className="font-semibold text-lg text-green-400">
            Final Answer
          </h2>
          <p className="mt-2 whitespace-pre-line">{state.finalOutput}</p>
        </div>
      )}
    </div>
  )
}