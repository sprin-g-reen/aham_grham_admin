import React from 'react'
import { Link } from 'react-router-dom'

const EventsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Event List</h1>
      <p className="text-muted-foreground">Manage your events and meetups here.</p>
      
      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card p-4 rounded-xl border border-border shadow-sm">
            <h3 className="font-semibold text-lg">Event {i}</h3>
            <p className="text-sm text-muted-foreground mt-2">Upcoming event {i}. This is a placeholder.</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">May 24, 2026</span>
              <Link 
                to={`/dashboard/event-details/${i}`}
                className="text-primary text-sm font-medium hover:underline"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventsPage
