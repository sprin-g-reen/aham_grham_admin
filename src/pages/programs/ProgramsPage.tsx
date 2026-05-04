import React from 'react'
import { Link } from 'react-router-dom'

const ProgramsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Program List</h1>
      <p className="text-muted-foreground">Manage your programs here.</p>
      
      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card p-4 rounded-xl border border-border shadow-sm">
            <h3 className="font-semibold text-lg">Program {i}</h3>
            <p className="text-sm text-muted-foreground mt-2">Description for program {i}. This is a placeholder.</p>
            <Link 
              to={`/dashboard/program-details/${i}`}
              className="mt-4 inline-block text-primary text-sm font-medium hover:underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgramsPage
