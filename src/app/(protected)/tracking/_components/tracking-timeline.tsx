import type React from 'react'
interface TimelineEvent {
  id: number
  status: string
  date: string
  time: string
  location: string
  completed: boolean
  icon: React.ComponentType<{ className?: string }>
}

interface TrackingTimelineProps {
  events: TimelineEvent[]
}

export function TrackingTimeline({ events }: TrackingTimelineProps) {
  return (
    <div className="space-y-6">
      {events.map((event, index) => {
        const Icon = event.icon
        const isLast = index === events.length - 1

        return (
          <div key={event.id} className="flex gap-4">
            {/* Timeline dot and line */}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                  event.completed
                    ? 'bg-primary text-primary-foreground'
                    : 'border-2 border-border bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              {!isLast && (
                <div
                  className={`mt-2 h-12 w-1 ${event.completed ? 'bg-primary' : 'bg-muted'}`}
                />
              )}
            </div>

            {/* Event details */}
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-semibold">{event.status}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {event.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{event.date}</p>
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
