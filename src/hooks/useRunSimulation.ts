import { useEffect, useReducer, useRef } from 'react'
import { runReducer, initialState } from '../state'
import { MockEventEmitter, successFlow, errorFlow } from '../mocks'
import type { RunEvent } from '../types'

type Mode = 'success' | 'error'

export function useRunSimulation(mode: Mode = 'success') {
  const [state, dispatch] = useReducer(runReducer, initialState)

  const emitterRef = useRef<MockEventEmitter | null>(null)

  useEffect(() => {
    // Stop previous emitter if exists
    emitterRef.current?.stop()

    const fixture = mode === 'success' ? successFlow : errorFlow

    const emitter = new MockEventEmitter(fixture, {
      onEvent: (event: RunEvent) => {
        dispatch(event)
      },
      onComplete: () => {
        console.log('Simulation complete')
      },
    })

    emitter.start()
    emitterRef.current = emitter

    return () => {
      emitter.stop()
    }
  }, [mode])

  return {
    state,
    restart: () => {
      emitterRef.current?.stop()

      const fixture = mode === 'success' ? successFlow : errorFlow

      const emitter = new MockEventEmitter(fixture, {
        onEvent: dispatch,
      })

      emitter.start()
      emitterRef.current = emitter
    },
  }
}