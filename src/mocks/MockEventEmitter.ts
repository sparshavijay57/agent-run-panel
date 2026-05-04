import type { RunEvent } from '../types/events'

export type FixtureEvent = {
  delay: number       // ms after the previous event (not after run start)
  event: RunEvent
}

type EmitterOptions = {
  onEvent: (event: RunEvent) => void
  onComplete?: () => void
}


export class MockEventEmitter {
  private timers: ReturnType<typeof setTimeout>[] = []
  private stopped = false

  private fixture: FixtureEvent[]
  private options: EmitterOptions

 constructor(fixture: FixtureEvent[], options: EmitterOptions) {
  this.fixture = fixture
  this.options = options
}

  start() {
    this.stopped = false
    let accumulated = 0

    for (const item of this.fixture) {
      accumulated += item.delay

      const timer = setTimeout(() => {
        if (this.stopped) return
        this.options.onEvent(item.event)
      }, accumulated)

      this.timers.push(timer)
    }

    // Fire onComplete after all events
    const totalDuration = this.fixture.reduce((sum, e) => sum + e.delay, 0)
    const finalTimer = setTimeout(() => {
      if (!this.stopped) this.options.onComplete?.()
    }, totalDuration + 50)

    this.timers.push(finalTimer)
  }

  stop() {
    this.stopped = true
    this.timers.forEach((t) => clearTimeout(t))
    this.timers = []
  }
}